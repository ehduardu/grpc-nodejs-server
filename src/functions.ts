import { Metadata, sendUnaryData, ServerUnaryCall, status } from '@grpc/grpc-js'

export const sayHello = (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
  callback(null, { message: 'Oi ' + call.request.name })
};

export const throwError = (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
  const errorDetails = {
    reason: 'Ta invalido po',
    stack_trace: ['Trace 1', 'Trace 2'],
  };

  const metadata = new Metadata();
  metadata.set('error-details', JSON.stringify(errorDetails));


  callback({
    code: status.INVALID_ARGUMENT,
    message: 'Invalid argument',
    metadata: metadata,
  }, null);
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const chat = (call: any) => {
  call.on('data', async (note: any) => {
    console.log('chegou: ', note);

    // const randomSecond = Math.floor(Math.random() * (2 - 1 + 1) + 1);
    await sleep(2 * 1000);

    call.write(note);
    console.log('enviou: ', note);
  });

  call.on('end', () => {
    console.log('fim');
    call.end();
  });
}