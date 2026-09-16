import { Module } from '@nestjs/common';
import { CacheAssinaturas } from './domain/cache/cache-assinaturas.js';
import { GestaoHttpClient } from './infrastructure/http/gestao-http.client.js';
import { RabbitMqConsumer } from './infrastructure/messaging/rabbitmq.consumer.js';
import { ConsultarPlanoAtivoUseCase } from './application/use-cases/consultar-plano-ativo.use-case.js';
import { PlanosAtivosController } from './presentation/controllers/planos-ativos.controller.js';

@Module({
  imports: [],
  controllers: [PlanosAtivosController],
  providers: [
    CacheAssinaturas,
    GestaoHttpClient,
    RabbitMqConsumer,
    ConsultarPlanoAtivoUseCase,
  ],
})
export class AppModule {}
