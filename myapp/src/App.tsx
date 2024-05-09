import { ReactElement, ReactNode } from 'react';

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

type p = ReactNode;

export default App;
