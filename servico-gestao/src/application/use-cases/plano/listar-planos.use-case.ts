import { Injectable, Inject } from '@nestjs/common';
import { IPlanoRepository } from '../../ports/plano.repository.interface.js';
import { Plano } from '../../../domain/entities/plano.entity.js';

// Caso de uso: lista todos os planos disponíveis
@Injectable()
export class ListarPlanosUseCase {
  constructor(
    @Inject(IPlanoRepository)
    private readonly planoRepo: IPlanoRepository,
  ) {}

  async execute(): Promise<Plano[]> {
    return this.planoRepo.listarTodos();
  }
}
