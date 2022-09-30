import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'certificate-ignite',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',  // Se não configurarmos nenhuma região, será selecionado por padrão us-east-1
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    lambdaHashingVersion: '20201221',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',         // O effect que irá fazer
        Action: ['dynamodb:*'],  // Onde será realizado o effect, neste caso será liberada todas as tabelas do dynamodb
        Resource: ['*'],         // Libera para todos os Resources configurados
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['*'],
      }
    ],
  },
  // import the function via paths
  functions: {
    generateCertificate: {                                  // Nome da função
      handler: 'src/functions/generateCertificate.handler', // Caminho da função criada
      events: [                                             // Eventos disponíveis para nossa função
        {
          http: {                                           // Existem vários, mas vamos utilizar o HTTP
            path: 'generateCertificate',                    // Caminho para chamar a função
            method: 'post',                                 // Método da requisição
            cors: true,                                     // Habilita o cors
          },
        }
      ],
    },
    verifyCertificate: {
      handler: 'src/functions/verifyCertificate.handler',
      events: [
        {
          http: {
            path: 'verifyCertificate/{id}',
            method: 'get',
            cors: true,
          }
        }
      ],
    }
  },
  package: {
    individually: false,              // Alteramos para `false` para gerar apenas um ZIP com todas as funções
    include: ['./src/templates/**'],  // Para incluir todos os arquivos do diretório templates no deploy
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external: ['chrome-aws-lambda'],
    },
    dynamodb: {
      stages: ['dev', 'local'], // Informa quando deve utilizar o DynamoDB Local
      start: {
        port: 8000,             // Porta padrão do DynamoDB
        inMemory: true,         // Essa opção informa para executar em memória
        migrate: true,          // Essa opção deve ser true para o DynamoDB gerar a nossa tabela automaticamente.
      }
    }
  },
  resources: {
    Resources: {
      dbCertificateUsers: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'users_certificate',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            }
          ],
        }
      }
    }
  },
};

module.exports = serverlessConfiguration;
