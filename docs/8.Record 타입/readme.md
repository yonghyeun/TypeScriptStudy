# `Record` 타입

---

타입스크립트의 유틸리티 타입인 `Record<keys ,type>` 은 `keys : type` 으로 이뤄진

타입 객체를 생성하는 유틸리티 타입이다.

공식문서에서 말하는 정의는 다음과 같다.

> Constructs an object type whose property keys are Keys and whose property values are Type. This utility can be used to map the properties of a type to another type.

타입 객체의 프로퍼티에 타입을 지정 할 수 있다고 나온다.

`Record` 타입은 타입 객체의 프로퍼티를 미리 지정할 수 없을 때 사용하거나

타입 객체의 생김새를 가볍게 쓸 때 사용 가능하다.

### 타입 객체의 프로퍼티를 미리 결정 할 수 없을 때

---

```tsx
type Menu = {};

const menuList: Menu[] = [
  { name: '된장찌개', price: 12000 },
  { name: '김치찌개', price: 9000 },
];
```

예를 들어 위와 같은 상황에서 `Menu` 타입 객체에 어떤 프로퍼티가 추가될지 모르는 경우에는

`Menu` 타입 객체를 미리 선언해둘 수 없다.

이 때 `Record` 유틸리티 타입을 활용하여 타입 객체를 생성해줄 수 있다.

```tsx
type Menu = Record<string, string | number>;
// 프로퍼티의 타입을 string , 타입의 값을 string | number 로 지정
const menuList: Menu[] = [
  { name: '된장찌개', price: 12000 },
  { name: '김치찌개', price: 9000 },
];
```

만일 `Record` 타입이 아닌 일반적인 방법으로 타입 객체를 생성하면 다음과 같은 오류가 발생한다.

```tsx
type Menu = {
  string: string | number;
};
// Error ! 객체 리터럴은 알려진 속성만 지정 할 수 있습니다.
```

### 문자열 리터럴 타입으로 프로퍼티를 정의 할 때

---

위에서 들었던 예시에서

```tsx
type Menu = Record<string, string | number>;
```

해당 타입 객체는 프로퍼티의 타입이 `string` 이기만 하면 어떤 프로퍼티든 타입으로 넣는 것이 가능하다.

```tsx
type Menu = Record<string, string | number>;

const menuList: Menu[] = [
  { name: '된장찌개', price: 12000, '엉뚱한 프로퍼티': 123 },
];
```

가질 수 있는 프로퍼티의 범위가 매우 넓은 것이다.

이에 프로퍼티 키에 문자열 리터럴 타입을 넣어줌으로서 해결 할 수 있다.

```tsx
type MenuKeys = 'name' | 'price';
type Menu = Record<string, string | number>;

const menuList: Menu[] = [
  { name: '된장찌개', price: 12000, '엉뚱한 프로퍼티': 123 }, // 컴파일 에러 발생
];
```

### `Partial` 을 활용하여 타입 객체의 정확도 높히기

`Partial<Type>` 유틸리티 타입은 `Type` 객체 모두를 옵서녈 타입으로 변경해준다.

```tsx
type MenuKeys = 'name' | 'price' | 'recommend';
type Menu = Partial<Record<MenuKeys, string | number>>;

const menuList: Menu[] = [
  { name: '된장찌개', price: 12000, recommend: '졸마탱' },
  { name: '김치찌개', price: 9000 },
];
```

```tsx
type Menu = {
  name?: string | number | undefined;
  price?: string | number | undefined;
  recommend?: string | number | undefined;
};
```

위에서 `Menu` 타입 객체의 프로퍼티를 옵셔널 타입으로 추가해줌으로서 타입의 유연성을 높혀줄 수 있다.
