# 템플릿 리터럴 타입

---

템플릿 리터럴이란 백틱과 `${}` 를 이용하는 문자열을 의미한다.

```tsx
const fullName = 'leedongdong';

console.log(`안녕하세요 저는 ${fullName}`);
```

다음처럼 말이다.

이처럼 타입스크립트 4.1 버전 이후부터는 템플릿 리터럴 타입을 사용하는 것이 가능해졌다.

```tsx
type Scale = 1 | 2 | 3 | 4 | 5 | 6;
type Headeing = `h${Scale}`; // h1 | h2 | h3 .. | h6
```

이렇게 타입을 문자열로 지정하는 경우는 주로 매번 정해진 값만 들어와야 하는 값의 경우

정해진 값을 문자열 타입으로 지정하고 타입을 할당해줌으로서

예상치 못한 값이 들어오는 휴먼에러를 방지할 수 있다.

# 유틸리티 타입

---

이전에도 설명했엇지만 유틸리티 타입이란 타입스크립트 내부에 미리 선언되어 있는 타입들로

새로운 타입 값을 생성 할 수 있도록 하는 타입이다.

자주 사용되는 유틸리티 타입들은 다음과 같다.

- Partial<T>: Creates a new type where all properties of type T are optional. This can be useful when working with configurations or settings that might have default values.

- Required<T>: Creates a new type where all properties of type T are required, even if they were optional in the original type. This can be helpful for enforcing that certain properties must be provided.

- Readonly<T>: Creates a new type where all properties of type T are immutable. This can help prevent accidental mutations and ensure that data passed into a function or component cannot be altered.

- Pick<T, K>: Creates a new type with only the properties K (a subset) from type T. This is useful when you want to limit a type to only certain properties.

- Omit<T, K>: Creates a new type by removing the properties K from type T. This is useful when you want to exclude certain properties from a type.

- Record<K, T>: Creates a type that maps all keys K to values of type T. This is useful for creating a type that describes objects with specific key-value pairs.

- ReturnType<F>: Creates a type that represents the return type of a function F. This is useful when you want to use or enforce the return type of a function elsewhere in your code.

- Exclude<T, U> : Exclude from T those types that are assignable to U

이런 유틸리티 타입들을 활용하면 타입의 중복을 방지한 채로 새로운 타입을 생성해내는 것이 가능하다.

예를 들어 `Pick<T , K>` 를 활용하여 `props` 들의 타입을 지정해주는 경우의 예시를 살펴보자

```tsx
type Handlers = {
  onClick?: () => void;
  onMouseMove?: () => void;
};

type Content = {
  title: string;
  content: string;
};

const CardContent: React.FC<Content> = ({ title, content }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

const CardWitHandler: React.FC<Content & Pick<Handlers, 'onClick'>> = ({
  title,
  content,
  onClick,
}) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <button onClick={onClick}></button>
    </div>
  );
};
```

위 예시에서 `CardWithHandler` 컴포넌트의 타입을 지정해주기 위해 `Content` 타입과 `Handlers` 타입에서 `onClick` 타입만 `Pick` 유틸리티 타입을 이용해 빼준 후

인터섹션 타입을 만들어줌으로서 새로운 타입을 생성해주었다.

```tsx
type Content = {
  title: string;
  content: string;
  onClick?: () => void;
  onMouseMove?: () => void;
};
```

만약 이처럼 `Content` 타입 내에 `?:` 를 통해 이벤트 핸들러들을 옵셔널 타입으로 지정해줘도

`CardContent , CardWithHandler` 에서 `Content` 타입을 사용해주는데 있어서는 전혀 문제가 없다.

하지만 옵셔널 타입은 이런 유연성을 제공하는만큼 , 엄격함을 잃어버리기 때문에

이보다는 유틸리티 타입을 활용하여 사용에 맞게 적절한 타입을 생성해줌으로서

타입 안정성을 높혀주는 것이 좋다.

# 커스텀 유틸리티 타입

---

유틸리티 타입들을 혼합하여 커스텀 유틸리티 타입을 만드는 것도 가능하다.

우아한 타입스크립트 교재에서는 3개 이상의 유틸리티 타입들을 혼합해 새로운 유틸리티 타입을 생성하는 과정을 보여주는데

이 과정을 이해해보자

### 시나리오

---

```tsx
type Card = {
  cardId: string;
};

type Cash = {
  amount: number;
};

const Pay = (payment: Card | Cash) => {
  // payment 를 이용해 결제를 하는 어떤 로직
};
```

이처럼 `Pay` 함수는 매개변수로 `Card | Cash` 타입의 객체를 받아 어떤 로직을 처리하는 함수이다.

문제가 없어보이지만 다음 예시를 살펴보자

```tsx
Pay({ cardId: 'abc', amount: 1000 });
```

만약 `cardId , amount` 타입이 모두 존재하는 객체가 들어온다고 했을 때

해당 코드는 컴파일 시 오류가 발생하지 않는다.

엄연히 말하면 모든 값이 존재하더라도 이는 유니온 타입의 정의에 해당하기 때문이다.

### 해결하기 위한 방법 1 : 식별할 수 있는 유니온

---

```tsx
type Card = {
  type: 'card'; // 식별 할 수 있는 타입 추가
  cardId: string;
};

type Cash = {
  // 식별 할 수 있는 타입 추가
  type: 'cash';
  amount: number;
};
```

해결 할 수 있는 방법은 각 타입 별 식별 할 수 있는 타입을 추가해줘

식별 할 수 있는 유니온 타입으로 변경해주는 방법이 있다.

위 방법을 사용하면 다음과 같이 컴파일 오류를 발생시킨다.

```tsx
Pay({ type: 'cash', cardId: 'abc', amount: 1000 });
// Error ! : Cash 형식에 cardId 가다없습니다
```

하지만 이 방법은 매개변수에 들어가는 유니온 타입들이 많을 경우

일일히 모든 타입을 찾아가 식별 할 수 있는 타입을 추가해줘야 한다는 번거로움이 있다.

> 가장 좋은 방법은 처음 타입을 생성 할 때 부터 식별 할 수 있는 타입을 포함하여 생성하는 것일 것이다.

### 해결하기 위한 방법 2: 커스텀 유틸리티 타입 생성하기

본질적으로 `Pay` 함수 매개변수의 타입이 가져야 하는 타입은 다음과 같다.

`Card , Cash` 타입의 프로퍼티 중 하나를 가졌다면 , 다른 타입의 프로퍼티 값이 존재하지 않거나 , `undefined` 로 평가되어야 한다.

```tsx
type Card = {
  cardId: string;
  amount?: undefined;
};

type Cash = {
  amount: number;
  cardId?: undefined;
};

const Pay = (payment: Card | Cash) => {
  // payment 를 이용해 결제를 하는 어떤 로직
};

Pay({ cardId: 'abc', amount: 123 });
// Error ! : number 형식은 undefined 에 포함 될 수 없습니다.
```

이처럼 각 타입에 다른 타입의 프로퍼티 값을 `undefined` 로 선언해둘 경우

다른 타입의 값이 들어오는 경우 에러를 발생 시킨다.

위 예시에선 동적 타입 추론 도중 `Card` 타입으로 추론된 객체 내부에 `amount` 프로퍼티의 값이 `undefined` 가 아니라 컴파일 에러가 발생한다.

이 때 어떤 타입 두 개를 받아 본인을 제외한 타입의 프로퍼티 키가 옵셔널 타입으로 지정되고

값은 `undefined` 로 값을 할당하는 커스텀 유틸리티 타입을 생성해보자

```tsx
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
```

이는 다음과 같이 `PickOne` 이라는 커스텀 유틸리티 타입을 만들어

본인 타입 외의 다른 타입의 프로퍼티는 옵셔널로 , 값은 `undefined` 로 만들어 줄 수 있다.

상당히 수식이 복잡한데 .. 탑 다운 방식으로 살펴보자

```tsx
type PickOne<T> = One<T> & ExcludeOne<T>;

const Pay = (payment: PickOne<Card & Cash>) => {
  // payment 를 이용해 결제를 하는 어떤 로직
};
```

최종적으로 사용된 커스텀 유틸리티 타입 `PickOne<Card & Cash>` 은

```tsx
Card & Cash = {
  cardId: string;
  amount: number;
}
```

다음과 같은 타입 값을 이용해 새로운 타입 값을 만드는 유틸리티 타입이다.

```tsx
type PickOne<T> = One<T> & ExcludeOne<T>;

// PickOne<Card & Cash> = One<Card & Cash> & ExcludeOne<Card & Cash>
```

이후 `PickOne<T>` 는 `One , ExcludeOne` 이라는 타입 객체들의 인터섹션 타입을 반환하는 유틸리티 타입임을 알 수 있다.

```tsx
type One<T> = { [K in keyof T]: Record<K, T[K]> }[keyof T];

//  typeof One<Card & Cash> => Redcord<'cardId' , string> | Redcord<'amount', number>
```

`One<T>` 유틸리티 타입은 `T` 타입의 여러 프로퍼티가 담긴 하나의 타입 객체를

한 가지씩의 프로퍼티만을 가지는 `Record` 타입 객체들의 유니온 타입으로 반환한다.

> 1. `Record<key , value>` 유틸리티 타입은 `key : value` 로 이뤄진 타입 객체를 반환한다.
>    인덱스 시그니처 방식과 유사하지만 특징적인 차이로는 `key` 값에 유니온 타입이나 템플릿 리터럴 타입이 사용 가능하다는 점이다.
> 2. `{어떤 타입 객체 T}[keyof T]` 에서 `[keyof T]` 는 `T` 객체의 값들을 유니온 타입으로 반환힌다.
> 3. 그렇기 때문에 `One<T>` 의 반환 값은 `T` 타입 내부의 프로퍼티들을 분할해 생성한 타입 객체들의 유니온 타입이 반환된다.

```tsx
type ExcludeOne<T> = {
  [K in keyof T]: Partial<Record<Exclude<keyof T, K>, undefined>>;
}[keyof T];

// typeof ExcludeOne<Card & Cash> = Partial<Redcord<'amount' , undefined>> | Partial<Redcord<'cardId' , undefined>>
```

`ExcludeOne<T>` 을 순서대로 하나씩 살펴보자

`Exclude<keys , except key>` 는 `keys` 의 값들 중 `except key` 값을 제외한 타입을 반환한다.

`Exclude<keyof T , K>` 는 `T` 타입의 모든 프로퍼티에서 `K` 프로퍼티를 제외한 키 값들을 유니온 타입으로 반환한다.

`Redcord<Exclude<keyof T , K> , undefined>` 는 `T` 타입에서 `K` 프로퍼티를 제외한 타입 객체의 키들의 값이 `undefine이` 인 타입 객체를 반환한다.

`Partial<Type object>` 는 해당 `Type object` 의 모든 타입을 옵셔널 타입으로 변경한다.

`ExcludeOne<T>` 타입의 반환 타입은 `T` 타입의 타입 값들이 하나씩만 담겼으며 타입 값이 `undefined` 인 타입들을 유니온 타입으로 반환한다.

이러고 다시 `PickOne<T>` 의 정의를 살펴보자

```tsx
type PickOne<T> = One<T> & ExcludeOne<T>;
```

아 ~ `One<T>` 는 모든 타입들의 값이 하나씩 제대로 존재하는 타입들의 유니온 타입과

`ExcludeOne<T>` 는 모든 타입들의 값이 하나씩 옵셔널 타입이면서 값이 `undefined` 인 타입이니까

두 유니온 타입들의 인터섹션 타입은

`{cardId : string , amount ?: undefined} | {cardId ?: undefined , amount : number}` 임을 이해 할 수 있다.
