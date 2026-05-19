import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type{ ReactNode} from 'react';
import axios from 'axios';

/* ---------------- TYPES ---------------- */

type User = {
  id: number;
  name: string;
  email: string;
};

type Subscription = {
  id: number;
  user_id: number;
  plan_name: string;
  duration: string;
  price: number;
  start_date: string;
  end_date: string;
  status: string;
};

type SubscriptionStatus = 'none' | 'active' | 'expired';

type AuthContextType = {
  user: User | null;
  subscription: Subscription | null;
  subscriptionStatus: SubscriptionStatus;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  refreshSubscription: () => Promise<void>;
};

/* ---------------- CONTEXT ---------------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>('none');
  const [loading, setLoading] = useState<boolean>(true);

  axios.defaults.baseURL = '/api';

  useEffect(() => {
    const token = localStorage.getItem('wt_token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios
        .get('/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          setSubscription(data.subscription);
          setSubscriptionStatus(data.subscriptionStatus);
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post('/a/auth/login', {
      email,
      password,
    });

    localStorage.setItem('wt_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    setUser(data.user);
    setSubscriptionStatus(data.subscriptionStatus);

    return data;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const { data } = await axios.post('/a/auth/register', {
      name,
      email,
      password,
    });

    localStorage.setItem('wt_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    setUser(data.user);
    setSubscriptionStatus('none');

    return data;
  };

  const logout = () => {
    localStorage.removeItem('wt_token');
    delete axios.defaults.headers.common['Authorization'];

    setUser(null);
    setSubscription(null);
    setSubscriptionStatus('none');
  };

  const refreshSubscription = async () => {
    const { data } = await axios.get('/a/auth/me');

    setSubscription(data.subscription);
    setSubscriptionStatus(data.subscriptionStatus);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        subscriptionStatus,
        loading,
        login,
        register,
        logout,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}