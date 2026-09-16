import { Injectable, Inject } from '@nestjs/common';
import { IAssinaturaRepository, AssinaturaComStatus } from '../../ports/assinatura.repository.interface.js';

// Tipo de filtro aceito pela rota /assinaturas/:tipo
export type TipoFiltroAssinatura = 'TODOS' | 'ATIVOS' | 'CANCELADOS';

// Caso de uso: lista assinaturas filtradas por status (calculado via regra de negócio)
@Injectable()
export class ListarAssinaturasPorTipoUseCase {
  constructor(
    @Inject(IAssinaturaRepository)
    private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async execute(tipo: TipoFiltroAssinatura): Promise<AssinaturaComStatus[]> {
    const todas = await this.assinaturaRepo.listarTodas();

    // O status é calculado aqui, na camada de aplicação, usando a regra de negócio da entidade
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
