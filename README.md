# I Blue It  - API

Este projeto contém uma API desenvolvida em Node.js com a tecnologia [Microsoft Azure Functions](https://azure.microsoft.com/pt-br/services/functions/) 3.0 para o Jogo Sério [I Blue It](https://udescmove2learn.wordpress.com/2018/04/26/i-blue-it/#manuais). Esta API serve para o envio das informações geradas dentro do jogo para um banco de dados facilitando a sua consulta dentro de uma aplicação web, o I Blue It Analytics (disponível [neste repositório](https://github.com/LiserLine/BlueApiFront)).
Este projeto é parte de meu Trabalho de Conclusão de Curso (que está disponível em )

Logo abaixo está passo-a-passo para caso queira baixar e executar em sua máquina.

A documentação da API está descrita na wiki deste repositório. 

# Sobre

Este é a API base que se comunica com o Jogo Sério I Blue It. Alterações foram realizadas dentro do jogo sério para o envio das informações. O repositório da última versão do jogo está disponível [neste link](https://github.com/UDESC-LARVA/IBLUEIT).

Esta API também serve para suprir a aplicação web desenvolvida para visualizar os dados gerados dentro do jogo sério e possibilitar algumas operações com as informações. Para mais informações sobre esta aplicação, [visite o seu repositório](https://github.com/LiserLine/BlueApiFront).

A tecnologia *serverless* Microsoft Azure Functions, ou seja, não necessita de um servidor exclusivo para execução. Isso permite que as rotas da API sejam tratadas como funções que são alocadas dinamicamente nos servidores da Microsoft e são executadas quando ocorre uma chamada de evento. 

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/en/) 12.16.1
- [Microsoft Azure Functions](https://azure.microsoft.com/pt-br/services/functions/) 3.0
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Mongoose](https://mongoosejs.com) 5.9.2
- [validatorjs](https://github.com/skaterdav85/validatorjs) 3.18.1
- [Nodemailer](https://nodemailer.com/about/) 6.4.6
- bcryptjs 2.4.3

## Antes de executar...

Esta API utiliza necessita de algumas configurações. Certifique-se de que você possui um arquivo para guardar as variáveis de ambiente da aplicação (*local.settings.json*). Este arquivo deve conter o seguinte valor para :

    [...]
    "Values":{
	    [...],
	    "MONGO_CONNECTION": [SEU ENDEREÇO DE CONEXÃO PARA UM BANCO MONGODB]
    },
    [...]

## Passo-a-Passo

Primeiro, vamos preparar o seu ambiente para que consiga simular a chamada de funções. Para informações mais detalhadas acesse a [documentação da Microsoft](https://docs.microsoft.com/pt-br/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-javascript#configure-your-environment).

1. Instale o [Visual Studio Code](https://code.visualstudio.com/download);
2. Instale a [Extensão Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) para o Visual Studio Code (VS Code);
3. Clone este repositório para uma pasta de sua máquina;
4. Abra o VSCode na plasta com o código clonado;
5. Acesse o menu da Extensão Azure Functions na barra lateral esquerda do VS Code;
6. Localize a pasta "Local Project" para certificar-se que a extensão encontrou as funções;
7. Aperte a tecla **F5** para rodar o projeto localmente.

Ao rodar a aplicação você verá no terminal do VS Code as rotas geradas (localhost) que podem ser utilizadas para enviar/buscar as informações.

As informações para caso queira implantar as funções no ambiente da Microsoft estão disponíveis na documentação da própria Microsoft sobre esta plataforma.

## Autenticação

Alguns _enpoints_ desta API necessitam de uma chave de acesso, chamada de **Game Token**. Esta chave precisa ser enviada através do _header_ "game-token". Esta chave é gerada a partir de uma conta de acesso do tipo _**Administrator**_.Para criar uma conta de acesso, verifique o _endpoint_ (**Conta -> Cadastrar uma Conta de Acesso**), e para gerar uma chave de acesso, acesse o _endpoint_ (**Chave de Acesso -> Gerar Chave de Acesso**).

## Referência de Rotas

A seguir, encontra-se uma tabela com as rotas desenvolvidas e qual é a sua função correspondente (pasta deste repositório)

|                      |        |                                         |                               |
|----------------------|--------|-----------------------------------------|-------------------------------|
|                      | METHOD | Descrição                               | Azure Function                |
| Paciente             |        |                                         |                               |
|                      | POST   | Cadastrar um Paciente                   | SendPacient                   |
|                      | POST   | Excluir os dados de um Paciente         | DeletePacient                 |
|                      | POST   | Buscar os dados de um Paciente          | GetPacient                    |
|                      | DELETE | Buscar dados de Pacientes               | GetPacients                   |
| Resumo de Plataforma |        |                                         |                               |
|                      | POST   | Cadastrar um Resumo de Plataforma       | SendPlataformOverview         |
|                      | GET    | Buscar Resumos de Plataforma            | GetPlataformOverview          |
|                      | GET    | Buscar Resumos de Plataforma [Paciente] | GetPacientPlataformOverview   |
| Resumo de Minigame   |        |                                         |                               |
|                      | POST   | Cadastrar um Resumo de Minigame         | SendMinigameOverview          |
|                      | GET    | Buscar Resumos de Minigame              | GetMinigameOverview           |
|                      | GET    | Buscar Resumos de Minigame [Paciente]   | GetPacientMinigameOverview    |
| Calibração           |        |                                         |                               |
|                      |        |                                         |                               |
|                      | POST   | Cadastrar um Resumo de Calibração       | SendCalibrationOverview       |
|                      | GET    | Buscar Resumos de Calibração            | GetCalibrationOverview        |
|                      | GET    | Buscar Resumos de Calibração [Paciente] | GetPacientCalibrationOverview |
| Conta de Acesso      |        |                                         |                               |
|                      | POST   | Criar uma Conta de Acesso               | CreateAccount                 |
|                      | POST   | Autenticar                              | LoginAccount                  |
|                      | GET    | Buscar Conta de Paciente                | GetPacientAccount             |
|                      | DELETE | Excluir Conta de Acesso [Administrador] | DeleteAccount                 |
| Chave de Acesso      |        |                                         |                               |
|                      | POST   | Gerar uma Chave de Acesso               | CreateGameToken               |
| Dados Respiratórios  |        |                                         |                               |
|                      | GET    | Buscar Dados Respiratórios              | GetFlowDataDevice             |


### Documentação em POSTMAN

Caso queira exemplos de requisições e uma documentação mais detalhada você pode:

Realizar a visualização via Postman ou ferramenta auxiliar:
1. Instale o [Postman](https://www.postman.com/downloads/)
2. Dentro do Postman, vá em File->Import
3. Importe o arquivo que se encontra na pasta **utils** deste repositório (*BlueApiFunc.postman_collection.json*)

ou

Acessar a página de documentação criada em Postman -> [acesse aqui]()
