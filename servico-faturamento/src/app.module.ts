import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PagamentoSchema } from './infrastructure/database/schemas/pagamento.schema.js';
import { PagamentoRepository } from './infrastructure/repositories/pagamento.repository.js';
import { IPagamentoRepository } from './application/ports/pagamento.repository.interface.js';
import { RegistrarPagamentoUseCase } from './application/use-cases/registrar-pagamento.use-case.js';
import { FaturamentoController } from './presentation/controllers/faturamento.controller.js';
import { RabbitMqPublisher } from './infrastructure/messaging/rabbitmq.publisher.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database-faturamento.sqlite',
      entities: [PagamentoSchema],
      synchronize: true, // Apenas para facilitar no trabalho de faculdade
    }),
    TypeOrmModule.forFeature([PagamentoSchema]),
  ],
  controllers: [FaturamentoController],
  providers: [
    { provide: IPagamentoRepository, useClass: PagamentoRepository },
    RegistrarPagamentoUseCase,
    RabbitMqPublisher,
  ],
})
export class AppModule {}
