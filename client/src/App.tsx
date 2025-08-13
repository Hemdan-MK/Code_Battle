// App.tsx
import { useSelector, useDispatch } from 'react-redux';
import AppRouter from './router/Router';
import { useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { clearError } from './redux/authSlice';
import { type RootState } from './redux/store';
import { ToastProvider } from './hooks/useToast';
import { useToast } from './hooks/useToastDefinition';
import { useSocket } from './hooks/useSocket';
import { getUser } from './utils/tokenUtils';
import { logoutThunk } from './redux/thunk';

// Main App Component
function AppContent() {
  const data = useSelector((state: RootState) => state);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const user = getUser();
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const handleActivity = useCallback(() => {
    if (socket && user) {
      socket.emit('update_status', { userId: user.id, status: 'online' });
    }
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      if (socket && user) {
        socket.emit('update_status', { userId: user.id, status: 'away' });
      }
    }, 5 * 60 * 1000); // 5 minutes
  }, [socket, user]);

  useEffect(() => {
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    handleActivity(); // Initial call

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [handleActivity]);

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

  useEffect(() => {
    if (!socket) return;

    const handleBanned = (data: { message: string }) => {
        showToast(data.message || 'You have been banned by an administrator.', 'error', {
            title: 'Access Denied',
            duration: 5000
        });
        dispatch(logoutThunk());
        navigate('/', { replace: true });
    };

    socket.on('you_are_banned', handleBanned);

    return () => {
        socket.off('you_are_banned', handleBanned);
    };
  }, [socket, dispatch, navigate, showToast]);

  return <AppRouter />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;