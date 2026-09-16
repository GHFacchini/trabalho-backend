import { Injectable, Inject } from '@nestjs/common';
import { IAssinaturaRepository, AssinaturaComStatus } from '../../ports/assinatura.repository.interface.js';

// Caso de uso: retorna todas as assinaturas de um cliente específico
@Injectable()
export class ListarAssinaturasPorClienteUseCase {
  constructor(
    @Inject(IAssinaturaRepository)
    private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async execute(codCli: number): Promise<AssinaturaComStatus[]> {
    const assinaturas = await this.assinaturaRepo.listarPorCliente(codCli);

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
