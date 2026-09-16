import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAssinaturaRepository } from '../../ports/assinatura.repository.interface.js';
import { IClienteRepository } from '../../ports/cliente.repository.interface.js';
import { IPlanoRepository } from '../../ports/plano.repository.interface.js';
import { Assinatura } from '../../../domain/entities/assinatura.entity.js';

export interface CriarAssinaturaInput {
  codCli: number;
  codPlano: number;
  custoFinal: number;
  descricao: string;
}

@Injectable()
export class CriarAssinaturaUseCase {
  constructor(
    @Inject(IAssinaturaRepository) private readonly assinaturaRepo: IAssinaturaRepository,
    @Inject(IClienteRepository) private readonly clienteRepo: IClienteRepository,
    @Inject(IPlanoRepository) private readonly planoRepo: IPlanoRepository,
  ) {}

  async execute(input: CriarAssinaturaInput): Promise<Assinatura> {
    if (!input.custoFinal || input.custoFinal <= 0) {
      throw new BadRequestException('custoFinal deve ser um número positivo');
    }

    // verifica se o cliente existe
    const cliente = await this.clienteRepo.buscarPorCodigo(Number(input.codCli));
    if (!cliente) {
      throw new NotFoundException(`Cliente com código ${input.codCli} não encontrado`);
    }

    const plano = await this.planoRepo.buscarPorCodigo(Number(input.codPlano));
    if (!plano) {
      throw new NotFoundException(`Plano com código ${input.codPlano} não encontrado`);
    }

    return this.assinaturaRepo.criar(input);
  }
}
