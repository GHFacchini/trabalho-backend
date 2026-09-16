import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import type { App } from 'supertest/types';

import { ClienteSchema } from '../src/infrastructure/database/schemas/cliente.schema.js';
import { PlanoSchema } from '../src/infrastructure/database/schemas/plano.schema.js';
import { AssinaturaSchema } from '../src/infrastructure/database/schemas/assinatura.schema.js';
import { ClienteRepository } from '../src/infrastructure/repositories/cliente.repository.js';
import { PlanoRepository } from '../src/infrastructure/repositories/plano.repository.js';
import { AssinaturaRepository } from '../src/infrastructure/repositories/assinatura.repository.js';
import { IClienteRepository } from '../src/application/ports/cliente.repository.interface.js';
import { IPlanoRepository } from '../src/application/ports/plano.repository.interface.js';
import { IAssinaturaRepository } from '../src/application/ports/assinatura.repository.interface.js';
import { ListarClientesUseCase } from '../src/application/use-cases/cliente/listar-clientes.use-case.js';
import { ListarPlanosUseCase } from '../src/application/use-cases/plano/listar-planos.use-case.js';
import { AtualizarCustoMensalUseCase } from '../src/application/use-cases/plano/atualizar-custo-mensal.use-case.js';
import { CriarAssinaturaUseCase } from '../src/application/use-cases/assinatura/criar-assinatura.use-case.js';
import { ListarAssinaturasPorTipoUseCase } from '../src/application/use-cases/assinatura/listar-assinaturas-por-tipo.use-case.js';
import { ListarAssinaturasPorClienteUseCase } from '../src/application/use-cases/assinatura/listar-assinaturas-por-cliente.use-case.js';
import { ListarAssinaturasPorPlanoUseCase } from '../src/application/use-cases/assinatura/listar-assinaturas-por-plano.use-case.js';
import { VerificarAssinaturaAtivaUseCase } from '../src/application/use-cases/assinatura/verificar-assinatura-ativa.use-case.js';
import { GestaoController } from '../src/presentation/controllers/gestao.controller.js';
import { Module } from '@nestjs/common';

// Módulo de teste isolado: sem SeedService, sem RabbitMQ, banco em memória
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      entities: [ClienteSchema, PlanoSchema, AssinaturaSchema],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ClienteSchema, PlanoSchema, AssinaturaSchema]),
  ],
  controllers: [GestaoController],
  providers: [
    { provide: IClienteRepository, useClass: ClienteRepository },
    { provide: IPlanoRepository, useClass: PlanoRepository },
    { provide: IAssinaturaRepository, useClass: AssinaturaRepository },
    ListarClientesUseCase,
    ListarPlanosUseCase,
    AtualizarCustoMensalUseCase,
    CriarAssinaturaUseCase,
    ListarAssinaturasPorTipoUseCase,
    ListarAssinaturasPorClienteUseCase,
    ListarAssinaturasPorPlanoUseCase,
    VerificarAssinaturaAtivaUseCase,
  ],
})
class TestAppModule {}

describe('ServicoGestao (e2e)', () => {
  let app: INestApplication<App>;

  // IDs gerados pelo banco durante os testes
  let clienteId: number;
  let planoId: number;
  let assinaturaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Insere dados básicos para os testes que precisam de ID real
    const clienteRepo: IClienteRepository = moduleFixture.get(IClienteRepository);
    const planoRepo: IPlanoRepository = moduleFixture.get(IPlanoRepository);
    const { Cliente } = await import('../src/domain/entities/cliente.entity.js');
    const { Plano } = await import('../src/domain/entities/plano.entity.js');

    const cliente = await clienteRepo.salvar(new Cliente(0, 'Teste Silva', 'teste@email.com'));
    const plano = await planoRepo.salvar(new Plano(0, 'Plano Teste', 99.9, new Date(), 'Descricao teste'));
    clienteId = cliente.codigo;
    planoId = plano.codigo;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /gerenciaplanos/clientes — deve retornar lista de clientes', async () => {
    const res = await request(app.getHttpServer()).get('/gerenciaplanos/clientes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /gerenciaplanos/planos — deve retornar lista de planos', async () => {
    const res = await request(app.getHttpServer()).get('/gerenciaplanos/planos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /gerenciaplanos/assinaturas — deve criar assinatura com sucesso', async () => {
    const res = await request(app.getHttpServer())
      .post('/gerenciaplanos/assinaturas')
      .send({ codCli: clienteId, codPlano: planoId, custoFinal: 79.9, descricao: 'Teste e2e' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('codigo');
    assinaturaId = res.body.codigo;
  });

  it('POST /gerenciaplanos/assinaturas — deve retornar 404 para cliente inexistente', async () => {
    const res = await request(app.getHttpServer())
      .post('/gerenciaplanos/assinaturas')
      .send({ codCli: 9999, codPlano: planoId, custoFinal: 79.9, descricao: 'Teste' });
    expect(res.status).toBe(404);
  });

  it('GET /gerenciaplanos/assinaturas/TODOS — deve retornar todas as assinaturas', async () => {
    const res = await request(app.getHttpServer()).get('/gerenciaplanos/assinaturas/TODOS');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /gerenciaplanos/assinaturas/ATIVOS — deve retornar assinaturas ativas', async () => {
    const res = await request(app.getHttpServer()).get('/gerenciaplanos/assinaturas/ATIVOS');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // A assinatura criada no teste anterior deve estar ativa (paga agora)
    expect(res.body.every((a: { status: string }) => a.status === 'ATIVO')).toBe(true);
  });

  it('GET /gerenciaplanos/assinaturas/INVALIDO — deve retornar 400', async () => {
    const res = await request(app.getHttpServer()).get('/gerenciaplanos/assinaturas/INVALIDO');
    expect(res.status).toBe(400);
  });

  it('GET /gerenciaplanos/assinaturas/:codass/ativa — deve retornar { ativa: true } para assinatura recente', async () => {
    const res = await request(app.getHttpServer()).get(
      `/gerenciaplanos/assinaturas/${assinaturaId}/ativa`,
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ativa: true });
  });

  it('GET /gerenciaplanos/assinaturas/:codass/ativa — deve retornar 404 para assinatura inexistente', async () => {
    const res = await request(app.getHttpServer()).get('/gerenciaplanos/assinaturas/9999/ativa');
    expect(res.status).toBe(404);
  });
});
