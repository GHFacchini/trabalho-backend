// Entidade de domínio do Pagamento — pura, sem dependências de framework
export class Pagamento {
  codigo: number;
  codAss: number;
  dia: number;
  mes: number;
  ano: number;
  valorPago: number;
  dataRegistro: Date; // quando o pagamento foi registrado no sistema

  constructor(
    codigo: number,
    codAss: number,
    dia: number,
    mes: number,
    ano: number,
    valorPago: number,
    dataRegistro: Date,
  ) {
    this.codigo = codigo;
    this.codAss = codAss;
    this.dia = dia;
    this.mes = mes;
    this.ano = ano;
    this.valorPago = valorPago;
    this.dataRegistro = dataRegistro;
  }
}
