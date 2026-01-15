import { supabase, createAuthenticatedClient } from "../models/supabase";
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
        email: data.user.email || "",
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

    // User is created in auth.users even if session is null (email confirmation required)
    if (!data.user) {
      throw new Error("Registration failed - user not created");
    }

    // Note: User profile in public.users table is automatically created by database trigger
    // (handle_new_user function triggered on auth.users insert)
    // If trigger fails, the auth.users insert would also fail, so we don't need manual insert here

    return {
      user: {
        id: data.user.id,
        email: data.user.email || "",
      },
      accessToken: data.session?.access_token || "",
      refreshToken: data.session?.refresh_token || "",
    };
  }

  async logout(token: string): Promise<void> {
    // Create an authenticated client using the user's token
    const authenticatedClient = createAuthenticatedClient(token);

    // Sign out using the authenticated client (user session)
    const { error } = await authenticatedClient.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser(
    token: string
  ): Promise<{ id: string; email?: string } | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error) throw new Error(error.message);
    return user;
  }
}
