import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { GestaoController } from './presentation/controllers/gestao.controller.js';
import { IClienteRepository } from './application/ports/cliente.repository.interface.js';
import { IPlanoRepository } from './application/ports/plano.repository.interface.js';
import { IAssinaturaRepository } from './application/ports/assinatura.repository.interface.js';
import { ClienteRepository } from './infrastructure/repositories/cliente.repository.js';
import { PlanoRepository } from './infrastructure/repositories/plano.repository.js';
import { AssinaturaRepository } from './infrastructure/repositories/assinatura.repository.js';
import { Cliente } from './domain/entities/cliente.entity.js';
import { Plano } from './domain/entities/plano.entity.js';
import { Assinatura } from './domain/entities/assinatura.entity.js';

@Module({
  imports: [],
  controllers: [GestaoController],
  providers: [
    { provide: IClienteRepository, useClass: ClienteRepository },
    { provide: IPlanoRepository, useClass: PlanoRepository },
    { provide: IAssinaturaRepository, useClass: AssinaturaRepository },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(IClienteRepository) private clienteRepo: IClienteRepository,
    @Inject(IPlanoRepository) private planoRepo: IPlanoRepository,
    @Inject(IAssinaturaRepository) private assinaturaRepo: IAssinaturaRepository,
  ) {}

  async onModuleInit() {
    // populando nosso banco em memória (seeding maroto)
    for (let i = 1; i <= 10; i++) {
      await this.clienteRepo.salvar(new Cliente(i, `Cliente ${i}`, `cliente${i}@email.com`));
    }

    for (let i = 1; i <= 5; i++) {
      await this.planoRepo.salvar(new Plano(i, `Plano ${i}`, 50.0 + i*10, new Date(), `Descrição do Plano ${i}`));
    }

    for (let i = 1; i <= 5; i++) {
      const ass = new Assinatura(
        i,
        i, // codPlano
        i * 2, // codCli
        new Date(),
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 ano de fidelidade
        new Date(),
        50.0 + i*10,
        `Assinatura seed ${i}`,
        'ATIVOS'
      );
      await this.assinaturaRepo.salvar(ass);
    }
    console.log('Seeding concluído! 🚀 10 clientes, 5 planos e 5 assinaturas.');
  }
}