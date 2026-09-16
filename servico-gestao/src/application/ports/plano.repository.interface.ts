import { Plano } from '../../domain/entities/plano.entity.js';

// Porta de saída para o repositório de planos
export const IPlanoRepository = Symbol('IPlanoRepository');

export interface IPlanoRepository {
  listarTodos(): Promise<Plano[]>;
  buscarPorCodigo(codigo: number): Promise<Plano | null>;
  atualizarCustoMensal(codigo: number, custoMensal: number): Promise<Plano>;
  salvar(plano: Plano): Promise<Plano>;
}