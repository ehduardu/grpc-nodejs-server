const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Carrega o arquivo.proto
const packageDefinition = protoLoader.loadSync('helloworld.proto', {});
const helloworldProto = grpc.loadPackageDefinition(packageDefinition);

// Implementação do serviço
function sayHello(call, callback) {
  console.log('dudu test')
  try {
    throw 'xililin'
    const response = { message: 'Hello ' + call.request.name };
    callback(null, response);
  } catch (e) {
    console.log('dudu default error')

    const errorDetails = {
      reason: 'Ta invalido po',
      stack_trace: ['Trace 1', 'Trace 2'],
    };

    const metadata = new grpc.Metadata();
    metadata.set('error-details', JSON.stringify(errorDetails));


    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Invalid argument',
      metadata: metadata,
    }, null);

    // callback({
    //   code: grpc.status.INVALID_ARGUMENT,
    //   metadata: grpc.Metadata.fromObject({'x-error-details': JSON.stringify(errorDetails)}),
    // }, null);
  }
}

// Cria o servidor
const server = new grpc.Server();
server.addService(helloworldProto.helloworld.Greeter.service, { sayHello });

// Inicia o servidor
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err != null) {
    return console.error(err);
  }
  console.log(`gRPC listening on ${port}`)
});
