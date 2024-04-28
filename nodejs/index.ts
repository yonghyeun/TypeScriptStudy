// const promise1 = new Promise((res) => res(1)).then(() => 'a').then(() => true);

const promise1 = Promise.resolve(Promise.resolve(Promise.resolve(true)));
