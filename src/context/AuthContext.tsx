import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getSupabaseConfig } from '../lib/supabase';
import { UserSession } from '../types';

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string, nama: string, universitas?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginAsDemoStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserSession = {
  id: 'usr-demo-01',
  email: 'budi.santoso@mahasiswa.ac.id',
  nama_lengkap: 'Budi Santoso',
  universitas: 'Universitas Indonesia',
  jurusan: 'Ilmu Komputer',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window !== 'undefined') {
      const savedDemo = localStorage.getItem('studiringkas_demo_user');
      if (savedDemo) {
        try {
          return JSON.parse(savedDemo);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isConfigured } = getSupabaseConfig();

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        if (isConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted && session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              nama_lengkap: session.user.user_metadata?.nama_lengkap || session.user.email?.split('@')[0] || 'Mahasiswa',
              universitas: session.user.user_metadata?.universitas || 'Perguruan Tinggi',
              jurusan: session.user.user_metadata?.jurusan || 'Sains & Teknologi',
            });
          }
        }
      } catch (err) {
        console.warn('Supabase session check notice:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    checkSession();

    if (isConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            nama_lengkap: session.user.user_metadata?.nama_lengkap || session.user.email?.split('@')[0] || 'Mahasiswa',
            universitas: session.user.user_metadata?.universitas || 'Perguruan Tinggi',
            jurusan: session.user.user_metadata?.jurusan || 'Sains & Teknologi',
          });
        } else if (!localStorage.getItem('studiringkas_demo_user')) {
          setUser(null);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, [isConfigured]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) {
          // If invalid or network issue, notify
          return { success: false, error: error.message };
        }
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || email,
            nama_lengkap: data.user.user_metadata?.nama_lengkap || email.split('@')[0],
            universitas: data.user.user_metadata?.universitas,
          });
          localStorage.removeItem('studiringkas_demo_user');
          return { success: true };
        }
      }

      // If Supabase not yet configured with real project, fallback to local test account
      await new Promise((r) => setTimeout(r, 500));
      const simulatedUser: UserSession = {
        id: `usr-${Date.now()}`,
        email,
        nama_lengkap: email.split('@')[0].replace('.', ' '),
        universitas: 'Universitas Indonesia',
      };
      setUser(simulatedUser);
      localStorage.setItem('studiringkas_demo_user', JSON.stringify(simulatedUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal login' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, nama: string, universitas?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              nama_lengkap: nama,
              universitas: universitas || 'Perguruan Tinggi',
            },
          },
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const registeredUser: UserSession = {
            id: data.user.id,
            email,
            nama_lengkap: nama,
            universitas,
          };
          setUser(registeredUser);
          localStorage.removeItem('studiringkas_demo_user');
          return { success: true };
        }
      }

      // Fallback local registration
      await new Promise((r) => setTimeout(r, 600));
      const newUser: UserSession = {
        id: `usr-${Date.now()}`,
        email,
        nama_lengkap: nama,
        universitas: universitas || 'Universitas Gadjah Mada',
      };
      setUser(newUser);
      localStorage.setItem('studiringkas_demo_user', JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal mendaftar' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Signout notice:', err);
    } finally {
      localStorage.removeItem('studiringkas_demo_user');
      setUser(null);
      setIsLoading(false);
    }
  };

  const loginAsDemoStudent = () => {
    setUser(DEMO_USER);
    localStorage.setItem('studiringkas_demo_user', JSON.stringify(DEMO_USER));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseConfigured: isConfigured,
        login,
        register,
        logout,
        loginAsDemoStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
