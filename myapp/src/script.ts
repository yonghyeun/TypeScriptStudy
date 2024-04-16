type Example = {
  a: string;
  b: number;
  c: boolean;
};

type SubSet<T> = {
  [K in keyof T]?: T[K];
};

const aExample: SubSet<Example> = { a: 'ABCD' };
const bExample: SubSet<Example> = { b: 123 };
const cExample: SubSet<Example> = { c: true };
