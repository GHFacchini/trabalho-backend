import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('pagamentos')
export class PagamentoSchema {
  @PrimaryGeneratedColumn('increment')
  codigo: number;

  @Column({ type: 'int' })
  codAss: number;

  @Column({ type: 'int' })
  dia: number;

  @Column({ type: 'int' })
  mes: number;

  @Column({ type: 'int' })
  ano: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorPago: number;

  @CreateDateColumn()
  dataRegistro: Date;
}
