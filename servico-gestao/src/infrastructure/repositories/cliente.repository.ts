import { Injectable } from '@nestjs/common';
import { IClienteRepository } from '../../application/ports/cliente.repository.interface.js';
import { Cliente } from '../../domain/entities/cliente.entity.js';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  // banco de dados em memória
  private clientes: Cliente[] = [];

  async listarTodos(): Promise<Cliente[]> {
    // Retorna todos os clientes cadastrados
    return this.clientes;
  }

  async salvar(cliente: Cliente): Promise<void> {
    this.clientes.push(cliente);
  }
}