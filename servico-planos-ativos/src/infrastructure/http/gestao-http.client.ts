import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GestaoHttpClient {
  private readonly logger = new Logger(GestaoHttpClient.name);

  async verificarAssinaturaAtiva(codAss: number): Promise<boolean> {
    const url = process.env.SERVICO_GESTAO_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${url}/gerenciaplanos/assinaturas/${codAss}/ativa`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Se a assinatura não existe no servico-gestao, assumimos que não é ativa
          return false;
        }
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json() as { ativa: boolean };
      return data.ativa;
    } catch (error) {
      this.logger.error(`Erro ao consultar servico-gestao para assinatura ${codAss}`, error);
      // Em caso de falha de comunicação, fallback para inativo por segurança
      return false;
    }
  }
}
