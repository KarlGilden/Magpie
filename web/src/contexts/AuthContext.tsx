// src/context/AuthContext.js (or similar)
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useFetch } from '../api/useFetch';

interface Props {
    children: ReactNode;
}

interface AuthContextType {
    userId: number | null;
    loading: boolean;
    signin: (userId: number) => void;
    signout: () => Promise<void>;
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: Props) => {
  const fetch = useFetch();
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch<{ id: number }>({ path: '/api/auth/currentUser' });
        setUserId(response.id);
      } catch (error) {
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    // We intentionally omit fetch from deps to avoid re-running on re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signin = (id: number) => {
    setUserId(id);
  };

  const signout = async () => {
    try {
      await fetch({ path: '/api/auth/logout', method: 'POST' });
    } finally {
      setUserId(null);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, loading, signin, signout }}>
        {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context =  useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
