import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'recruiter' | 'candidate';
}

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  userRole: 'recruiter' | 'candidate' | null;
}

// Simple in-memory storage for demo purposes
const DEMO_USERS = [
  {
    id: '1',
    email: 'recruiter@demo.com',
    password: 'demo123',
    fullName: 'Demo Recruiter',
    role: 'recruiter' as const
  },
  {
    id: '2',
    email: 'candidate@demo.com',
    password: 'demo123',
    fullName: 'Demo Candidate',
    role: 'candidate' as const
  }
];

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    userRole: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem('talentflow_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          session: { user },
          loading: false,
          userRole: user.role
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('talentflow_user');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signUp = async (email: string, password: string, role: 'recruiter' | 'candidate', fullName?: string) => {
    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === email);
    if (existingUser) {
      return { error: { message: 'User already exists' } };
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      fullName: fullName || '',
      role
    };

    // Store user in localStorage
    localStorage.setItem('talentflow_user', JSON.stringify(newUser));
    
    setAuthState({
      user: newUser,
      session: { user: newUser },
      loading: false,
      userRole: newUser.role
    });

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Check demo users first
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const user: User = {
        id: demoUser.id,
        email: demoUser.email,
        fullName: demoUser.fullName,
        role: demoUser.role
      };

      localStorage.setItem('talentflow_user', JSON.stringify(user));
      
      setAuthState({
        user,
        session: { user },
        loading: false,
        userRole: user.role
      });

      return { error: null };
    }

    // Check saved users
    const savedUser = localStorage.getItem('talentflow_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.email === email) {
          setAuthState({
            user,
            session: { user },
            loading: false,
            userRole: user.role
          });
          return { error: null };
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
      }
    }

    return { error: { message: 'Invalid login credentials' } };
  };

  const signOut = async () => {
    localStorage.removeItem('talentflow_user');
    setAuthState({
      user: null,
      session: null,
      loading: false,
      userRole: null
    });
    navigate('/auth');
    return { error: null };
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    userRole: authState.userRole,
    signUp,
    signIn,
    signOut,
  };
};