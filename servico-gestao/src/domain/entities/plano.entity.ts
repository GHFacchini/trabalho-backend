export class Plano {
  codigo: number;
  nome: string;
  custoMensal: number;
  data: Date;
  descricao: string;

  constructor(codigo: number, nome: string, custoMensal: number, data: Date, descricao: string) {
    this.codigo = codigo;
    this.nome = nome;
    this.custoMensal = custoMensal;
    this.data = data;
    this.descricao = descricao;
  }
}