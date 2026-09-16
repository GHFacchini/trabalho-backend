import { Pagamento } from '../../domain/entities/pagamento.entity.js';

export const IPagamentoRepository = Symbol('IPagamentoRepository');

export interface IPagamentoRepository {
  salvar(pagamento: Partial<Pagamento>): Promise<Pagamento>;
}
