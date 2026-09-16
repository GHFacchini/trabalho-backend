import { Injectable, Inject } from '@nestjs/common';
import { IAssinaturaRepository } from '../../ports/assinatura.repository.interface.js';
import { Assinatura } from '../../../domain/entities/assinatura.entity.js';

export interface CriarAssinaturaInput {
  codCli: number;
  codPlano: number;
  custoFinal: number;
  descricao: string;
}

// Caso de uso: registra uma nova assinatura de plano para um cliente
@Injectable()
export class CriarAssinaturaUseCase {
  constructor(
    @Inject(IAssinaturaRepository)
    private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async execute(input: CriarAssinaturaInput): Promise<Assinatura> {
    return this.assinaturaRepo.criar(input);
  }
}
