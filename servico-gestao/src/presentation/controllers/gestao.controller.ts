import { Controller, Get, Post, Patch, Body, Param, Inject } from '@nestjs/common';
import { IClienteRepository } from '../../application/ports/cliente.repository.interface.js';
import { IPlanoRepository } from '../../application/ports/plano.repository.interface.js';
import { IAssinaturaRepository } from '../../application/ports/assinatura.repository.interface.js';

@Controller('gerenciaplanos')
export class GestaoController {
  // Injeção de dependência para desacoplar a camada de infraestrutura
  constructor(
    @Inject(IClienteRepository) private clienteRepo: IClienteRepository,
    @Inject(IPlanoRepository) private planoRepo: IPlanoRepository,
    @Inject(IAssinaturaRepository) private assinaturaRepo: IAssinaturaRepository,
  ) { }

  @Get('clientes')
  async listarClientes() {
    return this.clienteRepo.listarTodos();
  }

  @Get('planos')
  async listarPlanos() {
    return this.planoRepo.listarTodos();
  }

  @Post('assinaturas')
  async criarAssinatura(@Body() body: any) {
    // Recebe os dados do corpo da requisição: codCli, codPlano, custoFinal, descricao
    return this.assinaturaRepo.criar(body);
  }

  @Patch('planos/:idPlano')
  async atualizarCustoMensal(@Param('idPlano') idPlano: string, @Body() body: any) {
    return this.planoRepo.atualizarCustoMensal(Number(idPlano), body.custoMensal);
  }

  @Get('assinaturas/:tipo')
  async listarAssinaturas(@Param('tipo') tipo: 'TODOS' | 'ATIVOS' | 'CANCELADOS') {
    return this.assinaturaRepo.listarPorTipo(tipo);
  }

  @Get('asscli/:codcli')
  async listarAssinaturasPorCliente(@Param('codcli') codcli: string) {
    return this.assinaturaRepo.listarPorCliente(Number(codcli));
  }

  @Get('assinaturaplano/:codplano')
  async listarAssinaturasPorPlano(@Param('codplano') codplano: string) {
    return this.assinaturaRepo.listarPorPlano(Number(codplano));
  }
}