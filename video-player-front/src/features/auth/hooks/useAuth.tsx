import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { tokenUtils } from "../utils/token.utils";
import { authApi, type User } from "@/api/auth/auth.api";
import { jwtDecode } from "jwt-decode";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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
  user: User | null;
  error: Error | null;
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
  const queryClient = useQueryClient();

  // Check if user is logged in on mount
  useEffect(() => {
    setIsAuthenticated(tokenUtils.isAuthenticated());
    setUserId(getUserIdFromToken());
    setIsLoading(false);
  }, []);

  // Query for current user (only runs when authenticated)
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authApi.getCurrentUser(),
    enabled: isAuthenticated,
    retry: false,
  });

  // Update userId when user data is fetched
  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: {
      email: string;
      password: string;
    }) => authApi.login(credentials),
    onSuccess: response => {
      tokenUtils.setTokens(
        response.accessToken,
        response.refreshToken
      );
      setIsAuthenticated(true);
      setUserId(response.user.id);
      // Invalidate and refetch user data
      queryClient.setQueryData(
        ["currentUser"],
        response.user
      );
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: {
      email: string;
      password: string;
    }) => authApi.register(credentials),
    onSuccess: response => {
      tokenUtils.setTokens(
        response.accessToken,
        response.refreshToken
      );
      setIsAuthenticated(true);
      setUserId(response.user.id);
      // Invalidate and refetch user data
      queryClient.setQueryData(
        ["currentUser"],
        response.user
      );
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      tokenUtils.clearTokens();
      setIsAuthenticated(false);
      setUserId(null);
      // Clear user data from cache
      queryClient.removeQueries({
        queryKey: ["currentUser"],
      });
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      tokenUtils.clearTokens();
      setIsAuthenticated(false);
      setUserId(null);
      queryClient.removeQueries({
        queryKey: ["currentUser"],
      });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (
    email: string,
    password: string
  ) => {
    await registerMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
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

  // Combine loading states
  const isLoadingAuth = isLoading || isUserLoading;
  // Get error from mutations or user query
  const error =
    loginMutation.error ||
    registerMutation.error ||
    logoutMutation.error ||
    userError ||
    null;

  const value: AuthContextType = {
    isLoading: isLoadingAuth,
    isAuthenticated,
    login,
    register,
    logout,
    userId,
    user: user || null,
    error:
      error instanceof Error
        ? error
        : error
          ? new Error(String(error))
          : null,
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
