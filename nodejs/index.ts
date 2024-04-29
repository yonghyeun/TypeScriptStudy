type Card = {
  cardId: string;
};

type Cash = {
  amount: number;
};

type One<T> = { [K in keyof T]: Record<K, T[K]> }[keyof T];
type ExcludeOne<T> = {
  [K in keyof T]: Partial<Record<Exclude<keyof T, K>, undefined>>;
}[keyof T];

type PickOne<T> = One<T> & ExcludeOne<T>;

const Pay = (payment: PickOne<Card & Cash>) => {
  // payment 를 이용해 결제를 하는 어떤 로직
};
