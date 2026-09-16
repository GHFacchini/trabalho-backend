import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAssinaturaRepository } from '../../application/ports/assinatura.repository.interface.js';
import { Assinatura } from '../../domain/entities/assinatura.entity.js';
import { AssinaturaSchema } from '../database/schemas/assinatura.schema.js';

@Injectable()
export class AssinaturaRepository implements IAssinaturaRepository {
  constructor(
    @InjectRepository(AssinaturaSchema)
    private readonly repo: Repository<AssinaturaSchema>,
  ) {}

  // Converte schema ORM → entidade de domínio (com regra de negócio disponível)
  private toDomain(schema: AssinaturaSchema): Assinatura {
    return new Assinatura(
      schema.codigo,
      schema.codPlano,
      schema.codCli,
      schema.inicioFidelidade,
      schema.fimFidelidade,
      schema.dataUltimoPagamento,
      schema.custoFinal,
      schema.descricao,
    );
  }

  async criar(dados: Partial<Assinatura>): Promise<Assinatura> {
    const agora = new Date();
    const fimFidelidade = new Date(agora.getTime());
    // Período de fidelidade de 1 ano (365 dias) a partir da contratação
    fimFidelidade.setFullYear(fimFidelidade.getFullYear() + 1);

    const salvo = await this.repo.save({
      codPlano: dados.codPlano!,
      codCli: dados.codCli!,
      inicioFidelidade: agora,
      fimFidelidade,
      // Registra como pago agora para garantir status ATIVO ao criar
      dataUltimoPagamento: agora,
      custoFinal: dados.custoFinal!,
      descricao: dados.descricao!,
    });
    return this.toDomain(salvo);
  }

  async listarTodas(): Promise<Assinatura[]> {
    const schemas = await this.repo.find();
    return schemas.map((s) => this.toDomain(s));
  }

  async listarPorCliente(codCli: number): Promise<Assinatura[]> {
    const schemas = await this.repo.findBy({ codCli });
    return schemas.map((s) => this.toDomain(s));
  }

  async listarPorPlano(codPlano: number): Promise<Assinatura[]> {
    const schemas = await this.repo.findBy({ codPlano });
    return schemas.map((s) => this.toDomain(s));
  }

  async buscarPorCodigo(codigo: number): Promise<Assinatura | null> {
    const schema = await this.repo.findOneBy({ codigo });
    return schema ? this.toDomain(schema) : null;
  }

  async atualizarUltimoPagamento(codigo: number, data: Date): Promise<void> {
    const schema = await this.repo.findOneBy({ codigo });
    if (!schema) {
      throw new NotFoundException(`Assinatura ${codigo} não encontrada`);
    }
    schema.dataUltimoPagamento = data;
    await this.repo.save(schema);
  }

  async salvar(assinatura: Assinatura): Promise<Assinatura> {
    const salvo = await this.repo.save({
      codigo: assinatura.codigo || undefined,
      codPlano: assinatura.codPlano,
      codCli: assinatura.codCli,
      inicioFidelidade: assinatura.inicioFidelidade,
      fimFidelidade: assinatura.fimFidelidade,
      dataUltimoPagamento: assinatura.dataUltimoPagamento,
      custoFinal: assinatura.custoFinal,
      descricao: assinatura.descricao,
    });
    return this.toDomain(salvo);
  }
}