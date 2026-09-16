import { Cliente } from '../../domain/entities/cliente.entity.js';

// Interface (porta de saída) que a camada de aplicação conhece
// A infraestrutura implementa — a aplicação nunca depende diretamente do TypeORM
export const IClienteRepository = Symbol('IClienteRepository');

export interface IClienteRepository {
  listarTodos(): Promise<Cliente[]>;
  salvar(cliente: Cliente): Promise<Cliente>;
}