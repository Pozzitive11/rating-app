import { AuthService } from "../services/auth.service";
import { BeerService } from "../services/beer.service";

/**
 * Simple service container implementing singleton pattern.
 *
 * Why it exists:
 * - Controllers can ask for a service without creating new instances everywhere.
 * - Services that manage shared state (Supabase clients, cached config, etc.)
 *   remain singletons across the app lifecycle.
 * - Centralised wiring makes it easier to inject dependencies or swap
 *   implementations (e.g., during testing via the reset() helper).
 */
class ServiceContainer {
  private authService: AuthService | null = null;
  private beerService: BeerService | null = null;

  getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService();
    }
    return this.authService;
  }

  getBeerService(): BeerService {
    if (!this.beerService) {
      this.beerService = new BeerService();
    }
    return this.beerService;
  }

  // Reset services (useful for testing)
  reset(): void {
    this.authService = null;
    this.beerService = null;
  }
}

// Export singleton instance
export const serviceContainer = new ServiceContainer();
