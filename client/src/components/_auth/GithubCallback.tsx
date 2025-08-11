import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { githubAuthThunk } from '../../redux/thunk';
import { unwrapResult } from '@reduxjs/toolkit';

const GitHubCallback: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleGitHubCallback = async () => {
            try {
                const code = searchParams.get('code');
                const error = searchParams.get('error');
                const errorDescription = searchParams.get('error_description');

                if (error) {
                    throw new Error(errorDescription || 'GitHub authorization was denied');
                }

                if (!code) {
                    throw new Error('No authorization code received from GitHub');
                }

                console.log("hihi");
                
                const resultAction = await dispatch(githubAuthThunk({ code }));
                const result = unwrapResult(resultAction);

                console.log('GitHub login successful:', result);

                // Redirect to home page on success
                if(result.isAdmin){
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/home', { replace: true });
                }

            } catch (error: any) {
                console.error('GitHub callback error:', error);
                setError(error.message || 'GitHub authentication failed');

                // Redirect to login page with error after 3 seconds
                setTimeout(() => {
                    navigate('/login', {
                        replace: true,
                        state: {
                            error: error.message || 'GitHub authentication failed'
                        }
                    });
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        handleGitHubCallback();
    }, [searchParams, dispatch, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Completing GitHub authentication...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <strong className="font-bold">Authentication Failed</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                    <p className="text-gray-600">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return null;
};

export default GitHubCallback;