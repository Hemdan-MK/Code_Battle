// App.tsx
import { useSelector, useDispatch } from 'react-redux';
import AppRouter from './router/Router';
import { useEffect } from 'react';
import { clearError } from './redux/authSlice';
import { type RootState } from './redux/store';
import { ToastProvider, useToast } from './hooks/useToast';

// Main App Component
function AppContent() {
  const data = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    console.log('Redux Store: -> ');
    console.log(data);

    // Show error toast if there's an error
    if (data.auth.error) {
      showToast(data.auth.error, 'error', {
        title: 'Authentication Error',
        duration: 3000
      });
      dispatch(clearError());
    }
  }, [data, dispatch, showToast]);

  return <AppRouter />;
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;