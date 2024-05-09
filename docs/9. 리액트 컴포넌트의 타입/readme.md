# 함수 컴포넌트 타입

---

나는 주로 함수형 컴포넌트를 사용 할 것이기 때문에 함수형 컴포넌트 타입만 정리하도록 한다.

## `React.FC<P>`

---

```jsx
type Props = {
  name: string,
  age: number,
};

const App: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{age}</h2>
    </div>
  );
};

export default App;
```

`App` 의 함수형 컴포넌트의 경우에는 `React.FC<PropsType>` 과 같이 사용한다.

```tsx
type FC<P = {}> = FunctionComponent<P>;
```

`FC` 같은 경우는 `FunctionComponent<P>` 가 추상화 된 형태로 `FunctionComponent` 는 다음과 같은 타입 구조를 갖는다.

```tsx
interface FunctionComponent<P = {}> {
        (props: P, context?: any): ReactNode;
```

반환하는 값은 `ReactNode` 이고 `props` 의 타입을 제네릭 타입 형태로 받는다.

함수형 컴포넌트에서 `React.FC<P>`로 하는 타입 지정은 결국 `FunctionComponent<P>` 의 호출 시그니처를 받아 사용하는 것과 같다.

물론 호출시그니처를 사용하지 않고 일일히 다음처럼 지정해주는 것도 가능하다.

```jsx
import { ReactNode } from 'react';

const App = ({ name, age }: { name: string, age: number }): ReactNode => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{age}</h2>
    </div>
  );
};

export default App;
```

개인 취향에 맞게 사용하는 것이 가능한데, 만약 반환하는 값이 `ReactNode` 가 아닌 특정한 타입을 사용하게 될 것이라면 `React.FC` 보다, 따로 지정해주는 것이 좋은 선택이 될 수 있다.

```tsx
// React.FC 의 호출 시그니처  방식
const App: React.FC<Props> = ({ name, age }) => {
// 직접 지정해주는 방식
const App = ({ name, age }: { name: string, age: number }): ReactNode => {
```

### `Props` 에 타입 가드 설치하기

---

```tsx
type Props = {
  name: string;
  age: number;
};

const App: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{age}</h2>
    </div>
  );
};

export default App;
```

만약 다음과 같은 컴포넌트에서 `props`의 `name` 에 들어올 수 있는 값은 `string` 으로 매우 넓은 범위를 가지고 있다.

이 때 만약 들어오는 `props.name` 의 타입을 좁히기 위해 타입 가드를 사용하는 것이 가능하다.

```tsx
type Props = {
  // 김춘식, 박덕자 유니온 타입으로 지정하여 이외의 값이
  // 들어오게 코드가 설정되면 컴파일 에러 발생
  name: '김춘식' | '박덕자';
  age: number;
};
```

이러한 타입가드를 통해 들어오는 `props` 들의 타입을 좁힐 수 있다. 이러한 방법을 활용해

`children` 에 `ReactElement` 를 받을 수도 , `string` 만 받을 수도 더 타입을 좁히는 것이 가능하다.

# `ReactElement  vs JSX.Element vs ReactNode`

---

`Virtual DOM` 의 노드를 가리키는 3가지 타입이 있는데 이 3가지 타입은

큰 틀에서는 비슷하지만, 세부적으로 보면 조금씩 활용방법이 다르다.

## 세 타입의 정의

---

### `React.Element`

---

```tsx
interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> =
    | string
    | JSXElementConstructor<any>,
> {
  type: T;
  props: P;
  key: string | null;
}
```

`ReactElement` 타입의 경우엔 `React.createElement()` 를 통해 생성되는 엘리먼트의 타입을 가리킨다.

각 `Element` 들은 `type , props  key` 를 갖는 객체가 되는데 `ReactElement` 는 결국

해당 객체의 타입을 가리키고 있는 것이다.

이 때 제네릭 타입 `T` 에 `JSXElementConstructor<any>` 할당 가능하게 함으로서

`JSX` 를 마치 `HTMLElement` 처럼 사용 할 수 있는 유연함을 제공했다.

### `JSX.Element`

```tsx
interface Element extends React.ReactElement<any, any> {}
```

`JSX.Element` 는 `ReactElement<type , props>` 에 `type , props` 모두에 `any` 가 들어간 형태이다.

즉 `React.Element` 보다는 타입 스코프가 넓은 형태로 `JSX` 로만 이뤄진 어떤 객체이면 모두 허용한다는 뜻을 갖는다.

### `ReactNode`

---

```tsx
type ReactNode =
  | ReactElement
  | string
  | number
  | Iterable<ReactNode>
  | ReactPortal
  | boolean
  | null
  | undefined
  | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES];
```

`ReactNode` 는 컴포넌트의 반환 값이 가질 수 있는 모든 타입을 가지고 있다.

즉 컴포넌트의 반환 값이 `ReactElement` 가 될 수도 , 원시타입의 값이 될 수 있도록 모두 허용한다.

## 세 타입의 활용 방법

### `ReactNode`

---

`ReactNode` 는 나머지 타입들에 비해 `React` 의 타입들 뿐 아니라 원시 타입도 가능하게 함으로서

매우 넓은 타입 스코프를 가지고 있다.

이렇게 넓은 타입 스코프가 도움이 되는 경우를 따지면 `props.children` 일 것이다.

`children` 에는 컴포넌트가 들어올 수도 , 문자나 숫자가 들어올 수도 , 조건부 렌더링을 위한 `boolean` , 혹은 이터레이터가 들어올 수도 있는듯 말이다.

```tsx
type Props = {
  name: '김춘식' | '박덕자';
  age: number;
  children?: ReactNode | undefined;
};

const App: React.FC<Props> = ({ name, age, children }) => {
  return (
    <div>
      <h1>{name}</h1>
      <h2>{age}</h2>
      {children}
    </div>
  );
};
```

이런식으로 사용이 가능하다.

### `JSX.Element`

---

컴포넌트의 `props` 로 `JSX.Element` 만을 받고 싶을 때 사용하면 유용하다.

여러 컴포넌트의 합성을 위해 `Props` 에 `JSX.Element` 를 받는 경우 사용하면

`JSX.Element` 가 아닌 다른 타입의 값이 `props` 로 들어오는 것을 방지 할 수 있다.

```tsx
type Props = {
  icon: JSX.Element;
};

const Button: React.FC<Props> = ({ icon }) => {
  return <button>{icon}</button>;
};
```

또한 `JSX.Element` 로 타입을 좁혀주면 `icon` 의 타입이 `ReactElement` 로 좁혀지기 때문에

내부에서 `icon` 의 `type , key , props` 에 접근하는 것이 가능하다.

### `React.Element`

`JSX.Elemnt` 는 `React.Element` 에서 `props` 가 `any` 타입으로 지정된

더 넓은 타입 스코프를 갖는 `ReactElement` 의 타입을 칭한다 하였다.

`React.Element<P,T>` 를 활용하여 `ReactElement` 의 타입을 더 좁히는 것이 가능하다.

```jsx
type IconProps = {
  size: `${8 | 16 | 24}px`;
  backgroundColor: 'red' | 'blue';
};

type Props = {
  icon: ReactElement<IconProps>;
};

const Button: React.FC<Props> = ({ icon }) => {
  return <button>{icon}</button>;
};
```

다음과 같이 `props` 로 들어올 수 있는 `icon` 의 `props` 들을 지정해

더 타입을 좁힌 `ReactElement` 객체를 `Props` 받는 것이 가능하다.

`props` 의 타입들을 좁혀놨기 때문에 내부에서 `icon.props` 뿐 아니라

`icon.props.size , icon.props.backgroundColor` 등까지도 접근하는 것이 가능하다.

# 정리

---

결국 `ReactElement , ReactNode , JSX.Element` 모두 리액트의 `Virtual DOM` 을 구성하는 노드들을 가리키는 타입이다.

다만 `ReactElement` 는 `type , props` 를 제네릭 타입으로 지정해줘 해당 노드의 타입을 더 좁혀줄 수 있고

`JSX.Element` 는 `React.Element<any , any>` 로 매우 넓은 타입 범위를 갖는 `React.Element` 의 타입을 갖는다.

`ReactNode` 는 가장 넓은 타입 범위를 가지며, `React.Element` 뿐 아니라 원시타입도 가질 수 있게 함으로서 유연함을 제공한다.
