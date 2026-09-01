export class Cliente {
  codigo: number;
  nome: string;
  email: string;

  constructor(codigo: number, nome: string, email: string) {
    this.codigo = codigo;
    this.nome = nome;
    this.email = email;
  }
}