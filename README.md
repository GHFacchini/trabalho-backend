# Trabalho de Backend — Fase 2

Este repositório contém a implementação completa da Fase 2 do Trabalho de Backend, com uma arquitetura baseada em microsserviços.

## Visão Geral do Sistema

O sistema é composto por 4 serviços interconectados usando chamadas síncronas (HTTP) e assíncronas (RabbitMQ).

1. **`api-gateway` (Porta 3000):** Proxy simples em Express que direciona as requisições para os serviços internos, atuando como ponto único de entrada da API.
2. **`servico-gestao` (Porta 3001):** Serviço principal responsável por gerenciar Clientes, Planos e Assinaturas. Utiliza um banco de dados SQLite próprio.
3. **`servico-faturamento` (Porta 3002):** Serviço que recebe registros de pagamento, salva em seu próprio banco SQLite e publica eventos (`pagamento.gestao` e `pagamento.planosativos`) no RabbitMQ.
4. **`servico-planos-ativos` (Porta 3003):** Serviço responsável por responder se um plano está ativo. Mantém um cache em memória. Caso ocorra um *cache miss*, ele consulta o `servico-gestao` via HTTP. Ao receber um evento de pagamento do RabbitMQ, invalida a entrada correspondente no cache.

---

## Pré-requisitos

Para executar este projeto localmente, você precisa ter instalados:
- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js](https://nodejs.org/) (opcional, apenas para desenvolvimento/testes locais, v20+)

---

## Como Executar (Passo a Passo)

A infraestrutura completa foi configurada no arquivo `docker-compose.yml`.

1. Clone o repositório e navegue até a raiz:
   ```bash
   git clone https://github.com/GHFacchini/trabalho-backend.git
   cd trabalho-backend
   ```

2. Suba a infraestrutura usando o Docker Compose:
   ```bash
   docker-compose up --build
   ```

   *Esse comando fará o build das imagens dos 4 serviços e subirá o RabbitMQ. Os serviços aguardarão automaticamente até que o RabbitMQ esteja pronto para se conectar.*

3. O sistema estará disponível na porta `3000` (API Gateway). O painel de administração do RabbitMQ estará disponível em `http://localhost:15672` (usuário: `guest`, senha: `guest`).

---

## Testando com o Postman

1. Abra o Postman.
2. Importe o arquivo `template.postman_collection.json` localizado na raiz do projeto.
3. Certifique-se de configurar a variável `{{BASE_URL}}` da collection para `http://localhost:3000` (porta do API Gateway).

### Sequência de Teste Manual Sugerida

Para comprovar que a comunicação síncrona e assíncrona estão funcionando, faça o seguinte:

1. **(Cache Miss):** Envie um GET para `/planosativos/1`. 
   *Como o cache está vazio, o serviço fará uma requisição HTTP interna para o `servico-gestao`, retornará `true` ou `false` e salvará no cache.*
2. **(Cache Hit):** Envie novamente um GET para `/planosativos/1`.
   *Desta vez a resposta será instantânea a partir da memória, sem chamar o `servico-gestao`.*
3. **(Evento Assíncrono):** Envie um POST para `/registrarpagamento` com o seguinte body JSON:
   ```json
   { "dia": 15, "mes": 9, "ano": 2026, "codAss": 1, "valorPago": 99.9 }
   ```
4. **(Invalidação e Atualização):** Envie mais um GET para `/planosativos/1`.
   *Como o pagamento enviou um evento ao RabbitMQ, o `servico-planos-ativos` consumiu o evento e limpou o cache. Ocorrerá um novo cache miss, forçando uma consulta atualizada ao `servico-gestao`, que já terá a data de pagamento atualizada em seu próprio banco.*

---

## Conclusão e Decisões de Negócio

Durante o desenvolvimento da Fase 2, enfrentei alguns desafios técnicos interessantes relacionados à comunicação distribuída que me fizeram aplicar os conceitos vistos em aula. 

Primeiramente, para manter o ambiente mais simples e de fácil execução, optei por usar SQLite em ambos os serviços que requerem persistência (`servico-gestao` e `servico-faturamento`), isolando os bancos de dados conforme manda a cartilha de microsserviços. 

Outro desafio foi a lógica de "assinatura ativa". Na especificação não estava totalmente claro se uma assinatura já nasce paga, então decidi por implementação de negócio que, ao criar a assinatura, a `dataUltimoPagamento` é setada para o momento atual. Dessa forma, ela não nasce com status cancelado logo de cara.

A configuração do RabbitMQ foi a parte que exigiu mais atenção. Optei por usar a biblioteca `amqplib` pura, que é o padrão ensinado nas disciplinas, criando um `RabbitMqPublisher` genérico no faturamento e consumers em cada serviço. Para evitar que os serviços do Nest dessem crash caso o RabbitMQ demorasse a subir no Docker, implementei uma lógica simples de *retry* na inicialização (`OnModuleInit`).

Por fim, mantive o `servico-planos-ativos` propositalmente simples, sem Redis, utilizando um `Map` nativo do JavaScript para o cache, provando que é possível seguir a arquitetura solicitada sem sobrecarregar a infraestrutura da máquina do professor no momento da avaliação.
