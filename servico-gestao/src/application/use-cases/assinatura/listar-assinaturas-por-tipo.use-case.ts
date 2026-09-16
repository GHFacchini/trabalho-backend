import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IAssinaturaRepository } from '../../ports/assinatura.repository.interface.js';
import type { AssinaturaComStatus } from '../../ports/assinatura.repository.interface.js';

export type TipoFiltroAssinatura = 'TODOS' | 'ATIVOS' | 'CANCELADOS';

const TIPOS_VALIDOS: TipoFiltroAssinatura[] = ['TODOS', 'ATIVOS', 'CANCELADOS'];

@Injectable()
export class ListarAssinaturasPorTipoUseCase {
  constructor(
    @Inject(IAssinaturaRepository)
    private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async execute(tipo: string): Promise<AssinaturaComStatus[]> {
    // Valida antes de qualquer coisa — evita retornar CANCELADOS pra qualquer valor inválido
    if (!TIPOS_VALIDOS.includes(tipo as TipoFiltroAssinatura)) {
      throw new BadRequestException(
        `Tipo inválido: "${tipo}". Use TODOS, ATIVOS ou CANCELADOS.`,
      );
    }

    const todas = await this.assinaturaRepo.listarTodas();

    // Status calculado aqui na camada de aplicação via regra de negócio da entidade
    const comStatus: AssinaturaComStatus[] = todas.map((ass) => ({
      codigo: ass.codigo,
      codPlano: ass.codPlano,
      codCli: ass.codCli,
      inicioFidelidade: ass.inicioFidelidade,
      fimFidelidade: ass.fimFidelidade,
      dataUltimoPagamento: ass.dataUltimoPagamento,
      custoFinal: ass.custoFinal,
      descricao: ass.descricao,
      status: ass.estaAtivo() ? 'ATIVO' : 'CANCELADO',
    }));

    if (tipo === 'TODOS') return comStatus;
    if (tipo === 'ATIVOS') return comStatus.filter((a) => a.status === 'ATIVO');
    return comStatus.filter((a) => a.status === 'CANCELADO');
  }
}
