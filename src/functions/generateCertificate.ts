import { APIGatewayProxyHandler } from "aws-lambda";
import { readFileSync } from 'fs';
import { join } from 'path';
import { compile } from 'handlebars';
import dayjs from "dayjs";
import chromium from 'chrome-aws-lambda';
import { S3 } from 'aws-sdk';

import { document } from '../utils/dynamodbClient';

interface ICreateCertificate {
  id: string;
  name: string;
  grade: string;
}

interface ITemplate {
  id: string;
  name: string;
  grade: string;
  medal: string;
  date: string;
}

const compileTemplate = async (data: ITemplate) => {
  const filePath = join(process.cwd(), 'src', 'templates', 'certificate.hbs');

  const html = readFileSync(filePath, 'utf-8');

  return compile(html)(data);
}

const generatePDF = async (content: string): Promise<Buffer> => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    userDataDir: '/dev/null',
  });

  const page = await browser.newPage();

  await page.setContent(content);

  const pdf = await page.pdf({
    format: 'a4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true,
    path: process.env.IS_OFFLINE ? './certificate.pdf' : null,
  });

  await browser.close();

  return pdf;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate;

  // Buscar o usuário pelo id
  const response = await document.query({
    TableName: 'users_certificate',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id,
    }
  }).promise();

  const userAlreadyExists = response.Items[0];

  if (!userAlreadyExists) {
    // Inserir dados no banco de dados DynamoDB
    await document.put({
      TableName: 'users_certificate',
      Item: {
        id,
        name,
        grade,
        created_at: dayjs().format(),
      },
    }).promise();
  }

  // Ler arquivo selo.png como base64
  const medalPath = join(process.cwd(), 'src', 'templates', 'selo.png');
  const medal = readFileSync(medalPath, 'base64');

  const data: ITemplate = {
    id,
    name,
    grade,
    medal,
    date: dayjs().format('DD/MM/YYYY'),
  };

  const content = await compileTemplate(data);

  const pdf = await generatePDF(content);

  const s3 = new S3();

  await s3.putObject({
    Bucket: 'certificate-nodejs',
    Key: `${id}.pdf`,
    ACL: 'public-read',
    Body: pdf,
    ContentType: 'application/pdf',
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'Certificado criado com sucesso!',
      url: `https://certificate-nodejs.s3.sa-east-1.amazonaws.com/${id}.pdf`,
    }),
  }
}
