import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IClienteRepository } from '../../application/ports/cliente.repository.interface.js';
import { Cliente } from '../../domain/entities/cliente.entity.js';
import { ClienteSchema } from '../database/schemas/cliente.schema.js';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor(
    // Injetando o repositório TypeORM — aqui a infra depende do ORM, não o domínio
    @InjectRepository(ClienteSchema)
    private readonly repo: Repository<ClienteSchema>,
  ) {}

  // Mapeia o schema ORM de volta para a entidade de domínio pura
  private toDomain(schema: ClienteSchema): Cliente {
    return new Cliente(schema.codigo, schema.nome, schema.email);
  }

  async listarTodos(): Promise<Cliente[]> {
    const schemas = await this.repo.find();
    return schemas.map((s) => this.toDomain(s));
  }

  async salvar(cliente: Cliente): Promise<Cliente> {
    const salvo = await this.repo.save({
      codigo: cliente.codigo,
      nome: cliente.nome,
      email: cliente.email,
    });
    return this.toDomain(salvo);
  }
}