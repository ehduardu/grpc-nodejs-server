import path from 'path';
import express from "express";
import { Server, ServerCredentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

import { chat, hello, sleep } from './functions'

const PROTO_PATH = path.join(__dirname, '..', 'hello_message.proto');

const proto = loadSync(PROTO_PATH);
const definition = loadPackageDefinition(proto).HelloService;

const serverURL = 'localhost:50051';
const server = new Server();
// @ts-ignore
server.addService(definition.service, {
  hello,
  chat
})

server.bindAsync(serverURL, ServerCredentials.createInsecure(), () => {
  server.start();
  console.log(`gRPC server running on ${serverURL}`);
});




// express server ----------------------------

const router = express.Router();
const app = express();

router.post('/', async (req, res) => {
  console.log('Ok');
  await sleep(2 * 1000);
  res.status(200).send({ msg: 'Deu certo' });
});


app
  .use(router)
  .listen(3003, () => {
    console.log('Express server running on 3003');
  });

