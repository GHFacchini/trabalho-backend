import { Injectable } from '@nestjs/common';
import { IAssinaturaRepository } from '../../application/ports/assinatura.repository.interface.js';
import { Assinatura } from '../../domain/entities/assinatura.entity.js';

@Injectable()
export class AssinaturaRepository implements IAssinaturaRepository {
  // nossa "tabela" de assinaturas
  private assinaturas: Assinatura[] = [];
  private nextId = 1;

  async criar(assinatura: Partial<Assinatura>): Promise<Assinatura> {
    // criando um mock bem maroto da assinatura nova
    const nova = new Assinatura(
      this.nextId++,
      assinatura.codPlano!,
      assinatura.codCli!,
      new Date(),
      new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 ano de fidelidade
      new Date(),
      assinatura.custoFinal!,
      assinatura.descricao!,
      'ATIVOS'
    );
    this.assinaturas.push(nova);
    return nova;
  }

  private mapearAssinatura(ass: Assinatura) {
    // formatando os dados igual o prof pediu no postman
    return {
      codigo_assinatura: ass.codigo,
      codigo_cliente: ass.codCli,
      codigo_plano: ass.codPlano,
      data_inicio: ass.inicioFidelidade,
      data_fim: ass.fimFidelidade,
      status: ass.status
    };
  }

  async listarPorTipo(tipo: 'TODOS' | 'ATIVOS' | 'CANCELADOS'): Promise<any[]> {
    if (tipo === 'TODOS') {
      return this.assinaturas.map(this.mapearAssinatura);
    }
    // filtrando os ativos/cancelados conforme o postman
    return this.assinaturas
      .filter(a => a.status === tipo)
      .map(this.mapearAssinatura);
  }

  async listarPorCliente(codcli: number): Promise<any[]> {
    return this.assinaturas
      .filter(a => a.codCli === Number(codcli))
      .map(this.mapearAssinatura);
  }

  async listarPorPlano(codplano: number): Promise<any[]> {
    return this.assinaturas
      .filter(a => a.codPlano === Number(codplano))
      .map(this.mapearAssinatura);
  }

  async salvar(assinatura: Assinatura): Promise<void> {
    if(!assinatura.codigo) assinatura.codigo = this.nextId++;
    this.assinaturas.push(assinatura);
  }
}