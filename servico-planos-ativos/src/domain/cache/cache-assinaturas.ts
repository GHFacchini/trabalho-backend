import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheAssinaturas {
  private readonly cache = new Map<number, boolean>();
  private readonly logger = new Logger(CacheAssinaturas.name);

  get(codAss: number): boolean | undefined {
    const valor = this.cache.get(codAss);
    if (valor !== undefined) {
      this.logger.debug(`Cache hit para assinatura ${codAss}: ${valor}`);
    } else {
      this.logger.debug(`Cache miss para assinatura ${codAss}`);
    }
    return valor;
  }

  set(codAss: number, valor: boolean): void {
    this.cache.set(codAss, valor);
    this.logger.debug(`Assinatura ${codAss} cacheada como ${valor}`);
  }

  invalidate(codAss: number): void {
    if (this.cache.has(codAss)) {
      this.cache.delete(codAss);
      this.logger.log(`Cache invalidado para assinatura ${codAss}`);
    }
  }
}
