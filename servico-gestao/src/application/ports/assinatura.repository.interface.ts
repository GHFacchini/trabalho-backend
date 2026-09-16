import { Assinatura } from '../../domain/entities/assinatura.entity.js';

// Porta de saída para o repositório de assinaturas
export const IAssinaturaRepository = Symbol('IAssinaturaRepository');

// DTO de retorno que inclui o status calculado dinamicamente
export interface AssinaturaComStatus {
  codigo: number;
  codPlano: number;
  codCli: number;
  inicioFidelidade: Date;
  fimFidelidade: Date;
  dataUltimoPagamento: Date;
  custoFinal: number;
  descricao: string;
  status: 'ATIVO' | 'CANCELADO';
}

export interface IAssinaturaRepository {
  criar(dados: Partial<Assinatura>): Promise<Assinatura>;
  listarTodas(): Promise<Assinatura[]>;
  listarPorCliente(codCli: number): Promise<Assinatura[]>;
  listarPorPlano(codPlano: number): Promise<Assinatura[]>;
  buscarPorCodigo(codigo: number): Promise<Assinatura | null>;
  atualizarUltimoPagamento(codigo: number, data: Date): Promise<void>;
  salvar(assinatura: Assinatura): Promise<Assinatura>;
}