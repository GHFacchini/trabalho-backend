import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPagamentoRepository } from '../../application/ports/pagamento.repository.interface.js';
import { Pagamento } from '../../domain/entities/pagamento.entity.js';
import { PagamentoSchema } from '../database/schemas/pagamento.schema.js';

@Injectable()
export class PagamentoRepository implements IPagamentoRepository {
  constructor(
    @InjectRepository(PagamentoSchema)
    private readonly repo: Repository<PagamentoSchema>,
  ) {}

  private toDomain(schema: PagamentoSchema): Pagamento {
    return new Pagamento(
      schema.codigo,
      schema.codAss,
      schema.dia,
      schema.mes,
      schema.ano,
      schema.valorPago,
      schema.dataRegistro,
    );
  }

  async salvar(pagamento: Partial<Pagamento>): Promise<Pagamento> {
    const salvo = await this.repo.save({
      codAss: pagamento.codAss,
      dia: pagamento.dia,
      mes: pagamento.mes,
      ano: pagamento.ano,
      valorPago: pagamento.valorPago,
    });
    return this.toDomain(salvo);
  }
}
