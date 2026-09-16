// Entidade de domínio pura — sem dependências de framework
// O status não é um campo persistido; é derivado de dataUltimoPagamento
export class Assinatura {
  codigo: number;
  codPlano: number;
  codCli: number;
  inicioFidelidade: Date;
  fimFidelidade: Date;
  dataUltimoPagamento: Date;
  custoFinal: number;
  descricao: string;

  constructor(
    codigo: number,
    codPlano: number,
    codCli: number,
    inicioFidelidade: Date,
    fimFidelidade: Date,
    dataUltimoPagamento: Date,
    custoFinal: number,
    descricao: string,
  ) {
    this.codigo = codigo;
    this.codPlano = codPlano;
    this.codCli = codCli;
    this.inicioFidelidade = inicioFidelidade;
    this.fimFidelidade = fimFidelidade;
    this.dataUltimoPagamento = dataUltimoPagamento;
    this.custoFinal = custoFinal;
    this.descricao = descricao;
  }

  /**
   * Regra de negócio central: uma assinatura é ATIVA se o último pagamento
   * foi realizado há menos de 30 dias. Sem tolerância de atraso.
   */
  estaAtivo(): boolean {
    const agora = new Date();
    const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    return this.dataUltimoPagamento >= trintaDiasAtras;
  }
}