type Person = {
  name: string;
  age: number;
};

const leedongdong = {
  name: 'lee',
};

const greeting = (person: Person) => {
  console.log(`안녕하세요 저는 ${person.name}입니다.`);
};

type leedongdongType = typeof leedongdong;
