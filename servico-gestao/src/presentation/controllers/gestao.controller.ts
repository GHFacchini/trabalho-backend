import { Controller, Get, Post, Patch, Body, Param, HttpCode } from '@nestjs/common';
import { ListarClientesUseCase } from '../../application/use-cases/cliente/listar-clientes.use-case.js';
import { ListarPlanosUseCase } from '../../application/use-cases/plano/listar-planos.use-case.js';
import { AtualizarCustoMensalUseCase } from '../../application/use-cases/plano/atualizar-custo-mensal.use-case.js';
import { CriarAssinaturaUseCase } from '../../application/use-cases/assinatura/criar-assinatura.use-case.js';
import { ListarAssinaturasPorTipoUseCase } from '../../application/use-cases/assinatura/listar-assinaturas-por-tipo.use-case.js';
import { ListarAssinaturasPorClienteUseCase } from '../../application/use-cases/assinatura/listar-assinaturas-por-cliente.use-case.js';
import { ListarAssinaturasPorPlanoUseCase } from '../../application/use-cases/assinatura/listar-assinaturas-por-plano.use-case.js';
import { VerificarAssinaturaAtivaUseCase } from '../../application/use-cases/assinatura/verificar-assinatura-ativa.use-case.js';

// Controller limpo: só recebe HTTP e delega para os casos de uso
@Controller('gerenciaplanos')
export class GestaoController {
  constructor(
    private readonly listarClientesUseCase: ListarClientesUseCase,
    private readonly listarPlanosUseCase: ListarPlanosUseCase,
    private readonly atualizarCustoMensalUseCase: AtualizarCustoMensalUseCase,
    private readonly criarAssinaturaUseCase: CriarAssinaturaUseCase,
    private readonly listarAssinaturasPorTipoUseCase: ListarAssinaturasPorTipoUseCase,
    private readonly listarAssinaturasPorClienteUseCase: ListarAssinaturasPorClienteUseCase,
    private readonly listarAssinaturasPorPlanoUseCase: ListarAssinaturasPorPlanoUseCase,
    private readonly verificarAssinaturaAtivaUseCase: VerificarAssinaturaAtivaUseCase,
  ) { }


  @Get('clientes')
  async listarClientes() {
    return this.listarClientesUseCase.execute();
  }


  @Get('planos')
  async listarPlanos() {
    return this.listarPlanosUseCase.execute();
  }


  @Post('assinaturas')
  @HttpCode(201)
  async criarAssinatura(
    @Body() body: { codCli: number; codPlano: number; custoFinal: number; descricao: string },
  ) {
    return this.criarAssinaturaUseCase.execute(body);
  }


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

  // rota interna pro planos ativos q tem que ficar antes do :tipo senao da conflito de rota
  @Get('assinaturas/:codass/ativa')
  async verificarAtiva(@Param('codass') codass: string) {
    const ativa = await this.verificarAssinaturaAtivaUseCase.execute(Number(codass));
    return { ativa };
  }


  @Get('assinaturas/:tipo')
  async listarAssinaturas(@Param('tipo') tipo: string) {
    return this.listarAssinaturasPorTipoUseCase.execute(tipo);
  }


  @Get('asscli/:codcli')
  async listarAssinaturasPorCliente(@Param('codcli') codcli: string) {
    return this.listarAssinaturasPorClienteUseCase.execute(Number(codcli));
  }


  @Get('assinaturaplano/:codplano')
  async listarAssinaturasPorPlano(@Param('codplano') codplano: string) {
    return this.listarAssinaturasPorPlanoUseCase.execute(Number(codplano));
  }
}