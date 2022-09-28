import { DynamoDB } from 'aws-sdk';

// Essas opções são necessárias apenas em localhost
const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
	
	// As linhas abaixo são necessárias para executarmos o DynamoDB local sem ter nenhuma credencial na AWS
  accessKeyId: 'x',
  secretAccessKey: 'x',
}

const isOffline = () => {
  return process.env.IS_OFFLINE;
}

export const document = isOffline() 
  ? new DynamoDB.DocumentClient(options)
  : new DynamoDB.DocumentClient();
