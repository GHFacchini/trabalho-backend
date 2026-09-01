export class Assinatura {
  codigo: number;
  codPlano: number;
  codCli: number;
  inicioFidelidade: Date;
  fimFidelidade: Date;
  dataUltimoPagamento: Date;
  custoFinal: number;
  descricao: string;
  status?: 'ATIVOS' | 'CANCELADOS';

  constructor(codigo: number, codPlano: number, codCli: number, inicioFidelidade: Date, fimFidelidade: Date, dataUltimoPagamento: Date, custoFinal: number, descricao: string, status?: 'ATIVOS' | 'CANCELADOS') {
    this.codigo = codigo;
    this.codPlano = codPlano;
    this.codCli = codCli;
    this.inicioFidelidade = inicioFidelidade;
    this.fimFidelidade = fimFidelidade;
    this.dataUltimoPagamento = dataUltimoPagamento;
    this.custoFinal = custoFinal;
    this.descricao = descricao;
    this.status = status || 'ATIVOS';
  }
}