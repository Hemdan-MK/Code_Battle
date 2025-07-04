import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (code && window.opener) {
      // Send message to parent
      window.opener.postMessage(
        {
          type: 'google-auth-success',
          code,
        },
        window.location.origin
      );

      // Close popup
      window.close();
    }
  }, [code]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Poppins, sans-serif' }}>
      <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>Completing login...</p>
    </div>
  );
};

export default GoogleCallback;
