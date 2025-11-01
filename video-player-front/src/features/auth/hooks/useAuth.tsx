import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { tokenUtils } from "../utils/token.utils";
import { authApi, type User } from "@/api/auth/auth.api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (tokenUtils.isAuthenticated()) {
        try {
          const currentUser =
            await authApi.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          tokenUtils.clearTokens();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({
      email,
      password,
    });
    tokenUtils.setTokens(
      response.accessToken,
      response.refreshToken
    );
    setUser(response.user);
  };

  const register = async (
    email: string,
    password: string
  ) => {
    const response = await authApi.register({
      email,
      password,
    });
    tokenUtils.setTokens(
      response.accessToken,
      response.refreshToken
    );
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenUtils.clearTokens();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }
  return context;
};
