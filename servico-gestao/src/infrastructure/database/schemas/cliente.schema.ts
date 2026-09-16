import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Schema ORM — fica na infraestrutura, isolando o domínio do TypeORM
@Entity('clientes')
export class ClienteSchema {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column()
  nome: string;

  @Column()
  email: string;
}
