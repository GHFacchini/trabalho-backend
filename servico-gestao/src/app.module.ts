import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Schemas ORM
import { ClienteSchema } from './infrastructure/database/schemas/cliente.schema.js';
import { PlanoSchema } from './infrastructure/database/schemas/plano.schema.js';
import { AssinaturaSchema } from './infrastructure/database/schemas/assinatura.schema.js';

// Repositórios
import { ClienteRepository } from './infrastructure/repositories/cliente.repository.js';
import { PlanoRepository } from './infrastructure/repositories/plano.repository.js';
import { AssinaturaRepository } from './infrastructure/repositories/assinatura.repository.js';

// Interfaces (inversão de dependência)
import { IClienteRepository } from './application/ports/cliente.repository.interface.js';
import { IPlanoRepository } from './application/ports/plano.repository.interface.js';
import { IAssinaturaRepository } from './application/ports/assinatura.repository.interface.js';

// Casos de uso
import { ListarClientesUseCase } from './application/use-cases/cliente/listar-clientes.use-case.js';
import { ListarPlanosUseCase } from './application/use-cases/plano/listar-planos.use-case.js';
import { AtualizarCustoMensalUseCase } from './application/use-cases/plano/atualizar-custo-mensal.use-case.js';
import { CriarAssinaturaUseCase } from './application/use-cases/assinatura/criar-assinatura.use-case.js';
import { ListarAssinaturasPorTipoUseCase } from './application/use-cases/assinatura/listar-assinaturas-por-tipo.use-case.js';
import { ListarAssinaturasPorClienteUseCase } from './application/use-cases/assinatura/listar-assinaturas-por-cliente.use-case.js';
import { ListarAssinaturasPorPlanoUseCase } from './application/use-cases/assinatura/listar-assinaturas-por-plano.use-case.js';
import { VerificarAssinaturaAtivaUseCase } from './application/use-cases/assinatura/verificar-assinatura-ativa.use-case.js';

// Controller
import { GestaoController } from './presentation/controllers/gestao.controller.js';

// Infraestrutura
import { SeedService } from './infrastructure/database/seed.service.js';
import { RabbitMqConsumer } from './infrastructure/messaging/rabbitmq.consumer.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
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

    SeedService,
    RabbitMqConsumer,
  ],
})
export class AppModule {}