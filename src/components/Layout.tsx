import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = () => {
    auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Smart Goals App</h1>
          <p className="text-center mb-6">Sign in to start creating and managing your smart goals</p>
          <button
            onClick={signIn}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Smart Goals</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.displayName}</span>
            <button
              onClick={signOut}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-md text-sm"
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