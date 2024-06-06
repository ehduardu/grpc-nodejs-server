import path from 'path';
import express from "express";
import { Server, ServerCredentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

import { chat, sayHello, sleep, throwError } from './functions'

const PROTO_PATH = path.join(__dirname, '..', 'helloworld.proto');

// Carrega o arquivo.proto
const packageDefinition = loadSync(PROTO_PATH);
const helloworldProto = loadPackageDefinition(packageDefinition);

// Cria o servidor
const serverURL = 'localhost:50051';
const server = new Server();
// @ts-ignore
server.addService(helloworldProto.helloworld.Greeter.service, {
  sayHello,
  throwError,
  // chat
})

server.bindAsync(serverURL, ServerCredentials.createInsecure(), (err, port) => {
  if (err != null) {
    return console.error(err);
  }
  console.log(`gRPC listening on ${port}`)
});




// express server ----------------------------

// const router = express.Router();
// const app = express();

// router.post('/', async (req, res) => {
//   console.log('Ok');
//   await sleep(2 * 1000);
//   res.status(200).send({ msg: 'Deu certo' });
// });


// app
//   .use(router)
//   .listen(3003, () => {
//     console.log('Express server running on 3003');
//   });

