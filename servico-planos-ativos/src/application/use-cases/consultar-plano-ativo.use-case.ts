import { Injectable } from '@nestjs/common';
import { CacheAssinaturas } from '../../domain/cache/cache-assinaturas.js';
import { GestaoHttpClient } from '../../infrastructure/http/gestao-http.client.js';

@Injectable()
export class ConsultarPlanoAtivoUseCase {
  constructor(
    private readonly cache: CacheAssinaturas,
    private readonly gestaoHttpClient: GestaoHttpClient,
  ) {}

  async execute(codAss: number): Promise<boolean> {
    // 1. Tenta recuperar do cache
    const valorCache = this.cache.get(codAss);
    if (valorCache !== undefined) {
      return valorCache;
    }

    // 2. Em caso de cache miss, consulta o servico-gestao via HTTP
    const ativo = await this.gestaoHttpClient.verificarAssinaturaAtiva(codAss);

    // 3. Salva no cache
    this.cache.set(codAss, ativo);

    return ativo;
  }
}
