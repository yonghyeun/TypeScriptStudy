# 타입스크립트의 동적 타입할당 특성

---

타입스크립트는 동적 타입 할당 언어로

타입을 따로 명시해주지 않아도 타입을 동적으로 추론한다.

```tsx
const arr = [1, null, 'a'];
type arrayType = typeof arr; // (number | null | string) []
```

위 예시에서 `arr` 의 타입을 지정해주지 않더라도 타입스크립트는 `arr` 의 내부 모습을 보고

타입을 동적으로 추론하여 타입을 할당한다.

# `infer` 를 이용한 타입 추론

---

`infer` 는 단어 그대로 타입을 추론하는 의미를 갖는다.

`infer` 선언문은 조건부 타입 추론에서 추론된 타입 값을 타입 변수처럼 활용하는 것이 가능하게 한다. 추론된 타입은 조건부 타입에서 참인 부분에서만 사용 가능하다.

> 이는 조건부 타입 정의에서 추론된 타입을 사용 할 수 있을 때에만 참인 부분으로 넘어가기 때문에 추론되기 때문에 참일 때만 할당되는 타입 부분에서만 사용 가능하다.

### 타입 추론의 예시

---

```typescript
type ElementOfArr<T extends any[]> = T extends (infer K)[] ? K : never;
```

위 타입은 `any[]` 타입의 제네릭 타입 `T` 가 들어왔을 때

제네릭 타입 `T` 배열의 추론된 타입 형태를 `(infer K)[]` 로 받아 추론된 배열 내 원소의 타입을 반환한다.

> **유틸리티 타입**
> 이처럼 기존에 존재하는 타입들을 이용해 새로운 타입을 생성시키는 타입을 유틸리티 타입이라고 정의한다.

`infer K` 는 동적으로 추론된 타입의 값을 할당 받는다는 것을 더 명확히 이해하기 위해

다음과 같은 예시를 살펴보자

```tsx
type ElementOfArr<T extends (boolean | any)[]> = T extends (boolean | infer K)[]
  ? K
  : never;
```

해당 유틸리티 타입은 `boolean` 과 어떤 값이든 가져올 수 있는 배열의 타입을 추론하는데

`boolean` 타입 외 배열 내 다른 타입의 값을 반환한다.

```tsx
const arr = [true, 'a'];

type typeExceptBoolean = ElementOfArr<typeof arr>; // string
```

`arr` 에서 추론된 타입은 `boolean | string` , 조건부 타입에서 비교될 때 사용되는 타입은 `boolean | infer K` 이기 때문에

`K` 는 `string` 으로 추론되고 , `K` 가 반환된다.

# `infer` 를 활용하는 다양한 방법

---

### 서드파티 라이브러리의 함수 매개변수 타입 추론

---

어떤 라이브러리에서 제공하는 함수가 존재한다고 해보자

```tsx
const foo = (person: {
  name: string;
  age: number;
  hobby: [string, string];
}) => {
  console.log(person.name, person.age, person.hobby);
};
```

이 때 해당 라이브러리에선 해당 함수에 사용 가능한 인수들의 타입을 지정해주지 않아

우리가 직접 인수에 들어갈 타입을 생성해줘야 할 때

매 번 타입을 지정해주는 것은 매우 비효율적이다.

이에 `infer` 를 통해 해당 함수 매개변수의 타입을 추론하여 사용 할 수 있다.

```tsx
type GetArgumentsType<T extends (...arg: any) => any> = T extends (
  ...arg: infer U // T 타입의 매개변수 타입 추론
) => any
  ? U // 매개변수 타입 반환
  : never;

type FooArgumentsType = GetArgumentsType<typeof foo>;
```

### 재귀적 타입 추론

```tsx
const a = ['apple', ['orange', 100], [[4, [true]]]];
```

와 같이 여러 배열의 중첩으로 이뤄진 배열을

평탄화 하는 함수를 생성했다고 해보자

```tsx
const flatten = (arr) => {
  const result: unknown[] = [];

  const makeFlatArray = (array) => {
    for (let index = 0; index < array.length; index++) {
      const item = array[index];
      if (Array.isArray(item)) {
        makeFlatArray(item);
      } else {
        result.push(item);
      }
    }
  };

  makeFlatArray(arr);
  return result;
};

const array = ['apple', ['orange', 100], [[4, [true]]]];
const flatArray = flatten(array); // [ 'apple', 'orange', 100, 4, true ]
```

다음과 같이 재귀적인 과정을 통해 중첩되어 있는 배열을 평탄화 시키는 `flatten` 함수를 생성해줬다.

우선 타입 추론 하기 전 타입 할당 없이 함수를 생성해주었는데

해당 함수에 타입을 할당시켜보자

```tsx
type _Flatten<T> = T extends (infer K)[] ? _Flatten<K> : T;
type Flatten<T extends readonly unknown[]> = T extends unknown[]
  ? _Flatten<T>[]
  : readonly _Flatten<T>[];

const flatten = <T extends unknown[]>(arr: T): Flatten<T> => {
  const result: unknown[] = [];

  const makeFlatArray = (array: unknown[]) => {
    for (const item of array) {
      if (Array.isArray(item)) {
        makeFlatArray(item);
      } else {
        result.push(item);
      }
    }
  };

  makeFlatArray(arr);

  return result as Flatten<T>;
};

const array = ['apple', ['orange', 100], [[4, [true]]]];
const flatArray = flatten(array);
```

`_Flatten<T>` 타입은 `T` 타입이 `(infer U)[]` 타입인 경우 재귀적으로 `_Flatten<U>` 를 호출하고 , 배열이 아닌 경우 `T` 의 타입을 반환한다.

`Flatten<T>` 타입은 `_Flatten<T>` 를 활용하여 타입 값을 반환하는데 이는 마치

`flatten` 함수가 `Flatten<T>` , `flatten` 함수 내부에서 정의된 `makeFlatArray` 함수가 `_Flatten<T>` 의 역할을 하는 것과 유사하다.

### `Promise` 내부 응답값의 타입을 가져오기

---

```tsx
const promise1 = Promise.resolve([1, 2, 3]);
// typeof promise1 => Promise<number[]>
```

> `Promise.resolve` 는 `fullfiled` 상태인 `Promise` 객체를 반환한다.

우리는 `Promise` 객체를 한 번만 사용하기 보다 주로 체이닝을 통해 여러 `Promise` 객체를 다루게 된다.

프로미스 체이닝을 간단한 원시값들을 이용해 표현하면 다음과 같다.

```tsx
const promise1 = new Promise((res) => res(1)).then(() => 'a').then(() => true);
// typeof promise1 => Promise<boolean>
```

이 때 `promise1` 의 타입은 가장 마지막에 존재하는 프로미스 객체의 타입과 동일한데

위 코드를 `reslove` 를 이용하여 표현하면 다음과 같다.

```tsx
const promise1 = Promise.resolve(Promise.resolve(Promise.resolve(true)));
// typeof promise1 => Promise<boolean>
```

`Promise.resolve` 함수가 반환하는 값의 타입은 어떻게 지정되어 있기에

가장 최종적으로 반환되는 `Promise` 객체의 타입값으로 결정 할 수 있었을까 ?

```tsx
interface PromiseConstructor {
    ...
    /**
     * Creates a new resolved promise for the provided value.
     * @param value A promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    resolve<T>(value: T): Promise<Awaited<T>>;
    ...
```

타입스크립트 `lib.es.2015.promise.d.ts` 파일을 열어 살펴보면

`resolve` 함수의 반환값은 `Promise<Awaited<T>>` 로 정의된 모습을 볼 수 있다.

`Awaited<T>` 의 생김새를 살펴보자

````ts
/**
 * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
 */
type Awaited<T> = T extends null | undefined ? T : // special case for `null | undefined` when not in `--strictNullChecks` mode
    T extends object & { then(onfulfilled: infer F, ...args: infer _): any; } ? // 해당 타입이 객체이면서 `then` 메소드를 부를 수 있는 Promise 객체일 경우 fulfiled 된 객체의 타입을 F 로 추론한다.
        F extends ((value: infer V, ...args: infer _) => any) ? // F 객체 내부에 value 값이 존재한다면 해당 값의 타입을 V 로 추론하고
            Awaited<V> : // 추론된 V를 Awaited 에 재귀적으로 할당한다.
        never : // 절대 발생할 수 없는 일이기에 never 타입으로 설정해둠
    T; // 객체가 아니거나 then 메소드를 호출하지 못할 경우 해당 객체 타입 반환
    ```
````

`Awaited<T>` 는 `infer` 를 이용한 타입 추론으로 이뤄진 유틸리티 타입이다.

이는 재귀적으로 `T` 타입의 객체가 프로미스 타입이 아닐 때 까지 재귀적으로 호출해나가며 `onfulfilled` 된 값이 프로미스 타입이 아닌 경우 해당 타입을 반환시킨다.

이를 통해 `Promise.reslove` 메소드의 반환값의 타입이 `Promise<Awaited<T>>` 로 설정되어 재귀적으로 가장 마지막 프로미스 객체의 내부 값의 타입을 추출 할 수 있다.
