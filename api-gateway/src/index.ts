import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações das URLs de destino (variáveis de ambiente ou default para localhost)
const SERVICO_GESTAO_URL = process.env.SERVICO_GESTAO_URL || 'http://localhost:3001';
const SERVICO_FATURAMENTO_URL = process.env.SERVICO_FATURAMENTO_URL || 'http://localhost:3002';
const SERVICO_PLANOS_ATIVOS_URL = process.env.SERVICO_PLANOS_ATIVOS_URL || 'http://localhost:3003';

// Middleware de log básico
app.use((req, res, next) => {
  console.log(`[API Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy para o servico-gestao
app.use(
  '/gerenciaplanos',
  createProxyMiddleware({
    target: SERVICO_GESTAO_URL,
    changeOrigin: true,
  })
);

// Proxy para o servico-faturamento
app.use(
  '/registrarpagamento',
  createProxyMiddleware({
    target: SERVICO_FATURAMENTO_URL,
    changeOrigin: true,
  })
);

// Proxy para o servico-planos-ativos
app.use(
  '/planosativos',
  createProxyMiddleware({
    target: SERVICO_PLANOS_ATIVOS_URL,
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
  console.log(`- /gerenciaplanos -> ${SERVICO_GESTAO_URL}`);
  console.log(`- /registrarpagamento -> ${SERVICO_FATURAMENTO_URL}`);
  console.log(`- /planosativos -> ${SERVICO_PLANOS_ATIVOS_URL}`);
});
