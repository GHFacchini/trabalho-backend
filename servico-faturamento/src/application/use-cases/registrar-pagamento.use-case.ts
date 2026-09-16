import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IPagamentoRepository } from '../ports/pagamento.repository.interface.js';
import { RabbitMqPublisher } from '../../infrastructure/messaging/rabbitmq.publisher.js';
import { Pagamento } from '../../domain/entities/pagamento.entity.js';

export interface RegistrarPagamentoInput {
  dia: number;
  mes: number;
  ano: number;
  codAss: number;
  valorPago: number;
}

@Injectable()
export class RegistrarPagamentoUseCase {
  constructor(
    @Inject(IPagamentoRepository)
    private readonly pagamentoRepo: IPagamentoRepository,
    private readonly rabbitMqPublisher: RabbitMqPublisher,
  ) {}

  async execute(input: RegistrarPagamentoInput): Promise<Pagamento> {
    // 1. Validação básica
    if (input.dia < 1 || input.dia > 31) throw new BadRequestException('Dia inválido');
    if (input.mes < 1 || input.mes > 12) throw new BadRequestException('Mês inválido');
    if (input.ano < 2000) throw new BadRequestException('Ano inválido');
    if (!input.codAss || input.codAss <= 0) throw new BadRequestException('Código de assinatura inválido');
    if (!input.valorPago || input.valorPago <= 0) throw new BadRequestException('Valor pago deve ser positivo');

    // 2. Persiste o pagamento no banco próprio do faturamento
    const pagamento = await this.pagamentoRepo.salvar(input);

    const evento = {
      codAss: input.codAss,
      dia: input.dia,
      mes: input.mes,
      ano: input.ano,
      valorPago: input.valorPago,
    };

    // 3. Publica os eventos no RabbitMQ
    await this.rabbitMqPublisher.publish('pagamento.gestao', evento);
    await this.rabbitMqPublisher.publish('pagamento.planosativos', evento);

    return pagamento;
  }
}
