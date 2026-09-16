import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { Module } from '@nestjs/common';

import { CacheAssinaturas } from '../src/domain/cache/cache-assinaturas.js';
import { GestaoHttpClient } from '../src/infrastructure/http/gestao-http.client.js';
import { RabbitMqConsumer } from '../src/infrastructure/messaging/rabbitmq.consumer.js';
import { ConsultarPlanoAtivoUseCase } from '../src/application/use-cases/consultar-plano-ativo.use-case.js';
import { PlanosAtivosController } from '../src/presentation/controllers/planos-ativos.controller.js';

// Módulo de teste com Mock do HTTP Client e do Consumer
@Module({
  imports: [],
  controllers: [PlanosAtivosController],
  providers: [
    CacheAssinaturas,
    {
      provide: GestaoHttpClient,
      useValue: {
        verificarAssinaturaAtiva: vi.fn().mockResolvedValue(true),
      },
    },
    {
      provide: RabbitMqConsumer,
      useValue: {
        onModuleInit: vi.fn(),
      },
    },
    ConsultarPlanoAtivoUseCase,
  ],
})
class TestAppModule {}

describe('ServicoPlanosAtivos (e2e)', () => {
  let app: INestApplication<App>;
  let httpClientMock: GestaoHttpClient;
  let cache: CacheAssinaturas;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    httpClientMock = moduleFixture.get(GestaoHttpClient);
    cache = moduleFixture.get(CacheAssinaturas);
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /planosativos/:codass — deve retornar true após cache miss (mock chamou gestao)', async () => {
    const res = await request(app.getHttpServer()).get('/planosativos/1');
    expect(res.status).toBe(200);
    expect(res.text).toBe('true');
    expect(httpClientMock.verificarAssinaturaAtiva).toHaveBeenCalledWith(1);
    
    // Verifica se salvou no cache
    expect(cache.get(1)).toBe(true);
  });

  it('GET /planosativos/:codass — deve retornar valor do cache sem chamar gestao na segunda vez', async () => {
    // Limpa o mock para garantir que não será chamado de novo
    vi.clearAllMocks();

    const res = await request(app.getHttpServer()).get('/planosativos/1');
    expect(res.status).toBe(200);
    expect(res.text).toBe('true');
    
    // Não deve ter chamado o HTTP client novamente
    expect(httpClientMock.verificarAssinaturaAtiva).not.toHaveBeenCalled();
  });

  it('Cache Invalidation — deve consultar de novo após evento RabbitMQ', async () => {
    // Simula a invalidação que seria feita pelo consumer
    cache.invalidate(1);
    
    const res = await request(app.getHttpServer()).get('/planosativos/1');
    expect(res.status).toBe(200);
    expect(res.text).toBe('true');
    
    // Agora deve ter chamado novamente
    expect(httpClientMock.verificarAssinaturaAtiva).toHaveBeenCalledWith(1);
  });
});
