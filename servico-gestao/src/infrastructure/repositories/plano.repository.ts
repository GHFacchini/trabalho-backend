import { Injectable, NotFoundException } from '@nestjs/common';
import { IPlanoRepository } from '../../application/ports/plano.repository.interface.js';
import { Plano } from '../../domain/entities/plano.entity.js';

@Injectable()
export class PlanoRepository implements IPlanoRepository {
  // arrayzinho simulando a tabela de planos
  private planos: Plano[] = [];

  async listarTodos(): Promise<Plano[]> {
    return this.planos;
  }

  async buscarPorCodigo(codigo: number): Promise<Plano | null> {
    const plano = this.planos.find(p => p.codigo === codigo);
    return plano || null;
  }

  async atualizarCustoMensal(codigo: number, custoMensal: number): Promise<Plano> {
    const plano = await this.buscarPorCodigo(codigo);
    if (!plano) {
      // deu ruim, não achou o plano
      throw new NotFoundException('Plano não encontrado');
    }
    plano.custoMensal = custoMensal;
    plano.data = new Date();
    return plano;
  }

  async salvar(plano: Plano): Promise<void> {
    this.planos.push(plano);
  }
}