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
    // tenta pegar do cache primeiro pra evitar chamada http desnecessaria
    const valorCache = this.cache.get(codAss);
    if (valorCache !== undefined) {
      return valorCache;
    }

    const ativo = await this.gestaoHttpClient.verificarAssinaturaAtiva(codAss);

    this.cache.set(codAss, ativo);

    return ativo;
  }
}
