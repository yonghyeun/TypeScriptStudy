type Handlers = {
  onClick?: () => void;
  onMouseMove?: () => void;
};

type Content = {
  title: string;
  content: string;
  onClick?: () => void;
  onMouseMove?: () => void;
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
