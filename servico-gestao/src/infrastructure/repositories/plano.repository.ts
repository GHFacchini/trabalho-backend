import { Injectable, NotFoundException } from '@nestjs/common';
import { IPlanoRepository } from '../../application/ports/plano.repository.interface.js';
import { Plano } from '../../domain/entities/plano.entity.js';

@Injectable()
export class PlanoRepository implements IPlanoRepository {
  // Array simulando a persistência de planos
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
      // Lança exceção se o plano não for encontrado
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