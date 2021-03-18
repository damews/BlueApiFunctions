# I Blue It  - API

Este projeto contém uma API desenvolvida em Node.js com a tecnologia [Microsoft Azure Functions](https://azure.microsoft.com/pt-br/services/functions/) 3.0 para o Jogo Sério [I Blue It](https://udescmove2learn.wordpress.com/2018/04/26/i-blue-it/#manuais). Esta API serve para o envio das informações geradas dentro do jogo para um banco de dados facilitando a sua consulta dentro de uma aplicação web, o I Blue It Analytics (disponível [neste repositório]()).
Este projeto é parte de meu Trabalho de Conclusão de Curso (que está disponível em )

Logo abaixo está passo-a-passo para caso queira baixar e executar em sua máquina.

A documentação da API está descrita na wiki deste repositório. 

# Sobre

Este é a API base que se comunica com o Jogo Sério I Blue It. Alterações foram realizadas dentro do jogo sério para o envio das informações. O repositório da última versão do jogo está disponível [neste link](https://github.com/UDESC-LARVA/IBLUEIT).

Esta API também serve para suprir a aplicação web desenvolvida para visualizar os dados gerados dentro do jogo sério. Para mais informações sobre esta aplicação, [visite o seu repositório]().

A tecnologia *serverless* Microsoft Azure Functions, ou seja, não necessita de um servidor exclusivo para execução. Esta tecnologia permite que as rotas da API sejam tratadas como funções que são alocadas dinamicamente nos servidores da Microsoft e são executadas quando ocorre uma chamada de evento. 

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/en/) 12.16.1
- [Microsoft Azure Functions](https://azure.microsoft.com/pt-br/services/functions/) 3.0
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com) 5.9.2
- [validatorjs](https://github.com/skaterdav85/validatorjs) 3.18.1
- [Nodemailer](https://nodemailer.com/about/) 6.4.6
- bcryptjs 2.4.3

## Antes de executar...

Esta API utiliza necessita de algumas configurações. Certifique-se de que você possui um arquivo para guardar as variáveis de ambiente da aplicação (*local.settings.json*). Este arquivo deve conter o seguinte valor:

    [...]
    "Values":{
	    [...],
	    "MongoDbAtlas": [SEU ENDEREÇO DE CONEXÃO PARA UM BANCO MONGODB]
    },
    [...]
    
> A API também possui uma funcionalidade para envio de emails ao executar um cadastro. Verifique dentro do arquivo **utils.js** (shared/utils.js) para modificar e configurar do seu próprio jeito.

## Passo-a-Passo

Primeiro, vamos preparar o seu ambiente para que consiga simular a chamada de funções. Para informações mais detalhadas acesse a [documentação da Microsoft](https://docs.microsoft.com/pt-br/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-javascript#configure-your-environment).

1. Instale o [Visual Studio Code](https://code.visualstudio.com/download);
2. Instale a [Extensão Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) para o Visual Studio Code (VS Code);
3. Clone este repositório para uma pasta de sua máquina;
4. Acesse o menu da Extensão Azure Functions na barra lateral esquerda do VS Code;
5. Localize a pasta "Local Project" para certificar-se que a extensão encontrou as funções;
6. Aperte a tecla **F5** para rodar o projeto localmente.

Ao rodar a aplicação você verá no terminal do VS Code as rotas geradas (localhost) que podem ser utilizadas para enviar/buscar as informações.

As informações para caso queira implantar as funções no ambiente da Microsoft estão disponíveis na documentação da própria Microsoft sobre esta plataforma.

## Autenticação

Para enviar e buscar suas próprias informações é necessário um Código de Envio (Token) que deve ser inserido no cabeçalho (*header*) da requisição. 

Para gerar um Código de Envio é necessário criar uma Conta I Blue It. Esta conta pode ser criada a partir da rota para realizar tal ação (**ver referência de rotas**), assim como o código de envio existe uma rota para a geração.

## Referência de Rotas

A seguir, encontra-se uma tabela com as rotas desenvolvidas e qual é a sua função correspondente (pasta deste repositório)

| Paciente            |        |                                                 |                               |
|---------------------|--------|-------------------------------------------------|-------------------------------|
|                     | METHOD | Descrição                                       | Azure Function                |
|                     | POST   | Cadastrar um Paciente                           | SendPacient                   |
|                     | POST   | Atualizar um Paciente                           | UpdatePacient                 |
|                     | DELETE | Excluir um Paciente                             | DeletePacient                 |
|                     | GET    | Busca de Pacientes                              | GetPacients                   |
|                     | GET    | Busca de Paciente                               | GetPacient                    |
| Plataforma          |        |                                                 |                               |
|                     | POST   | Cadastrar um Resumo de Plataforma               | SendPlataformOverview         |
|                     | GET    | Buscar Resumos de Plataforma                    | GetPlataformOverview          |
|                     | GET    | Estatística de Resumos de Plataforma [Paciente] | GetPacientPlataformStatistics |
|                     | GET    | Estatísticas de Resumos de Plataforma           | GetPlataformStatistics        |
|                     | GET    | Buscar Resumos de Plataforma [Paciente]         | GetPacientPlataformOverview   |
| Minigame            |        |                                                 |                               |
|                     | POST   | Cadastrar um Resumo de Minigame                 | SendMinigameOverview          |
|                     | GET    | Buscar Resumos de Minigame                      | GetMinigameOverview           |
|                     | GET    | Buscar Resumos de Minigame [Paciente]           | GetPacientMinigameOverview    |
|                     | GET    | Estatísticas de Resumos de Minigame             | GetMinigamesStatistics        |
| Calibração          |        |                                                 |                               |
|                     | POST   | Cadastrar um Resumo de Calibração               | SendCalibrationOverview       |
|                     | GET    | Buscar Resumos de Calibração                    | GetCalibrationOverview        |
|                     | GET    | Buscar Resumos de Calibração [Paciente]         | GetPacientCalibrationOverview |
| Conta               |        |                                                 |                               |
|                     | POST   | Criar uma Conta [I Blue It ou Paciente]         | CreateAccount                 |
|                     | POST   | Autenticar                                      | LoginAccount                  |
|                     | GET    | Buscar Conta de Paciente                        | GetPacientAccount             |
| Código de Envio     |        |                                                 |                               |
|                     | POST   | Gerar um Código de Envio                        | CreateGameToken               |
| Dados Respiratórios |        |                                                 |                               |
|                     | GET    | Buscar Dados Respiratórios                      | GetFlowDataDevice             |

### Documentação em POSTMAN

Caso queira exemplos de requisições e uma documentação mais detalhada, siga os seguintes passos:

1. Instale o [Postman](https://www.postman.com/downloads/)
2. Dentro do Postman, vá em File->Import
3. Importe o arquivo que se encontra na pasta **utils** deste repositório (*BlueApiFunc.postman_collection.json*)

Para uma descrição mais detalhada das rotas [acesse aqui]()

### Códigos de Resposta HTTP

Abaixo, encontra-se os possíveis códigos para as respostas das requisições:

| Código HTTP | Descrição                             |
|-------|---------------------------------------|
 200    | Requisição realizada com sucesso      |
 400    | Requisição inválida                   |
 401    | Requisição não autorizada (Login)     |
 403    | Autenticação Falhou (Código de Envio) |
 404    | Dados não encontrados                 |
 500    | Erro interno da aplicação             |


