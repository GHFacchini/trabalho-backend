Aqui está o texto exato dos documentos de orientação do trabalho de Desenvolvimento de Sistemas Backend, extraídos integralmente dos arquivos do projeto.

---

### ARQUIVO: `orientacoes gerais.pdf`

**Desenvolvimento de Sistemas Backend**
**Introdução**
Atualmente, é comum que operadoras de internet ofereçam serviços cada vez mais completos, abrangendo as diversas necessidades de seus clientes. Com a crescente dependência de serviços de internet para atividades de negócio e lazer, o número de clientes dessas operadoras tem escalado rapidamente.

Considere uma empresa que desenvolve um sistema destinado a pequenas e grandes operadoras de internet para gerenciar os planos de seus clientes. Esse sistema oferece uma solução pronta para ser integrada aos serviços internos existentes das operadoras, eliminando a necessidade de manter uma equipe dedicada à gestão e manutenção de todos os serviços.

O objetivo geral deste projeto é criar um sistema que auxilie as operadoras a gerenciarem os planos de seus clientes de forma eficiente e integrada. Para isso, o sistema será responsável por manter o cadastro dos planos e clientes, a situação dos planos contratados, gerar relatórios para análise e garantir a integração com sistemas externos da operadora. Os requisitos detalhados do sistema encontram-se em documento complementar (arquivo "Especificacao_Projeto_DesSistBackend.pdf").

**1.1 Objetivos Específicos**
Busca-se aplicar conhecimentos para modelar e implementar um serviço principal utilizando a Arquitetura Limpa proposta por Robert Martin e integrar esse serviço com dois microsserviços auxiliares. A integração será realizada utilizando tanto comunicação síncrona quanto filas assíncronas.

O projeto será realizado de forma individual e está dividido em duas fases, descritas a seguir.

**1.2 Critérios de avaliação**
Durante a avaliação, serão utilizados os seguintes critérios:

* Códigos que não estejam em JavaScript (ou TypeScript) ou contenham erros de sintaxe não serão avaliados.
* O programa deve atender aos itens especificados.
* O código deve ser organizado, legível e comentado.


---

### ARQUIVO: `orientacoes trabalho1.pdf`

**Desenvolvimento de Sistemas Backend**
**Fase Individual**
**Valor da fase: 3**

**Datas e prazos**
Prazo regular: 27/07/2026 até 24/08/2026
Prazo em atraso: 25/08/2026 até 31/08/2026
Período de refação: 01/09/2026 a 22/09/2026

**Enunciado da fase 1**
Esta fase está focada na modelagem de todo o sistema (todos os serviços) e implementação apenas do serviço principal utilizando a Arquitetura Limpa proposta por Robert Martin. O serviço principal será denominado ServicoGestao e está detalhado no documento complementar referido anteriormente.

**Entregáveis da Fase 1**
Um arquivo “.zip” contendo:

* O documento em PDF com a descrição da arquitetura contendo:
* Um diagrama UML descrevendo as classes e módulos do sistema.
* Uma explicação clara sobre como as classes foram organizadas para atender aos princípios SOLID.
* Os padrões de projeto utilizados e outras observações que demonstrem o uso da Arquitetura Limpa.
* Códigos de implementação e demais arquivos necessários para a execução do projeto.
* A seção de conclusão do documento deverá descrever como se deu o desenvolvimento da fase: desafios encontrados e como foram resolvidos (podendo citar links de referência que auxiliaram a desenvolver determinadas partes do sistema e etc.). Em caso de entrega em fase de refação, esta seção deverá listar os pontos que foram ajustados de acordo com o feedback recebido e quais pontos continuam pendentes de acordo com a visão do aluno.


* O documento em PDF com as orientações para execução do sistema (descrever banco de dados utilizado, tecnologias e passo a passo para executar).
* Todos os arquivos fonte (exceto a pasta node_modules) organizados na estrutura de pastas necessária para sua correta execução.
* Um arquivo da ferramenta Postman, conforme o template disponibilizado anexo (template.postman_collection.json), atualizado se necessário.

Exemplo de entregáveis esperados nesta fase (em um zip): A imagem abaixo mostra uma pasta com o seguinte nome: "seu_nome-desenvol-sistemas-backend-fase-1". Dentro desta pasta você encontra uma outra pasta chamada "servico-gestao", um arquivo .json com o nome "seu_nome_Desenvolvimento_de_Sistemas_backend_Fase-1.postman_collection" e um arquivo PDF com o nome "seu_nome_relatório".

Aulas que você deve assistir para realizar esta fase: Aulas 01 a 05.

**Critérios de Avaliação**

* **Critério 1:** Descrição do projeto (Valor 0.75) - A descrição do projeto contém um diagrama UML descrevendo as classes e pacotes do sistema; explica de que maneira as classes atendem os princípios SOLID; demonstra quais os padrões de projeto foram utilizados e apresenta a organização do código segundo os preceitos da Arquitetura Limpa.
* **Critério 2:** Implementação do serviço principal (Valor 1.75) - O código apresentado executa corretamente; todas as funcionalidades estão implementadas e funcionam corretamente; o banco de dados é acessado usando mapeamento objeto relacional; o código está organizado segundo os preceitos da arquitetura limpa.
* **Critério 3:** Arquivos do projeto e texto com instruções sobre como inicializar o ambiente e executar/testar o projeto (Valor 0.5)

---

### ARQUIVO: `orientacoes trabalho 2 desenvolvimento de sistemas backend.pdf`

**Desenvolvimento de Sistemas Backend**
**Fase Individual**
**Valor da fase: 4**

**Datas e prazos**
Prazo regular: 27/07/2026 até 08/09/2026
Prazo em atraso: 09/09/2026 até 15/09/2026
Período de refação: 16/09/2026 a 22/09/2026

**Enunciado da fase 2**
Esta fase objetiva a finalização do sistema proposto. Nela, dois microsserviços serão implementados e integrados ao ServicoGestao:

* ServicoFaturamento: responsável por gerenciar cobranças e pagamentos dos clientes.
* ServicoPlanosAtivos: responsável por consultar e retornar informações sobre planos ativos de cada cliente.

Os microsserviços deverão ser integrados ao serviço principal em um ambiente que conte com todos os recursos necessários para a correta execução e comunicação dos serviços, conforme apresentado durante o curso (utilizar API gateway ou name server + message broker).

**Entregáveis da Fase 2**
Um arquivo “.zip” contendo:

* Um documento em PDF com orientações para executar o sistema.
* A seção de conclusão do documento deverá descrever como se deu o desenvolvimento da fase: desafios encontrados e como foram resolvidos (podendo citar links de referência que auxiliaram a desenvolver determinadas partes do sistema e etc.). Em caso de entrega em fase de refação, esta seção deverá listar os pontos que foram ajustados de acordo com o feedback recebido.


* Todos os arquivos fonte (exceto a pasta node_modules) organizados na estrutura de pastas necessária para sua correta execução.
* Um arquivo da ferramenta Postman, conforme o template disponibilizado (template.postman_collection.json), atualizado se necessário.

Exemplo de entregáveis esperados nesta fase (em um zip): A imagem abaixo mostra uma pasta com o seguinte nome: "seu_nome-desenvol-sistemas-backend-fase-2". Dentro desta pasta você encontra outras pastas com os seguintes nomes: "servico-gestao", “servico-planos-ativos", “servico-faturamento”, “api-gateway”; um arquivo .json com o nome "seu_nome_Desenvolvimento_de_Sistemas_backend_Fase-2.postman_collection" e um arquivo PDF com o nome "seu_nome_relatório".

Aulas que você deve assistir para realizar esta fase: Aulas 05 a 10.

**Critérios de Avaliação**

* **Critério 1:** O texto descreve como implantar a aplicação e como executar ela corretamente; é possível executar o sistema a partir do texto e dos arquivos entregues (Valor 1.5)
* **Critério 2:** O sistema apresenta os três serviços solicitados com as funcionalidades especificadas; a infraestrutura necessária para os microsserviços está implantada (gateway ou name server; message broker); cada serviço possui seu banco de dados próprio com os mecanismos adequados para garantia de consistência quando for o caso; os serviços se comunicam conforme especificado (Valor 2.0)
* **Critério 3:** Arquivos do projeto e texto com instruções atualizadas sobre como inicializar o ambiente e executar/testar o projeto (Valor 0.5)

---

### ARQUIVO: `Especificacao_Projeto_DesSistBackend.pdf`

**Sistema de Controle de Planos de Operadora**
**Especificação do Sistema**

**Domínio do problema**
Considere uma startup que trabalha criando serviços para pequenas e grandes operadoras de internet.
Neste modelo de negócio, os provedores, periodicamente, precisam verificar se a assinatura de um plano continua válida para poder continuar fornecendo o serviço. Em função disso, o sistema tem de ser capaz de responder rapidamente se uma determinada assinatura continua válida. Quando um usuário assina um plano, deve ser gerado um código (código do plano). Esse código, juntamente com o código do cliente, é utilizado pela operadora e seus serviços para confirmar se um plano continua ativo ou não para determinado cliente.

Para fazer toda esta gestão, startups que trabalham nesse modelo de negócio necessitam de um software de apoio que tenha as seguintes funcionalidades:

* Cadastrar/editar/listar a base de planos que disponibiliza
* Cadastrar/editar/listar a base de clientes
* Cadastrar a assinatura de um ou mais planos por parte de um cliente
* Atualizar o valor do custo mensal de um plano
* Responder se um par cliente/plano (representando uma assinatura) continua válido
* Listar as assinaturas de um cliente
* Listar os assinantes de um plano
* Receber a notificação de pagamento de uma assinatura de um plano (enviado pelo banco conveniado) e atualizar a data de fidelidade da assinatura

O objetivo deste trabalho é desenvolver o módulo “backend” de um sistema de apoio para empresas que disponibilizem seus planos e serviços neste modelo de negócio.
Considerando o prazo disponível para o desenvolvimento desta tarefa, faremos uma simplificação importante: cada instância deste sistema irá atender uma única operadora. Isso significa que todos os planos e clientes cadastrados no sistema pertencem a uma única empresa.

**Requisitos não funcionais**
Como o objetivo deste trabalho é desenvolver um “backend” dentro de certos parâmetros iremos definir, na sequência, o conjunto de entidades de domínio a serem utilizadas, bem como a arquitetura do sistema em termos de um serviço principal e um conjunto de microsserviços.

**Entidades de domínio**

* **Plano:** modela um plano comercializado pela empresa no sistema de assinatura (codigo: Inteiro longo, nome: Texto, custoMensal: Número de ponto flutuante, data: Data de última modificação, descricao: Texto)
* **Cliente:** pessoa interessada em assinar os planos disponibilizados pela empresa (codigo: Inteiro longo, nome: Texto, email: Texto)
* **Assinatura:** modela a relação entre um plano e um cliente (codigo: Inteiro longo, codPlano: Inteiro longo, codCli: Inteiro longo, inicioFidelidade: Data, fimFidelidade: Data, dataUltimoPagamento: Data em que o último pagamento foi realizado - para o serviço de internet continuar ativo, é requerido pagamento a cada 30 dias, sem tolerância de atraso, custoFinal: Número de ponto flutuante, descricao: Texto)
* **Pagamento:** modela o pagamento de uma determinada assinatura em um determinado mês (codigo: Inteiro longo, codAss: Inteiro longo, valorPago: Número de ponto flutuante, dataPagamento: Data)

**Arquitetura de serviços**
Visando explorar todos os aspectos desenvolvidos ao longo do curso, será proposta uma arquitetura mista compreendendo serviços e microsserviços. Um serviço principal será responsável pelas seguintes funcionalidades: cadastramento e manutenção dos dados relativos a clientes, planos e assinaturas. Um microsserviço será responsável por manter o registro dos pagamentos efetuados (este serviço será integrado com o serviço de pagamento da operadora para receber as requisições). Por questões de performance, um terceiro microsserviço será capaz de responder rapidamente para os serviços se uma determinada assinatura continua ativa.

O serviço chamado de "ServicoGestao" será o módulo principal do nosso backend. Ele deverá ser o responsável por todas as operações de manutenção dos cadastros (clientes, planos e assinaturas) bem como pelas operações relativas à cobrança, tais como, atualizar o preço das assinaturas, atualizar a data de fidelidade etc. Sempre que uma assinatura for cadastrada, entra em período de fidelidade, pagando o valor com desconto. A fidelidade é de um ano (365 dias) a partir do dia da contratação.

O microsserviço "ServicoFaturamento" mantém uma base de dados com todos os pagamentos efetuados. Sempre que receber um pagamento, deve ser armazenado no banco e um evento assíncrono deve ser gerado para notificar os interessados de que um pagamento foi efetuado.

O "ServicoGestao" já é capaz de responder se uma determinada assinatura é válida ou não. Entretanto, como a demanda por esta informação é muito grande (todos os serviços periodicamente necessitam fazer essa consulta), foi projetado um microsserviço adicional visando garantir a performance do sistema. Desta forma, o microsserviço "ServicoPlanosAtivos" será responsável por responder, de forma rápida, se uma determinada assinatura de plano é ativa ou não. Ele será demandado, tipicamente pelos serviços de terceiros. Cada vez que for demandado, este microsserviço deve consultar sua "cache" interna verificando se já possui a informação relativa àquela assinatura. Caso não disponha, deverá perguntar para o "ServicoGestao" e, então, registrar em sua "cache" a informação para consultas futuras.

Tanto o "ServicoGestao" quanto o "ServicoPlanosAtivos" consomem o evento que notifica que um pagamento foi efetuado. Com essa informação o "ServicoGestao", usando suas regras de negócio, deverá atualizar a validade da assinatura. Já o "ServicoPlanosAtivos" deverá remover da sua "cache" a entrada correspondente a assinatura paga. Desta forma, da próxima vez que for solicitado a respeito dessa assinatura, irá solicitar para o "ServicoGestao" a informação atualizada evitando inconsistências.

**Requisitos funcionais (Endpoints)**

* **ServicoGestao** (incluir seeding de 10 clientes, 5 planos e 5 assinaturas)
* GET /gestao/clientes
* GET /gestao/planos
* POST /gestao/assinaturas (Recebe código do cliente, código do plano, custo final e descrição)
* PATCH /gestao/planos/:idPlano (Recebe custoMensal)
* GET /gestao/assinaturas/{tipo} (Tipo: TODOS, ATIVOS, CANCELADOS)
* GET /gestao/assinaturascliente/:codcli
* GET /gestao/assinaturasplano/:codplano
* Evento (observar): Pagamento (dia, mês, ano, código assinatura, valorPago)


* **ServicoFaturamento** (base de dados própria)
* POST /registrarpagamento (Recebe dia, mês, ano, código assinatura, valorPago)
* Evento (gerar): Pagamento (para ServicoGestao e ServicoPlanosAtivos)


* **ServicoPlanosAtivos** (manter cache e responder de forma síncrona)
* GET /planosativos/:codass (Retorna booleano: true ou false)
* Evento (observar): Pagamento