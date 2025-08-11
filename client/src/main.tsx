import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { SocketProvider } from './contexts/SocketContext';
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </Provider>
)
