import { Assinatura } from '../../domain/entities/assinatura.entity.js';

export const IAssinaturaRepository = Symbol('IAssinaturaRepository');

export interface IAssinaturaRepository {
  criar(assinatura: Partial<Assinatura>): Promise<Assinatura>;
  listarPorTipo(tipo: 'TODOS' | 'ATIVOS' | 'CANCELADOS'): Promise<any[]>;
  listarPorCliente(codcli: number): Promise<any[]>;
  listarPorPlano(codplano: number): Promise<any[]>;
  salvar(assinatura: Assinatura): Promise<void>;
}