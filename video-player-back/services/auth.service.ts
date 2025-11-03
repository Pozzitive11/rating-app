import { supabase } from "../models/supabase";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error("Authentication failed");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error("Registration failed");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async logout(token: string): Promise<void> {
    // Create admin client for logout
    const { error } = await supabase.auth.admin.signOut(token);
    // Or use user's token
    // const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(token: string) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error) throw new Error(error.message);
    return user;
  }
}
