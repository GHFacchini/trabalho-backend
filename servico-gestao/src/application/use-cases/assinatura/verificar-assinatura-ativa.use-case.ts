import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAssinaturaRepository } from '../../ports/assinatura.repository.interface.js';

// Caso de uso: verifica se uma assinatura específica está ativa
// Usado internamente pelo ServicoPlanosAtivos via chamada HTTP síncrona
@Injectable()
export class VerificarAssinaturaAtivaUseCase {
  constructor(
    @Inject(IAssinaturaRepository)
    private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async execute(codAss: number): Promise<boolean> {
    const assinatura = await this.assinaturaRepo.buscarPorCodigo(codAss);
    if (!assinatura) {
      throw new NotFoundException(`Assinatura ${codAss} não encontrada`);
    }
    // A regra de negócio (30 dias) fica na entidade de domínio
    return assinatura.estaAtivo();
  }
}
