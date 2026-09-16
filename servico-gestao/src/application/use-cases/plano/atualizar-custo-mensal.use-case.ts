import { Injectable, Inject } from '@nestjs/common';
import { IPlanoRepository } from '../../ports/plano.repository.interface.js';
import { Plano } from '../../../domain/entities/plano.entity.js';

export interface AtualizarCustoMensalInput {
  idPlano: number;
  custoMensal: number;
}

// Caso de uso: atualiza o custo mensal de um plano específico
@Injectable()
export class AtualizarCustoMensalUseCase {
  constructor(
    @Inject(IPlanoRepository)
    private readonly planoRepo: IPlanoRepository,
  ) {}

  async execute(input: AtualizarCustoMensalInput): Promise<Plano> {
    return this.planoRepo.atualizarCustoMensal(input.idPlano, input.custoMensal);
  }
}
