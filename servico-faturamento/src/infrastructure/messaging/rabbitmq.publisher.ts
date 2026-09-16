import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import amqp from 'amqplib';

@Injectable()
export class RabbitMqPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMqPublisher.name);
  private connection: any = null;
  private channel: any = null;

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL;
    if (!url) {
      this.logger.warn('RABBITMQ_URL não definido — publisher RabbitMQ não iniciado');
      return;
    }
    await this.conectarComRetry(url);
  }

  private async conectarComRetry(url: string, maxTentativas = 5) {
    for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
      try {
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertExchange('pagamentos', 'direct', { durable: true });
        this.logger.log('Publisher RabbitMQ conectado com sucesso');
        return;
      } catch (err) {
        this.logger.warn(
          `Tentativa ${tentativa}/${maxTentativas} de conexão ao RabbitMQ falhou: ${(err as Error).message}`,
        );
        if (tentativa === maxTentativas) {
          this.logger.error('Publisher RabbitMQ não pôde conectar após todas as tentativas');
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  async publish(routingKey: string, payload: any) {
    if (!this.channel) {
      this.logger.warn(`Canal RabbitMQ indisponível. Mensagem para ${routingKey} descartada.`);
      return;
    }
    const buf = Buffer.from(JSON.stringify(payload));
    this.channel.publish('pagamentos', routingKey, buf, { persistent: true });
    this.logger.log(`Evento publicado: ${routingKey}`);
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
