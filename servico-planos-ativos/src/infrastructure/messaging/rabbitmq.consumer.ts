import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqp from 'amqplib';
import { CacheAssinaturas } from '../../domain/cache/cache-assinaturas.js';

@Injectable()
export class RabbitMqConsumer implements OnModuleInit {
  private readonly logger = new Logger(RabbitMqConsumer.name);

  constructor(private readonly cache: CacheAssinaturas) {}

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL;
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

        await channel.assertExchange('pagamentos', 'direct', { durable: true });
        await channel.assertQueue('pagamento.planosativos', { durable: true });
        await channel.bindQueue('pagamento.planosativos', 'pagamentos', 'pagamento.planosativos');

        channel.consume('pagamento.planosativos', (msg) => {
          if (!msg) return;
          try {
            const dados = JSON.parse(msg.content.toString()) as { codAss: number };
            // Invalida o cache ao receber o evento de pagamento
            this.cache.invalidate(dados.codAss);
            channel.ack(msg);
          } catch (err) {
            this.logger.error('Erro ao processar evento de pagamento:', err);
            channel.nack(msg, false, false);
          }
        });

        this.logger.log('Consumer RabbitMQ conectado — escutando pagamento.planosativos');
        return;
      } catch (err) {
        this.logger.warn(
          `Tentativa ${tentativa}/${maxTentativas} de conexão ao RabbitMQ falhou: ${(err as Error).message}`,
        );
        if (tentativa === maxTentativas) {
          this.logger.error('Consumer RabbitMQ não pôde conectar após todas as tentativas');
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}
