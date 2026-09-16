import { Cliente } from '../../domain/entities/cliente.entity.js';

// Porta de saída para o repositório de clientes
export const IClienteRepository = Symbol('IClienteRepository');

export interface IClienteRepository {
  listarTodos(): Promise<Cliente[]>;
  buscarPorCodigo(codigo: number): Promise<Cliente | null>;
  salvar(cliente: Cliente): Promise<Cliente>;
}