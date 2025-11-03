import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { tokenUtils } from "../utils/token.utils";
import { authApi } from "@/api/auth/auth.api";
import { jwtDecode } from "jwt-decode";
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  userId: string | null;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user is logged in on mount
  useEffect(() => {
    setIsAuthenticated(tokenUtils.isAuthenticated());
    setUserId(getUserIdFromToken());
    setIsLoading(false);
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
    setIsAuthenticated(true);
    setUserId(getUserIdFromToken());
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
    setIsAuthenticated(true);
    setUserId(getUserIdFromToken());
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      tokenUtils.clearTokens();
      setIsAuthenticated(false);
      setUserId(null);
    }
  };

  const getUserIdFromToken = (): string | null => {
    const token = tokenUtils.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<{
        sub: string;
        email: string;
      }>(token);
      return decoded.sub;
    } catch {
      return null;
    }
  };

  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    userId,
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
