const API_BASE_URL = "http://localhost:5000/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export const authApi = {
  login: async (
    credentials: LoginRequest
  ): Promise<AuthResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  },

  register: async (
    userData: RegisterRequest
  ): Promise<AuthResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.message || "Registration failed"
      );
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${API_BASE_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${API_BASE_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get current user");
    }

    const data = await response.json();
    return data.user;
  },
};
