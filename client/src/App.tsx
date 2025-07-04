import { useSelector } from 'react-redux';
import AppRouter from './router/Router';
import { useEffect } from 'react';

function App() {
  const data = useSelector(state => state)

  useEffect(() => {
    console.log('Redux Store: -> ');
    console.log(data);
  }, [data]);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
