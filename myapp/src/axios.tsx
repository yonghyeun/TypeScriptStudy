import { ReactElement } from 'react';

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
