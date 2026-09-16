import { Injectable, Inject } from '@nestjs/common';
import { IClienteRepository } from '../../ports/cliente.repository.interface.js';
import { Cliente } from '../../../domain/entities/cliente.entity.js';

// Caso de uso: lista todos os clientes cadastrados
@Injectable()
export class ListarClientesUseCase {
  constructor(
    // Depende da abstração (interface), nunca da implementação concreta
    @Inject(IClienteRepository)
    private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(): Promise<Cliente[]> {
    return this.clienteRepo.listarTodos();
  }
}
