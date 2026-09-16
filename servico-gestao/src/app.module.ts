import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Schemas ORM (camada de infraestrutura)
import { ClienteSchema } from './infrastructure/database/schemas/cliente.schema.js';
import { PlanoSchema } from './infrastructure/database/schemas/plano.schema.js';
import { AssinaturaSchema } from './infrastructure/database/schemas/assinatura.schema.js';

// Repositórios (camada de infraestrutura)
import { ClienteRepository } from './infrastructure/repositories/cliente.repository.js';
import { PlanoRepository } from './infrastructure/repositories/plano.repository.js';
import { AssinaturaRepository } from './infrastructure/repositories/assinatura.repository.js';

// Interfaces (portas — para inversão de dependência)
import { IClienteRepository } from './application/ports/cliente.repository.interface.js';
import { IPlanoRepository } from './application/ports/plano.repository.interface.js';
import { IAssinaturaRepository } from './application/ports/assinatura.repository.interface.js';

// Casos de uso (camada de aplicação)
import { ListarClientesUseCase } from './application/use-cases/cliente/listar-clientes.use-case.js';
import { ListarPlanosUseCase } from './application/use-cases/plano/listar-planos.use-case.js';
import { AtualizarCustoMensalUseCase } from './application/use-cases/plano/atualizar-custo-mensal.use-case.js';
import { CriarAssinaturaUseCase } from './application/use-cases/assinatura/criar-assinatura.use-case.js';
import { ListarAssinaturasPorTipoUseCase } from './application/use-cases/assinatura/listar-assinaturas-por-tipo.use-case.js';
import { ListarAssinaturasPorClienteUseCase } from './application/use-cases/assinatura/listar-assinaturas-por-cliente.use-case.js';
import { ListarAssinaturasPorPlanoUseCase } from './application/use-cases/assinatura/listar-assinaturas-por-plano.use-case.js';

// Controller (camada de apresentação)
import { GestaoController } from './presentation/controllers/gestao.controller.js';

// Serviço de seeding (infraestrutura)
import { SeedService } from './infrastructure/database/seed.service.js';

@Module({
  imports: [
    // Configuração do TypeORM com SQLite — banco de dados local, ideal para desenvolvimento
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [ClienteSchema, PlanoSchema, AssinaturaSchema],
      // synchronize: true cria/atualiza as tabelas automaticamente — bom para dev, nunca em produção
      synchronize: true,
    }),
    // Registra os repositórios TypeORM para os schemas
    TypeOrmModule.forFeature([ClienteSchema, PlanoSchema, AssinaturaSchema]),
  ],
  controllers: [GestaoController],
  providers: [
    // Inversão de dependência: o módulo decide qual implementação usar para cada interface
    { provide: IClienteRepository, useClass: ClienteRepository },
    { provide: IPlanoRepository, useClass: PlanoRepository },
    { provide: IAssinaturaRepository, useClass: AssinaturaRepository },

    // Casos de uso registrados como providers para injeção no controller
    ListarClientesUseCase,
    ListarPlanosUseCase,
    AtualizarCustoMensalUseCase,
    CriarAssinaturaUseCase,
    ListarAssinaturasPorTipoUseCase,
    ListarAssinaturasPorClienteUseCase,
    ListarAssinaturasPorPlanoUseCase,

    // Serviço de seeding — roda na inicialização via OnModuleInit
    SeedService,
  ],
})
export class AppModule {}