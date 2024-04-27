import './App.css';
import useFetching from './useFetching';
function App() {
  const data = useFetching('posts');

  return (
    <ul>
      {data.map((item, index: number) => (
        <li key={index}>{JSON.stringify(item)}</li>
      ))}
    </ul>
  );
}

export default App;