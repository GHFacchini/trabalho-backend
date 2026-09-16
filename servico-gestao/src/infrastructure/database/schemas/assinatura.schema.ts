import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Schema ORM da Assinatura — o campo status NÃO existe aqui
// O status é calculado pela regra de negócio (estaAtivo()) na entidade de domínio
@Entity('assinaturas')
export class AssinaturaSchema {
  @PrimaryGeneratedColumn()
  codigo: number;

  @Column()
  codPlano: number;

  @Column()
  codCli: number;

  @Column()
  inicioFidelidade: Date;

  @Column()
  fimFidelidade: Date;

  // Este campo é o coração da regra de negócio de status
  @Column()
  dataUltimoPagamento: Date;

  @Column('float')
  custoFinal: number;

  @Column()
  descricao: string;
}
