import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { HeartIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-pattern">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-pattern px-4">
        <div className="max-w-md w-full card-romantic p-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-pink-gradient rounded-full flex items-center justify-center mb-4 shadow-pink">
              <HeartIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-pink-text mb-2">S.M.A.R.T Goals</h1>
            <p className="text-pink-text/70 mb-6">Sign in to start creating and managing your beautiful goals</p>
            <button
              onClick={handleGoogleSignIn}
              className="btn-pink w-full inline-flex justify-center items-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-pattern">
      <header className="bg-card-bg shadow-sm border-b border-border-pink">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center">
            <HeartIcon className="h-6 w-6 text-primary-pink mr-2" />
            <h1 className="text-xl font-bold text-pink-text">S.M.A.R.T Goals</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-pink-text text-sm">{user.displayName}</span>
            <button
              onClick={handleSignOut}
              className="bg-soft-pink hover:bg-border-pink text-pink-text py-1.5 px-3 rounded-xl text-sm transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;