export const hello = (call: any, callback: any) => {
  callback(null, { msg: 'Oi ' + call.request.name })
};

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