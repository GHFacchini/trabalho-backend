import { Cliente } from '../../domain/entities/cliente.entity.js';

export const IClienteRepository = Symbol('IClienteRepository');

export interface IClienteRepository {
  listarTodos(): Promise<Cliente[]>;
  salvar(cliente: Cliente): Promise<void>;
}