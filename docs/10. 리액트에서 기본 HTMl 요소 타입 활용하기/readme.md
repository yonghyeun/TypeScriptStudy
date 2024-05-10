# 리액트에서 기본 `HTML` 요소 타입 활용하기

---

이전 `docs` 에서는 컴포넌트 로직에 사용되는 `props` 들의 타입을 사용하는 방법에 대해 배웠다.

예를 들어 조건부 렌더링을 위한 `props` 값을 받거나

렌더링 할 컴포넌트들에 사용할 데이터들을 `props` 로 받거나 하는 등의 행위로 말이다.

이번엔 `HTMLElement` 에 전달해줄 `props` 의 타입을 설정하는 경우를 공부해보자

```tsx
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode | undefined;
};

const FancyButton: React.FC<Props> = ({ children }) => {
  return <button>{children}</button>;
};
```

우리는 매우 자주 `HTMLElement` 들을 재사용 하기 위해

여러 `props` 를 받아 각 다른 스타일 혹은 다른 이벤트 들이 장착된 `HTMlElement` 들을 반환한다.

예를 들어 위 `FancyButton` 컴포넌트에서 `props` 로 `onClick` 이벤트를 받고 싶다고 해보자

```tsx
import { ReactNode } from 'react';

type Props = {
  children?: ReactNode | undefined;
  onClick: () => void; // onClick 이벤트 타입 추가
};

const FancyButton: React.FC<Props> = ({ children, onClick }) => {
  // props.onClick 을 HTMlElement 에 장착
  return <button onClick={onClick}>{children}</button>;
};
```

이 때 매우 단순하게 `onClick` 이벤트를 일반적인 호출 시그니처를 이용하여 타입을 정의해줄 수 있지만

좀 더 타이트하게 타입을 좁혀줄 수 있다.

**어떤 `HTMLElement` 에 장착되는 이벤트 핸들러인지, 어떤 값을 인수로 받는지** 등 말이다.

즉 , `HTMlElement` 에 사용되는 `props` 의 타입을 좁혀주기 위해선 , 어떤 `HTMLElement` 에 장착되는지에 대한 타입 정보를 이용해 타입을 좁혀줄 수 있다.

## `DetailedHTMLProps`

---

```tsx
type NativeButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type Props = {
  children?: ReactNode | undefined;
  onClick: NativeButtonProps['onClick'];
};

const FancyButton: React.FC<Props> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

다음과 같이 `NativeButtonProps` 로 `HTMLButtonElement` 에 전달 가능한 `props` 목록들을 가져온 후

인덱스 시그니처를 활용하여 해당 타입을 가져오는 것이 가능하다.

이렇게 하여 추론된 `onClick` 이벤트의 타입은 다음과 같다.

```tsx
onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
```

다만 나는 개인적으로 `DetailedHTMLProps` 의 사용 방법은 좋아보이지 않는다.

내가 타입스크립트에 익숙치 않은 모습도 있겠지만 해당 방법은 여러 제네릭 타입의 향연이 펼처지니

흐름을 추적하기 쉽지 않다.

## `ComponentPropsWithoutRef`

---

```tsx
import { ComponentPropsWithoutRef, ReactNode } from 'react';

type NativeButtonProps = ComponentPropsWithoutRef<'button'>;

type Props = {
  children?: ReactNode | undefined;
  onClick: NativeButtonProps['onClick'];
};

const FancyButton: React.FC<Props> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

두 번째 방법은 `ComponentPropsWithoutRef` 이다.

해당 방법을 이용하여도 추론되는 타입의 값은 위와 같다.

더 직관적이고 편한 방법이라 생각한다.

다만 타입스크립트에선 `ComponentPropsWithoutRef` 뿐 아니라 `ComponentPropsWithRef` 가 존재한다.

왜 `ref` 가 존재하는 `props` 와 존재하지 않는 `props` 를 구분할까 ?

### `ref` 는 `props` 처럼 하향적으로 전달 할 수 없다.

---

`ref` 는 실제 `Actual DOM` 에 마운트 되어있는 실제 노드에 접근하기 위한

특별한 어트리뷰트이다.

`JSX` 객체에 `ref` 를 넣게 된다면 다음과 같이 `ReactElement` 가 생성된다.

```tsx
  const buttonRef = useRef(null);

  return (
    <button onClick={onClick} ref={buttonRef}>
      {children}
    </button>
```

```tsx
{
  type: 'button',
  props: {
    onClick: onClick,
    ref: buttonRef, // ⭐ ref 값에 buttonRef 객체가 할당된다.
    children: children
  },
  key: null
}
```

해당 `ref` 가 가리키고 있는 `buttonRef` 는 `VirtualDOM` 에서 정의된 해당 `ReactElement` 의 컨텍스트를 통해 실제 `Actual DOM` 에 마운트 되어 있는 `Actual DOM Node` 을 찾아 포인팅 하게 된다.

결국 `ReactElement` 에 `props.ref` 가 사용 가능하기 위해서는 `type` 이 실제 `HTMLElement` 여야 한다는 것이다.

하지만 만약 위의 예시처럼 `Component` 에 `ref` 를 전달하게 된다면 다음과 같은 `ReactElement` 가 생성될 것이다.

```tsx
const FancyButton: React.FC<Props> = ({ children, onClick, ref }) => {
  return (
    <button onClick={onClick} ref={ref}>
      {children}
    </button>
  );
};
```

```tsx
<FancyButton onClick={handleClick} ref={buttonRef}>
  Click me!
</FancyButton>
```

```tsx
{
  type: FancyButton,
  props: {
    onClick: handleClick,
    ref: buttonRef,
    // ⭐ buttonRef 는 FancyButton 을 포인팅하는데
    // ActualDom 에는 FancyButton 이 존재하지 않는다.
    children: "Click me!"
  },
  key: null
}
```

이로인해 컴포넌트 내부에 존재하는 `HTMLElement`에 넘겨줄 `ref` 를 `ReactElement` 의 `props` 에서 전달받으려 하는 행위는 `ref` 의 존재 이유에 적절하지 않다.

```tsx
  const buttonRef = useRef(null); // ⭐ 컴포넌트 내부에서 정의하고

  return (
    // props 로 직접 전달은 사용 가능
    <button onClick={onClick} ref={buttonRef}>
      {children}
    </button>
```

즉, 다시 말하면 `props` 에는 `ref`가 들어 갈 수 있다. `HTMLElement` 에 `ref` 를 직접적으로 전달하는 경우엔 말이다.

이외의 경우에는 `props` 에 `ref` 가 들어 갈 수 없다.

> 만일 전달을 원한다면 `forwardRef` 를 사용해야 한다.

> 항간에 들리는 `React19` 버전에선 `ref` 도 `props` 로 넘겨줄 수 있도록 변경될 예정이라는 영상을 본적 있다. 어떻게 변할려나
> https://www.youtube.com/watch?v=4YOrhJjmN88
