<h1 align="center">Serverless - Certificate Ignite</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E5&labelColor=000000">
</p>

## ✨ Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Serverless Framework](https://www.serverless.com/)
- [Puppeteer](https://github.com/puppeteer/puppeteer)
- [Amazon Lambda](https://aws.amazon.com/pt/lambda/)

## 💻 Projeto

Este projeto foi desenvolvido na trilha de NodeJS do programa Ignite oferecido pela [Rocketseat](https://rocketseat.com.br).

O projeto tem como responsabilidade gerar um certificado para um usuário e a possibilidade de pesquisar a validade de um certificado.

## 🛠️ Pré-requisitos

Antes de iniciar é necessário ter a ferramenta [serverless](https://www.serverless.com/framework/docs/getting-started) instalada na máquina.

## 🚀 Como executar

- Clone o repositório e acesse o diretório.

### Para rodar localmente

- Execute `yarn` para instalar as dependências
- Execute `yarn dynamodb:install` para baixar o DynamoDB localmente
- Execute `yarn dynamo:start` para iniciar o banco de dados em ambiente local
- Execute, em outro terminal, o `yarn dev` para iniciar a aplicação em ambiente local

### Para fazer o deploy

- Configurar as credenciais do usuário
- Execute `yarn deploy` para subir o projeto para AWS Lambda

## 📄 Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

## Autor

<img
  style="border-radius: 50%;"
  src="https://avatars.githubusercontent.com/jordane-chaves"
  width="100px;"
  title="Foto de Jordane Chaves"
  alt="Foto de Jordane Chaves"
/>
<br />

Feito com 💜 por Jordane Chaves
