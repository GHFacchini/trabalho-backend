import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Schema ORM do Plano — mantém decoradores TypeORM longe da camada de domínio
@Entity('planos')
export class PlanoSchema {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column()
  nome: string;

  @Column('float')
  custoMensal: number;

  @Column()
  data: Date;

  @Column()
  descricao: string;
}
