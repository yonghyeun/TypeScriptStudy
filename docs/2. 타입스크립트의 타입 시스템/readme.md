# `Type annotation` 방식

`TS` 에서의 타입 선언 방식은 두 가지 방식을 혼용하여 사용한다.

**명시적 타입 선언 방식과 점진적 타입 선언 방식** 을 혼용하여 사용한다.

## 명시적 타입 선언 방식

```ts
const isDone: boolean = true;
const someOdd: number = 3;
const color: string = 'red';
const arr: number[] = [1, 2, 3];
const x: [string, number] = ['a', 1];
```

다음처럼 어떤 값을 선언 할 떄 `:` 를 이용해 해당 값의 타입을 명시적으로 선언하는 방식을

명시적 타입 선언 방식이라고 한다.

`:` 의 우측면에 존재하는 값을 `type` 이라고 한다.

## 구조적 서브 타입 선언 방식

구조적 서브 타입 방식은 `duck typing` 양식을 따르는 자바스크립트의 특징을 살린 타입 선언 방식이다.

> `duck typing`
> 어떤 새가 꽥꽥 거리고 수영도 할줄알고 색이 하얗다면 그 새를 오리라고 이야기 하겠다.

```ts
interface Pet {
  name: string;
}

interface Cat {
  name: string;
  color: string;
}

let somePet: Pet;
let abong: Cat = { name: 'abong', color: 'yellow' };

somePet = abong;

console.log(somePet); // { name: 'abong', color: 'yellow' }
console.log(abong); // { name: 'abong', color: 'yellow' }
```

위 예시를 살펴보면 `Pet , Cat` 이라는 타입을 선언해주었다.

> 객체 형식으로 타입을 선언할 떄 `type , interface` 선언문을 사용 할 수 있다.

이후 타입이 `Cat` 인 `abong` 객체를 생성해주고

타입이 `Pet` 인 `somePet` 에 `abong` 객체를 할당해주었다.

만약 구조적 서브 타입 방식이 아닌 구조적 타입 방식인 언어에는

해당 코드가 불가능 했을 것이다.

`somePet` 에 명시적으로 선언된 타입은 `Pet` 이기 때문에 `Pet` 타입이 아닌 객체를 할당하는 것은 불가능하기 때문이다.

하지만 구조적 서브 타입 선언 방식에서는 다르다.

`Pet` 타입으로 선언된 어떤 객체는 `name : string` 만 지켜진다면 어떤 값이든 할당이 가능하다.

집합의 관점에서 살펴보면 `Pet` 타입은 `name : string` 을 만족하는 모든 타입의 합집합이다.

`Cat` 타입은 `name : string ,  color : string` 의 집합이므로

`Pet` 타입의 부분 집합이면서 최소한의 만족 조건이라 볼 수 있다.

> 다만 부분집합이라 해서 더 작아진다는 이야기가 아니다. `Cat` 타입은 `Pet` 타입에 비해 타입의 구조를 더 명확히 하고 확장한 확장 세트로 볼 수 있다.

이에 `Pet` 타입의 모든 객체는 본인 타입의 부분 집합의 객체를 할당 받는 것이 가능하다.

이러한 특징은 함수에서도 동일하다.

```ts
interface Pet {
  name: string;
}

const greeting = (animal: Pet) => {
  console.log(`Hello ${animal.name}`);
};

const abong = { name: 'abong', age: 12 };

greeting(abong); // Hello abong
```

이번에는 `abong` 의 타입을 지정해주지 않았음에도 정상적으로 작동한다.

이는 타입스크립트의 구조적 서브 타입의 유연성으로 인한 것으로

`greeting` 의 인수로 들어올 `animal` 의 구조 (프로퍼티들의 타입)가 `Pet` 의 구조와 동일하다면 같은 타입으로 간주하는 것이다.

> ### 정리
>
> 구조적 서브 타입 선언 방식은 선언된 타입의 구조를 다른 타입의 객체가 만족 할 때 오류를 일으키지 않는 방식을 의미한다.

### 구조적 타이핑의 결과

```ts
interface Cube {
  width: number;
  height: number;
  depth: number;
}

const box: Cube = {
  width: 10,
  height: 20,
  depth: 30,
};

const addLines = (b: Cube) => {
  let total = 0;
  for (const line of Object.keys(b)) {
    total += b[line];
  }
  return total;
};

console.log(addLines(box));
```

다음과 같은 코드를 보고 실행 결과를 예측해보자

`addLines` 의 인수로 들어오는 `Cube` 타입의 인수의 프로퍼티들을 이용해

`total` 에 값을 추가하니 당연히 `10 + 20 + 30` 의 결과값인 `60` 이 나올 것이라 예측되지만

컴파일 해보면 다음과 같은 오류가 뜬다.

```
index.ts:16:14 - error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Cube'.
  No index signature with a parameter of type 'string' was found on type 'Cube'.

16     total += b[line];
```

인수로들어오는 `Cube` 타입은 `number` 타입 외에도 다른 타입들을 가진 프로퍼티가 존재 할 수 있기 때문에 예기치 못한 오류가 발생 할 수 있다는 것이다.

구조적 서브타입 방식으로 인해 `addLines` 에 들어오는 객체는 `Cube` 의 타입을 만족하는 객체 일 수도 있지만

인수로 들어오는 `b`는 `Cube` 타입에서 더 확장된 타입이 들어올 수도 있다.

예를 들어

```ts
const expendBox = {
  width: 10,
  height: 20,
  depth: 30,
  color : 'red
};
```

과 같은 객체가 들어올 수 있다.

`expendBox` 객체는 구조적으로 살펴보면 `Cube` 타입과 일치한다. `width , height , depth` 모두 `number` 타입을 가지기 때문이다.

이에 만약 `expendBox` 가 `addLines` 함수의 인수로 들어가는 경우를 생각해보면

`number` 타입의 값들과 `string` 타입의 값들이 더해져 타입간의 충돌이 발생 할 수 있다.

이에 타입스크립트는 구조적 서브 타입 선언 방식 (혹은 점진적 타입 방식) 으로 인해 발생 할 수 있는 문제를 방지하기 위해 컴파일 시 오류를 발생시킨다.

이러한 한계를 방지하기 위해 `UNION` 방식이 나왔다고 하는데 그건 책을 좀 더 읽으면 나올 것 같다.

# 암묵적 타입 변환

타입스크립트가 컴파일 시 타입을 확인하는 방식은 점진적으로 일어난다.

처음엔 명시적으로 선언된 타입의 방식을 확인한다.

`:typeName` 형식으로 이뤄진 타입이 오류를 발생시키는지를 확인한다.

만약 `:` 이후에 타입이 지정되있지 않는다면 어떤 타입이든 가능한 `:any` 타입으로 암묵적으로 변경한다.

> 다만 나는 `tsconfig.json` 에서 `noImplicitAny = true` 로 해놨기 때문에 `any` 타입을 사용하지 않기로 했다.

# 값 vs 타입

프로그래밍 언어에서 변수를 선언한다는 것은

**런타임 시 메모리 주소 공간에 해당 값을 저장할 메모리 주소를 지정하고 해당 주소에 값을 저장하는 행위** 를 의미한다.

```jsx
const a = 1;
```

이라고 한다면 `1` 이란 값을 어떤 메모리에 저장하고 `a` 는 해당 메모리 주소를 가리키게 된다.

그럼 우리가 만약

```ts
interface Person {
  name: string;
}
```

과 같이 타입을 선언한 것은 런타임 시 메모리에 할당 되어 있을까 ?

**타입스크립트의 타입은 런타임 시 메모리 주소에 할당되지 않는다.**

타입스크립트에서의 타입들은 컴파일 전까지만 메모리 주소에 존재하고

자바스크립트로 컴파일 될 때엔 메모리 주소에 저장되지 않는다.

생각해보자, 타입스크립트를 자바스크립트로 변환하고 나면 우리가 적어둔 `:string` 이라든지 `interface` 와 같은 객체들이 쏙 사라진 순수한 자바스크립트 파일이 생성된다.

```ts
interface Person {
  name: string;
}

const greeting = (p: Person) => {
  console.log(`안녕하세요 ${p.name}`);
};

const dongdong: Person = {
  name: 'leedongdong',
};

greeting(dongdong);
```

다음과 같은 타입스크립트 코드를 컴파일 하여 자바스크립트 파일로 만들면

```js
var greeting = function (p) {
  console.log('\uC548\uB155\uD558\uC138\uC694 '.concat(p.name));
};
var dongdong = {
  name: 'leedongdong',
};
greeting(dongdong);
```

다음처럼 타입이 존재하지 않는 순수한 자바스크립트 코드로 변환된다.

> 한글도 인코딩된 언어로 변경되는구나 !

### 타입 공간과 값 공간

이를 통해 컴파일 이후엔 타입 스크립트의 타입들이 사라진다는 것을 알 수 있었다.

그럼 컴파일 이전엔 어떨까 ?

```ts
interface Person {
  name: string;
}

const Person = {
  age: 16,
};

console.log(Person); // { age: 16 }
```

`Person` 이란 이름을 가진 타입 (`interface`) 과 객체가 존재할 때

실행을 시켜보면 충돌이 일어나지 않고 객체인 `Person` 이 로그된다.

이는 컴파일 이전 타입스크립트 개발환경에선

타입을 저장하는 타입 공간과, 값을 저장하는 값 공간이 나뉘어져 있기 때문에 가능하다.

타입 공간과 값 공간을 분리해둠으로서 타입 공간에 저장된 타입들을 이용해 컴파일 시 오류를 확인하고

값 공간에 저장되어있는 값들을 이용해 코드를 실행시킬 수 있다.

> 값 공간에 저장되어있는 값들은 컴파일 이후에 사라지지 않으며 타입 공간에 존재하는 대부분의 타입은 컴파일 이후 사라진다.

### 런타임 이후에도 사라지지 않는 타입들

타입 공간의 대부분의 값은 런타임 후 사라진다고 했다.

하지만 몇 가지 타입들은 타입 공간과 값 공간 모두에 존재 하는 타입들도 존재한다.

그것은 바로 `class` 와 `enum` 이다.

### `class`

```ts
class Person {
  name: string; // this.name 의 type 을 의미한다.
  age: number; // this.age 의 type 을 의미한다.
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  introduce(): void {
    console.log(`hi my name is ${this.name}`);
  }
}

const lee: Person = new Person('leedongdong', 16);
lee.introduce();
```

다음과 같은 타입스크립트 코드가 있다고 해보자

`Person` 클래스를 선언 할 때 클래스의 타입을 선언하였다.

해당 타입스크립트 파일을 컴파일 하면 자바스크립트에선 다음과 같이 생겼다.

```js
var Person = /** @class */ (function () {
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  Person.prototype.introduce = function () {
    console.log('hi my name is '.concat(this.name));
  };
  return Person;
})();
var lee = new Person('leedongdong', 16);
lee.introduce();
```

이처럼 클래스로 선언된 타입이 런타임시에도 존재 할 수 있게 하는 이유는

클래스를 타입으로 선언만 하여도 런타임 시 이용할 값 공간에도 저장되게 하는 이유는

클래스들은 타입이 필요한 연산에 자주 사용되지 않기에 어떤 클래스를 선언 할 떄 타입 공간에 값과 값 공간에 값까지 두 번 표기하는 것 보다

한 번의 표기만 하여 중복되는 코드를 줄이고자 함이다.

### `enum`

#### 자바스크립트에서의 `enum` 객체

`enum` 객체는 자바스크립트에는 존재하지 않지만

객체지향 언어들에서 볼 수 있는 타입의 객체이다.

`enum` 객체는 `enumerable` 한 (열거 가능한) 객체들의 집합이면서 읽기 전용인 객체를 의미한다.

이 때 `enum` 객체의 값은 숫자 , 문자열 기반을 따른다.

숫자 기반 `enum` 객체는 값이 기본적으로 1씩 증가한다.

문자 기반 `enum` 객체는 의미 있고 읽기 쉬운 값들을 제공해야 한다.

```js
// 숫자 기반형 ENUM 객체
const enumNum = { UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 };
// 문자 기반형 ENUM 객체
const enumString = { 1 : 'UP' , 2 : 'DOWN' , .. };
```

`enum` 객체를 이용해 의미있는 객체들을 한 곳에 모아둠으로서 코드의 흐름을 더 명확하게 할 수 있다.

이 때 `enum` 객체는 항상 읽기 전용이기 때문에 자바스크립트에선

```js
const enumNum = Object.freeze({ UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 });

enumNum['UP'] = 5555;
// Cannot assign to 'UP' because it is a read-only property.
```

다음처럼 `freeze` 를 이용해 읽기 전용 객체로 만들어줘야 한다.

#### 타입스크립트에서의 `enum` 타입

하지만 타입스크립트에선 `enum` 객체를 생성 할 수 있다.

좀 더 엄밀히 말하면 `enum` 타입을 생성 할 수 있고 생성된 `enum` 타입은 컴파일 후 값 공간에 `enum` 객체 형태로 남게 된다.

```ts
enum Direction {
  UP = 1,
  DOWN = 2,
  LEFT = 3,
  RIGHT = 4,
}
```

다음처럼 타입스크립트 공간에 `enum` 타입으로 객체를 선언해주면

```js
var Direction;
(function (Direction) {
  Direction[(Direction['UP'] = 1)] = 'UP';
  Direction[(Direction['DOWN'] = 2)] = 'DOWN';
  Direction[(Direction['LEFT'] = 3)] = 'LEFT';
  Direction[(Direction['RIGHT'] = 4)] = 'RIGHT';
})(Direction || (Direction = {}));

console.log(Direction);
/**
{
  '1': 'UP',
  '2': 'DOWN',
  '3': 'LEFT',
  '4': 'RIGHT',
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
}
*/
```

다음과 같이 `enum` 객체가 생성된다.

다만 `enum` 타입은 타입의 개념보다 마치 객체를 선언하는 것과 비슷한 개념이기에 사람마다 선호하는 사람과 선호하지 않는 사람이 존재한다.

개인적으로 나도 해당 타입이 타입스크립트에서 왜 존재하는지 잘 모르겠다.

# 환경에 따라 다른 타입

```ts
interface Person {
  name: string;
}

const lee: Person = {
  name: 'leedongdong',
};
```

`type` 은 타입스크립트 뿐만 아니라 자바스크립트에서도 존재한다.

다음과 같이 타입스크립트의 타입이 `Person` 인 `lee` 의 객체를 생성했을 때

`lee` 의 타입은 `TS` 에서는 `Person` 이다.

`lee` 의 타입은 `JS` 에서는 `Object` 이다.

> 타입스크립트의 타입 값은 컴파일 이후에 사라진다고 했다.

이처럼 타입은 동일한 객체일지라도 각자 다른 환경에서 다른 값으로 존재한다.

## 타입을 확인하는 방법

### `type T1 = typeof ..`

```typescript
interface Person {
  name: string;
}

const lee: Person = {
  name: 'leedongdong',
};

type T1 = Person; // Person
type T2 = typeof lee; // Person
```

`type` 선언문을 통해 `type` 값을 생성했듯 할당 또한 가능하다.

이 때 `type` 으로 선언하여 생성하는 타입 객체는 , `TS` 환경에만 존재하기 때문에

`TS` 환경에 존재하는 `lee` 의 `type` 값을 할당 받는다.

### `const T3 = typeof ..`

```ts
interface Person {
  name: string;
}

const lee: Person = {
  name: 'leedongdong',
};

// const T3 = typeof Person; // Error
const T4 = typeof lee; // object
```

이번엔 `const` 선언문을 통해 타입 값을 **값** 으로 저장하려 할 경우

타입스크립트는 자바스크립트의 타입 값으로 저장한다.

## 타입을 확인하는 방법

타입을 할당 할 때 사용하는 선언문에 따라 `TS` 환경의 타입인지, `JS` 환경의 타입인지를 구분 할 수 있었다.

환경에 따라 타입들이 다르게 정의되는 예시들 중 특별한 예시를 살펴보자

```typescript
class Developer {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const typeInJS = typeof Developer; // function
type typeInTS = typeof Developer; // typeof Developer
```

`Developer` 클래스의 자바스크립트 환경에서의 타입은 `function` 이다. `class` 는 `new function` 을 쉽게 사용하기 위한 문법임을 잊지말자

`Developer` 클래스의 타입스크립트 환경에서의 타입은 `typeof Developer` 이다.

> 예?!

`Developer` 클래스 자체는 `Developer` 타입의 인스턴스가 아닌 생성자 함수이다.

이에 타입스크립트 환경에서 `Developer` 자체는 생성자 함수이기 때문에 `typeof Developer` 라는 타입을 갖는다.

```typescript
class Developer {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const lee: Developer = new Developer('lee', 16);

const typeInJS = typeof lee; // Object
type typeInTS = typeof lee; //  Developer
```

만약 `Developer` 클래스로 생성한 인스턴스의 `typeof` 로 생성해보면 해당 인스턴스의 타입은 `Developer` 로 할당된다.

# 타입 단언

`as` 키워드를 통해 타입을 단언 할 수 있다.

타입을 단언하다는 것은 개발자가 컴파일러보다 해당 값에 대한 타입의 확신이 있을 경우 사용한다.

주로 타입 단언은 특정 타입의 값이 런타임 시 생성 될 때 이용하면 좋다.

예를 들어 다음과 같은 경우를 생각해보자

```ts
interface Person {
  name: string;
  age: number;
}

const lee: Person = {}; // 에러 발생
lee.name = 'dongdong';
lee.age = 16;
```

`Person` 타입의 객체를 생성 할 건데, 프로퍼티의 값이 선언 당시가 아닌

선언 이후 프로퍼티가 결정되는 경우라 생각해보자

현재같은 코드에선 오류가 발생하는데, 이는 `{}` 객체의 타입이 `Person` 이지만 `name , age` 프로퍼티가 존재하지 않기 때문이다.

이는 타입스크립트의 컴파일러가 발생시킨 에러이다.

만약 `lee` 객체 자체가 `Person` 타입의 객체일 것임을 개발자가 알고 있다면

```ts
interface Person {
  name: string;
  age: number;
}

const lee = {} as Person;
lee.name = 'dongdong';
lee.age = 16;
```

`value as type` 형태로 특정한 값을 어떤 타입으로 단언해주고

선언 이후 값을 채우거나 , 런타임 시 값을 추가하는 것이 가능하다.
