import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClienteRepository } from '../../application/ports/cliente.repository.interface.js';
import { Cliente } from '../../domain/entities/cliente.entity.js';
import { ClienteSchema } from '../database/schemas/cliente.schema.js';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(
    @InjectRepository(ClienteSchema)
    private readonly repo: Repository<ClienteSchema>,
  ) {}

  private toDomain(schema: ClienteSchema): Cliente {
    return new Cliente(schema.codigo, schema.nome, schema.email);
  }

  async listarTodos(): Promise<Cliente[]> {
    const schemas = await this.repo.find();
    return schemas.map((s) => this.toDomain(s));
  }

  async buscarPorCodigo(codigo: number): Promise<Cliente | null> {
    const schema = await this.repo.findOneBy({ codigo });
    return schema ? this.toDomain(schema) : null;
  }

  async salvar(cliente: Cliente): Promise<Cliente> {
    const salvo = await this.repo.save({
      codigo: cliente.codigo || undefined,
      nome: cliente.nome,
      email: cliente.email,
    });
    return this.toDomain(salvo);
  }
}