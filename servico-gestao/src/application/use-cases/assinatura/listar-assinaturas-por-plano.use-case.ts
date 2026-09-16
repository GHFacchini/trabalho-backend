import { Injectable, Inject } from '@nestjs/common';
import { IAssinaturaRepository, AssinaturaComStatus } from '../../ports/assinatura.repository.interface.js';

// Caso de uso: retorna todos os assinantes de um plano específico
@Injectable()
export class ListarAssinaturasPorPlanoUseCase {
  constructor(
    @Inject(IAssinaturaRepository)
    private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async execute(codPlano: number): Promise<AssinaturaComStatus[]> {
    const assinaturas = await this.assinaturaRepo.listarPorPlano(codPlano);

    // Calcula o status de cada assinatura usando a regra de negócio da entidade de domínio
    return assinaturas.map((ass) => ({
      codigo: ass.codigo,
      codPlano: ass.codPlano,
      codCli: ass.codCli,
      inicioFidelidade: ass.inicioFidelidade,
      fimFidelidade: ass.fimFidelidade,
      dataUltimoPagamento: ass.dataUltimoPagamento,
      custoFinal: ass.custoFinal,
      descricao: ass.descricao,
      status: ass.estaAtivo() ? 'ATIVO' as const : 'CANCELADO' as const,
    }));
  }
}
