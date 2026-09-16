import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPlanoRepository } from '../../application/ports/plano.repository.interface.js';
import { Plano } from '../../domain/entities/plano.entity.js';
import { PlanoSchema } from '../database/schemas/plano.schema.js';

@Injectable()
export class PlanoRepository implements IPlanoRepository {
  constructor(
    @InjectRepository(PlanoSchema)
    private readonly repo: Repository<PlanoSchema>,
  ) {}

  // Converte schema ORM → entidade de domínio
  private toDomain(schema: PlanoSchema): Plano {
    return new Plano(schema.codigo, schema.nome, schema.custoMensal, schema.data, schema.descricao);
  }

  async listarTodos(): Promise<Plano[]> {
    const schemas = await this.repo.find();
    return schemas.map((s) => this.toDomain(s));
  }

  async buscarPorCodigo(codigo: number): Promise<Plano | null> {
    const schema = await this.repo.findOneBy({ codigo });
    return schema ? this.toDomain(schema) : null;
  }

  async atualizarCustoMensal(codigo: number, custoMensal: number): Promise<Plano> {
    const schema = await this.repo.findOneBy({ codigo });
    if (!schema) {
      // Lança exceção se o plano não for encontrado
      throw new NotFoundException(`Plano ${codigo} não encontrado`);
    }
    schema.custoMensal = custoMensal;
    schema.data = new Date();
    const atualizado = await this.repo.save(schema);
    return this.toDomain(atualizado);
  }

  async salvar(plano: Plano): Promise<Plano> {
    const salvo = await this.repo.save({
      codigo: plano.codigo || undefined,
      nome: plano.nome,
      custoMensal: plano.custoMensal,
      data: plano.data,
      descricao: plano.descricao,
    });
    return this.toDomain(salvo);
  }
}