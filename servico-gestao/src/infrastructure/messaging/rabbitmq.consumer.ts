import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import amqp from 'amqplib';
import { IAssinaturaRepository } from '../../application/ports/assinatura.repository.interface.js';

// Consumidor RabbitMQ do ServicoGestao
// Escuta eventos de pagamento e atualiza a dataUltimoPagamento da assinatura
@Injectable()
export class RabbitMqConsumer implements OnModuleInit {
  private readonly logger = new Logger(RabbitMqConsumer.name);

  constructor(
    @Inject(IAssinaturaRepository)
    private readonly assinaturaRepo: IAssinaturaRepository,
  ) {}

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL;
    // Não tenta conectar se a URL não estiver configurada (ex: nos testes)
    if (!url) {
      this.logger.warn('RABBITMQ_URL não definido — consumer RabbitMQ não iniciado');
      return;
    }
    await this.conectarComRetry(url);
  }

  private async conectarComRetry(url: string, maxTentativas = 5) {
    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        // Garante que a exchange e fila existam
        await channel.assertExchange('pagamentos', 'direct', { durable: true });
        await channel.assertQueue('pagamento.gestao', { durable: true });
        await channel.bindQueue('pagamento.gestao', 'pagamentos', 'pagamento.gestao');

        channel.consume('pagamento.gestao', async (msg) => {
          if (!msg) return;
          try {
            const dados = JSON.parse(msg.content.toString()) as {
              codAss: number;
              dia: number;
              mes: number;
              ano: number;
              valorPago: number;
            };
            // Monta a data de pagamento com o dia/mês/ano recebidos no evento
            const dataPagamento = new Date(dados.ano, dados.mes - 1, dados.dia);
            await this.assinaturaRepo.atualizarUltimoPagamento(dados.codAss, dataPagamento);
            this.logger.log(`Pagamento processado — assinatura ${dados.codAss}`);
            channel.ack(msg);
          } catch (err) {
            this.logger.error('Erro ao processar evento de pagamento:', err);
            // Descarta a mensagem sem requeue para evitar loop de erros
            channel.nack(msg, false, false);
          }
        });

        this.logger.log('Consumer RabbitMQ pronto — escutando fila pagamento.gestao');
        return;
      } catch (err) {
        this.logger.warn(
          `Tentativa ${tentativa}/${maxTentativas} de conexão ao RabbitMQ falhou: ${(err as Error).message}`,
        );
        if (tentativa === maxTentativas) {
          this.logger.error('Consumer RabbitMQ não pôde ser iniciado após todas as tentativas');
          return;
        }
        // Aguarda 3 segundos antes de tentar novamente
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
}
