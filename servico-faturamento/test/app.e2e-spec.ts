import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types';
import { Module } from '@nestjs/common';

import { PagamentoSchema } from '../src/infrastructure/database/schemas/pagamento.schema.js';
import { PagamentoRepository } from '../src/infrastructure/repositories/pagamento.repository.js';
import { IPagamentoRepository } from '../src/application/ports/pagamento.repository.interface.js';
import { RegistrarPagamentoUseCase } from '../src/application/use-cases/registrar-pagamento.use-case.js';
import { FaturamentoController } from '../src/presentation/controllers/faturamento.controller.js';
import { RabbitMqPublisher } from '../src/infrastructure/messaging/rabbitmq.publisher.js';

// Módulo de teste: SQLite em memória e RabbitMQ mockado
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [PagamentoSchema],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([PagamentoSchema]),
  ],
  controllers: [FaturamentoController],
  providers: [
    { provide: IPagamentoRepository, useClass: PagamentoRepository },
    RegistrarPagamentoUseCase,
    // Mock do publisher para os testes (não conecta no broker)
    {
      provide: RabbitMqPublisher,
      useValue: {
        onModuleInit: vi.fn(),
        publish: vi.fn(),
        onModuleDestroy: vi.fn(),
      },
    },
  ],
})
class TestAppModule {}

describe('ServicoFaturamento (e2e)', () => {
  let app: INestApplication<App>;
  let publisherMock: RabbitMqPublisher;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    publisherMock = moduleFixture.get(RabbitMqPublisher);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /registrarpagamento — deve registrar com sucesso e disparar eventos', async () => {
    const payload = { dia: 15, mes: 9, ano: 2026, codAss: 1, valorPago: 99.9 };
    
    const res = await request(app.getHttpServer())
      .post('/registrarpagamento')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('codigo');
    expect(res.body.codAss).toBe(1);
    
    // Verifica se os eventos foram publicados
    expect(publisherMock.publish).toHaveBeenCalledWith('pagamento.gestao', payload);
    expect(publisherMock.publish).toHaveBeenCalledWith('pagamento.planosativos', payload);
  });

  it('POST /registrarpagamento — deve falhar para dados inválidos', async () => {
    const res = await request(app.getHttpServer())
      .post('/registrarpagamento')
      .send({ dia: 32, mes: 9, ano: 2026, codAss: 1, valorPago: 99.9 }); // dia 32 inválido

    expect(res.status).toBe(400);
  });
});
