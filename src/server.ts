import path from 'path';
import express from "express";
import { Server, ServerCredentials, loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const PROTO_PATH = path.join(__dirname, '..', 'hello_message.proto');

const proto = loadSync(PROTO_PATH);
const definition = loadPackageDefinition(proto).HelloService;

const hello = (call: any, callback: any) => {
  callback(null, { msg: 'Oi ' + call.request.name })
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const chat = (call: any) => {
  call.on('data', async (note: any) => {
    console.log('chegou: ', note);

    const randomSecond = Math.floor(Math.random() * (2 - 1 + 1) + 1);
    await sleep(randomSecond * 1000);

    call.write(note);
    console.log('enviou: ', note);
  });

  call.on('end', () => {
    console.log('fim');
    call.end();

    // setTimeout(
    //   () => {
    //     console.log('fim');
    //     call.end();
    //   },
    //   30 * 1000
    // );
  });
}

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

// const router = express.Router();
// const app = express();

// router.get('/', (req, res) => {
//   console.log('Ok');
//   res.status(200).send({ msg: 'Deu certo' });
// });


// app
//   .use(router)
//   .listen(3000, () => {
//     console.log('Express server running on 3000');
//   });
