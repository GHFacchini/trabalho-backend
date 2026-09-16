import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { IClienteRepository } from '../../application/ports/cliente.repository.interface.js';
import { IPlanoRepository } from '../../application/ports/plano.repository.interface.js';
import { IAssinaturaRepository } from '../../application/ports/assinatura.repository.interface.js';
import { Cliente } from '../../domain/entities/cliente.entity.js';
import { Plano } from '../../domain/entities/plano.entity.js';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @Inject(IClienteRepository) private readonly clienteRepo: IClienteRepository,
    @Inject(IPlanoRepository) private readonly planoRepo: IPlanoRepository,
    @Inject(IAssinaturaRepository) private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async onModuleInit() {
    await this.seedClientes();
    await this.seedPlanos();
    await this.seedAssinaturas();
  }

  private async seedClientes() {
    const existentes = await this.clienteRepo.listarTodos();
    // Só popula se o banco estiver vazio para não duplicar a cada restart
    if (existentes.length > 0) return;

    const clientes = [
      new Cliente(0, 'Ana Lima', 'ana.lima@email.com'),
      new Cliente(0, 'Bruno Mendes', 'bruno.mendes@email.com'),
      new Cliente(0, 'Carla Souza', 'carla.souza@email.com'),
      new Cliente(0, 'Diego Rocha', 'diego.rocha@email.com'),
      new Cliente(0, 'Eduarda Costa', 'eduarda.costa@email.com'),
      new Cliente(0, 'Fábio Nunes', 'fabio.nunes@email.com'),
      new Cliente(0, 'Gabriela Pinto', 'gabriela.pinto@email.com'),
      new Cliente(0, 'Henrique Alves', 'henrique.alves@email.com'),
      new Cliente(0, 'Isabela Ferreira', 'isabela.ferreira@email.com'),
      new Cliente(0, 'João Batista', 'joao.batista@email.com'),
    ];

    for (const cliente of clientes) {
      await this.clienteRepo.salvar(cliente);
    }
    console.log('Seed: 10 clientes inseridos.');
  }

  private async seedPlanos() {
    const existentes = await this.planoRepo.listarTodos();
    if (existentes.length > 0) return;

    const planos = [
      new Plano(0, 'Plano Básico 50MB', 59.9, new Date(), 'Internet 50MB para uso residencial'),
      new Plano(0, 'Plano Essencial 100MB', 79.9, new Date(), 'Internet 100MB para famílias'),
      new Plano(0, 'Plano Plus 200MB', 99.9, new Date(), 'Internet 200MB com Wi-Fi grátis'),
      new Plano(0, 'Plano Ultra 500MB', 129.9, new Date(), 'Internet 500MB fibra óptica'),
      new Plano(0, 'Plano Giga 1GB', 179.9, new Date(), 'Plano giga para uso intensivo'),
    ];

    for (const plano of planos) {
      await this.planoRepo.salvar(plano);
    }
    console.log('Seed: 5 planos inseridos.');
  }

  private async seedAssinaturas() {
    const existentes = await this.assinaturaRepo.listarTodas();
    if (existentes.length > 0) return;

    // Busca os IDs reais gerados pelo banco após o seed de clientes e planos
    const clientes = await this.clienteRepo.listarTodos();
    const planos = await this.planoRepo.listarTodos();

    if (clientes.length < 5 || planos.length < 5) return;

    const agora = new Date();
    // Assinatura ativa: pago há menos de 30 dias
    const pagoRecentemente = new Date(agora.getTime() - 15 * 24 * 60 * 60 * 1000);
    // Assinatura cancelada: pago há mais de 30 dias
    const pagoHaMuitoTempo = new Date(agora.getTime() - 45 * 24 * 60 * 60 * 1000);

    const assinaturasData = [
      { codCli: clientes[0].codigo, codPlano: planos[0].codigo, custoFinal: 49.9, descricao: 'Promoção Black Friday', dataUltimoPagamento: pagoRecentemente },
      { codCli: clientes[1].codigo, codPlano: planos[1].codigo, custoFinal: 69.9, descricao: 'Plano fidelidade 12 meses', dataUltimoPagamento: pagoRecentemente },
      { codCli: clientes[2].codigo, codPlano: planos[2].codigo, custoFinal: 89.9, descricao: 'Cliente antigo com desconto', dataUltimoPagamento: pagoRecentemente },
      // Assinaturas que serão CANCELADAS (dataUltimoPagamento > 30 dias)
      { codCli: clientes[3].codigo, codPlano: planos[3].codigo, custoFinal: 119.9, descricao: 'Cancelado por inadimplência', dataUltimoPagamento: pagoHaMuitoTempo },
      { codCli: clientes[4].codigo, codPlano: planos[4].codigo, custoFinal: 159.9, descricao: 'Cancelado por mudança de endereço', dataUltimoPagamento: pagoHaMuitoTempo },
    ];

    for (const dados of assinaturasData) {
      const assinatura = await this.assinaturaRepo.criar({
        codCli: dados.codCli,
        codPlano: dados.codPlano,
        custoFinal: dados.custoFinal,
        descricao: dados.descricao,
      });
      // Sobrescreve a dataUltimoPagamento para simular diferentes cenários de status
      await this.assinaturaRepo.atualizarUltimoPagamento(assinatura.codigo, dados.dataUltimoPagamento);
    }
    console.log('Seed: 5 assinaturas inseridas (3 ativas, 2 canceladas).');
  }
}
