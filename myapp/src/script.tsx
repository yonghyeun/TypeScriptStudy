const theme = {
  color: {
    default: 'grey',
    red: '#F45452',
    blue: '#1A7CFF',
    green: '#0C952A',
  },
};

type Props = { color: keyof typeof theme.color };

const SomeComponent: React.FC<Props> = ({ color }) => {
  return <div style={{ color }}></div>;
};

const App = () => {
  return <SomeComponent color='red' />;
};
