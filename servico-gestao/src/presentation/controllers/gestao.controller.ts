import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ListarClientesUseCase } from '../../application/use-cases/cliente/listar-clientes.use-case.js';
import { ListarPlanosUseCase } from '../../application/use-cases/plano/listar-planos.use-case.js';
import { AtualizarCustoMensalUseCase } from '../../application/use-cases/plano/atualizar-custo-mensal.use-case.js';
import { CriarAssinaturaUseCase } from '../../application/use-cases/assinatura/criar-assinatura.use-case.js';
import { ListarAssinaturasPorTipoUseCase } from '../../application/use-cases/assinatura/listar-assinaturas-por-tipo.use-case.js';
import type { TipoFiltroAssinatura } from '../../application/use-cases/assinatura/listar-assinaturas-por-tipo.use-case.js';
import { ListarAssinaturasPorClienteUseCase } from '../../application/use-cases/assinatura/listar-assinaturas-por-cliente.use-case.js';
import { ListarAssinaturasPorPlanoUseCase } from '../../application/use-cases/assinatura/listar-assinaturas-por-plano.use-case.js';

// Controller limpo: recebe requisições HTTP e delega para os casos de uso
// Não contém lógica de negócio — só orquestra entrada e saída
@Controller('gerenciaplanos')
export class GestaoController {
  constructor(
    // Injeção de dependência via construtor — cada use case é uma responsabilidade isolada
    private readonly listarClientesUseCase: ListarClientesUseCase,
    private readonly listarPlanosUseCase: ListarPlanosUseCase,
    private readonly atualizarCustoMensalUseCase: AtualizarCustoMensalUseCase,
    private readonly criarAssinaturaUseCase: CriarAssinaturaUseCase,
    private readonly listarAssinaturasPorTipoUseCase: ListarAssinaturasPorTipoUseCase,
    private readonly listarAssinaturasPorClienteUseCase: ListarAssinaturasPorClienteUseCase,
    private readonly listarAssinaturasPorPlanoUseCase: ListarAssinaturasPorPlanoUseCase,
  ) { }

  // GET /gerenciaplanos/clientes
  @Get('clientes')
  async listarClientes() {
    return this.listarClientesUseCase.execute();
  }

  // GET /gerenciaplanos/planos
  @Get('planos')
  async listarPlanos() {
    return this.listarPlanosUseCase.execute();
  }

  // POST /gerenciaplanos/assinaturas — recebe codCli, codPlano, custoFinal, descricao
  @Post('assinaturas')
  async criarAssinatura(@Body() body: { codCli: number; codPlano: number; custoFinal: number; descricao: string }) {
    return this.criarAssinaturaUseCase.execute(body);
  }

  // PATCH /gerenciaplanos/planos/:idPlano — atualiza o custo mensal de um plano
  @Patch('planos/:idPlano')
  async atualizarCustoMensal(
    @Param('idPlano') idPlano: string,
    @Body() body: { custoMensal: number },
  ) {
    return this.atualizarCustoMensalUseCase.execute({
      idPlano: Number(idPlano),
      custoMensal: body.custoMensal,
    });
  }

  // GET /gerenciaplanos/assinaturas/:tipo — tipo: TODOS | ATIVOS | CANCELADOS
  // O status é calculado dinamicamente com base em dataUltimoPagamento (regra dos 30 dias)
  @Get('assinaturas/:tipo')
  async listarAssinaturas(@Param('tipo') tipo: TipoFiltroAssinatura) {
    return this.listarAssinaturasPorTipoUseCase.execute(tipo);
  }

  // GET /gerenciaplanos/asscli/:codcli — assinaturas de um cliente específico
  @Get('asscli/:codcli')
  async listarAssinaturasPorCliente(@Param('codcli') codcli: string) {
    return this.listarAssinaturasPorClienteUseCase.execute(Number(codcli));
  }

  // GET /gerenciaplanos/assinaturaplano/:codplano — assinantes de um plano específico
  @Get('assinaturaplano/:codplano')
  async listarAssinaturasPorPlano(@Param('codplano') codplano: string) {
    return this.listarAssinaturasPorPlanoUseCase.execute(Number(codplano));
  }
}