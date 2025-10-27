# Think about lazy loading for some pages

# TODO: get beer from api in loader

# Think about add search string to the URL

у мене є сторінка search і сторінка додавання рейтингу до конкретного пива. Треба подумати як прокидати дані обраного пива

1. брати ще раз ендпоінт з пивами і по id з URL витягувати мені потрібний

## Routing Architecture

This application uses **TanStack Router** with a file-based routing approach for type-safe, declarative routing.

### Route Structure

```
routes/
├── __root.tsx                    # Root layout wrapper
├── index.tsx                     # Home page (/)
├── beer-details/
│   └── $beerId.tsx              # Beer details page (/beer-details/:beerId)
└── rate-beer/
    └── $beerId.tsx              # Rate beer page (/rate-beer/:beerId)
```

```
src/
├── app/ # 🎯 Application Layer
│ ├── providers/
│ │ ├── QueryProvider.tsx # React Query
│ │ ├── AuthProvider.tsx # Authentication state
│ │ ├── NotificationProvider.tsx # Global notification system
│ │ ├── ErrorBoundaryProvider.tsx # Global error boundary wrapper
│ │ └── index.ts # All providers composition
│ ├── router/
│ │ ├── routes.tsx # Route definitions
│ │ ├── auth-guard.tsx # Protected routes
│ │ └── index.ts
│ ├── error-boundaries/ # Only app-level error boundaries
│ │ ├── GlobalErrorBoundary.tsx # Top-level error catcher
│ │ ├── RouteErrorBoundary.tsx # Route-specific errors
│ │ └── index.ts
│ └── main.tsx # App entry point
│
├── shared/ # 🔧 Pure Shared Infrastructure (no business logic)
│ ├── ui/ # Only generic UI components
│ │ ├── primitives/ # Base components
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── input.tsx
│ │ │ ├── form.tsx
│ │ │ ├── modal.tsx
│ │ │ └── ...
│ │ ├── feedback/ # Generic feedback components
│ │ │ ├── toast.tsx # Generic toast
│ │ │ ├── alert.tsx # Generic alert
│ │ │ ├── loading.tsx # Generic loading
│ │ │ ├── error-fallback.tsx # Generic error display
│ │ │ └── index.ts
│ │ └── layout/ # Layout components
│ │ ├── container.tsx
│ │ ├── grid.tsx
│ │ └── index.ts
│ ├── api/ # Base API infrastructure only
│ │ ├── client.ts # Base HTTP client
│ │ ├── types.ts # Generic API types (ApiResponse, etc.)
│ │ └── index.ts
│ ├── lib/ # Pure utilities only
│ │ ├── utils.ts # cn, formatNumber, etc.
│ │ ├── constants.ts # App-wide constants
│ │ ├── validation.ts # Generic validation schemas
│ │ ├── storage.ts # Storage utilities
│ │ └── index.ts
│ ├── hooks/ # Only generic hooks
│ │ ├── useDebounce.ts # Generic debounce
│ │ ├── useLocalStorage.ts # Generic storage
│ │ ├── useToggle.ts # Generic toggle
│ │ └── index.ts
│ └── types/ # Only shared types
│ ├── common.ts # Common app types
│ └── index.ts
│
├── features/ # 🚀 Feature-Complete Modules
│ ├── beer-search/ # 🔍 Complete BeerSearch feature
│ │ │ ├── SearchInput.tsx # Search input component
│ │ │ ├── SearchResults.tsx # Search results list
│ │ │ └── index.ts
│ │ ├── hooks/ # All BeerSearch hooks
│ │ │ ├── useBeerSearch.ts # Main search hook
│ │ │ └── index.ts
│ │ ├── api/ # All BeerSearch API calls
│ │ │ ├── search.api.ts # Search API endpoints
│ │ │ └── index.ts
│ │ ├── types/ # All BeerSearch types
│ │ │ ├── search.types.ts # Search request/response types
│ │ │ └── index.ts
│ │ ├── store/ # BeerSearch state management
│ │ │ ├── searchStore.ts # Search state (Zustand/Context)
│ │ │ └── index.ts
│ │ ├── utils/ # BeerSearch-specific utilities
│ │ │ ├── search-utils.ts # Search processing logic
│ │ │ └── index.ts
│ │ ├── constants/ # BeerSearch constants
│ │ │ ├── search-constants.ts # Search-related constants
│ │ │ └── index.ts
│ │ └── index.ts # Feature export
│ │
│ ├── beer-rating/ # ⭐ Complete BeerRating feature
│ │ ├── components/ # All BeerRating components
│ │ │ ├── StarRating.tsx # Star rating component
│ │ │ ├── RangeRating.tsx # Range rating slider
│ │ │ ├── RatingForm.tsx # Rating submission form
│ │ │ ├── FlavorProfiles.tsx # Flavor profile selection
│ │ │ ├── PresentationStyle.tsx # Presentation style selection
│ │ │ └── index.ts
│ │ ├── hooks/ # All BeerRating hooks
│ │ │ ├── useBeerRating.ts # Main rating hook
│ │ │ ├── useRatingForm.ts # Rating form logic
│ │ │ ├── useRatingValidation.ts # Rating validation
│ │ │ └── index.ts
│ │ ├── api/ # All BeerRating API calls
│ │ │ ├── rating.api.ts # Rating submission API
│ │ │ └── index.ts
│ │ ├── types/ # All BeerRating types
│ │ │ ├── rating.types.ts # Rating data types
│ │ │ └── index.ts
│ │ ├── store/ # BeerRating state
│ │ │ ├── ratingStore.ts # Rating state
│ │ │ └── index.ts
│ │ ├── utils/ # BeerRating utilities
│ │ │ ├── rating-utils.ts # Rating calculations
│ │ │ ├── validation-utils.ts # Rating validation logic
│ │ │ └── index.ts
│ │ ├── constants/ # BeerRating constants
│ │ │ ├── flavor-profiles.ts # Flavor profile data
│ │ │ ├── presentation-styles.ts # Presentation style data
│ │ │ ├── rating-constants.ts # Rating limits, defaults
│ │ │ └── index.ts
│ │ ├── errors/ # BeerRating error handling
│ │ │ ├── RatingErrorBoundary.tsx # Rating error boundary
│ │ │ ├── rating-errors.ts # Rating error types/handlers
│ │ │ └── index.ts
│ │ └── index.ts # Feature export
│ │
│ ├── beer-details/ # 📋 Complete BeerDetails feature
│ │ ├── components/ # All BeerDetails components
│ │ │ ├── BeerCard.tsx # Beer card display
│ │ │ ├── BeerDetails.tsx # Detailed beer info
│ │ │ ├── AboutSection.tsx # Beer description
│ │ │ ├── ImagesSection.tsx # Beer images gallery
│ │ │ ├── RatingSection.tsx # Community ratings
│ │ │ ├── SpecsSection.tsx # Beer specifications
│ │ │ └── index.ts
│ │ ├── hooks/ # All BeerDetails hooks
│ │ │ ├── useBeerDetails.ts # Beer details fetching
│ │ │ ├── useBeerImages.ts # Image gallery logic
│ │ │ ├── useBeerSpecs.ts # Beer specifications
│ │ │ └── index.ts
│ │ ├── api/ # All BeerDetails API calls
│ │ │ ├── beer.api.ts # Beer data API
│ │ │ ├── images.api.ts # Beer images API
│ │ │ └── index.ts
│ │ ├── types/ # All BeerDetails types
│ │ │ ├── beer.types.ts # Beer entity types
│ │ │ ├── image.types.ts # Image types
│ │ │ └── index.ts
│ │ ├── store/ # BeerDetails state
│ │ │ ├── beerStore.ts # Beer data state
│ │ │ └── index.ts
│ │ ├── utils/ # BeerDetails utilities
│ │ │ ├── beer-utils.ts # Beer data processing
│ │ │ ├── image-utils.ts # Image processing
│ │ │ └── index.ts
│ │ ├── errors/ # BeerDetails error handling
│ │ │ ├── DetailsErrorBoundary.tsx # Details error boundary
│ │ │ ├── details-errors.ts # Details error types/handlers
│ │ │ └── index.ts
│ │ └── index.ts # Feature export
│ │
│ ├── user-auth/ # 🔐 Complete Authentication feature
│ │ ├── components/ # All Auth components
│ │ │ ├── LoginForm.tsx # Login form
│ │ │ ├── RegisterForm.tsx # Registration form
│ │ │ ├── AuthModal.tsx # Auth modal
│ │ │ ├── SocialLogin.tsx # Social authentication
│ │ │ ├── ForgotPassword.tsx # Password reset
│ │ │ ├── PasswordReset.tsx # New password form
│ │ │ └── index.ts
│ │ ├── hooks/ # All Auth hooks
│ │ │ ├── useAuth.ts # Main auth hook
│ │ │ ├── useLogin.ts # Login logic
│ │ │ ├── useRegister.ts # Registration logic
│ │ │ ├── usePasswordReset.ts # Password reset logic
│ │ │ ├── useAuthValidation.ts # Auth form validation
│ │ │ └── index.ts
│ │ ├── api/ # All Auth API calls
│ │ │ ├── auth.api.ts # Authentication API
│ │ │ ├── password.api.ts # Password management API
│ │ │ └── index.ts
│ │ ├── types/ # All Auth types
│ │ │ ├── auth.types.ts # Auth data types
│ │ │ ├── user.types.ts # User types
│ │ │ ├── token.types.ts # Token types
│ │ │ └── index.ts
│ │ ├── store/ # Auth state management
│ │ │ ├── authStore.ts # Auth state
│ │ │ ├── userStore.ts # User state
│ │ │ └── index.ts
│ │ ├── utils/ # Auth utilities
│ │ │ ├── auth-utils.ts # Auth helpers
│ │ │ ├── token-utils.ts # Token management
│ │ │ ├── validation-utils.ts # Auth validation
│ │ │ └── index.ts
│ │ ├── constants/ # Auth constants
│ │ │ ├── auth-constants.ts # Auth-related constants
│ │ │ └── index.ts
│ │ ├── errors/ # Auth error handling
│ │ │ ├── AuthErrorBoundary.tsx # Auth error boundary
│ │ │ ├── auth-errors.ts # Auth error types/handlers
│ │ │ └── index.ts
│ │ └── index.ts # Feature export
│ │
│ ├── user-profile/ # 👤 Complete UserProfile feature
│ │ ├── components/ # All Profile components
│ │ │ ├── UserProfile.tsx # Profile display
│ │ │ ├── ProfileForm.tsx # Profile editing
│ │ │ ├── UserAvatar.tsx # Avatar component
│ │ │ ├── UserMenu.tsx # User dropdown menu
│ │ │ ├── UserStats.tsx # User statistics
│ │ │ ├── ChangePassword.tsx # Password change
│ │ │ ├── DeleteAccount.tsx # Account deletion
│ │ │ └── index.ts
│ │ ├── hooks/ # All Profile hooks
│ │ │ ├── useProfile.ts # Profile management
│ │ │ ├── useUserStats.ts # User statistics
│ │ │ ├── useProfileValidation.ts # Profile validation
│ │ │ └── index.ts
│ │ ├── api/ # All Profile API calls
│ │ │ ├── profile.api.ts # Profile API
│ │ │ ├── stats.api.ts # User stats API
│ │ │ └── index.ts
│ │ ├── types/ # All Profile types
│ │ │ ├── profile.types.ts # Profile types
│ │ │ ├── stats.types.ts # Statistics types
│ │ │ └── index.ts
│ │ ├── store/ # Profile state
│ │ │ ├── profileStore.ts # Profile state
│ │ │ └── index.ts
│ │ ├── utils/ # Profile utilities
│ │ │ ├── profile-utils.ts # Profile helpers
│ │ │ ├── stats-utils.ts # Statistics calculations
│ │ │ └── index.ts
│ │ ├── errors/ # Profile error handling
│ │ │ ├── ProfileErrorBoundary.tsx # Profile error boundary
│ │ │ ├── profile-errors.ts # Profile error types/handlers
│ │ │ └── index.ts
│ │ └── index.ts # Feature export
│ │
│ ├── navigation/ # 🧭 Complete Navigation feature
│ │ ├── components/ # All Navigation components
│ │ │ ├── MainTabs.tsx # Main navigation tabs
│ │ │ ├── Header.tsx # App header
│ │ │ ├── Sidebar.tsx # Sidebar navigation
│ │ │ ├── Breadcrumbs.tsx # Breadcrumb navigation
│ │ │ ├── BackButton.tsx # Back navigation
│ │ │ └── index.ts
│ │ ├── hooks/ # All Navigation hooks
│ │ │ ├── useNavigation.ts # Navigation logic
│ │ │ ├── useBreadcrumbs.ts # Breadcrumb logic
│ │ │ └── index.ts
│ │ ├── types/ # All Navigation types
│ │ │ ├── navigation.types.ts # Navigation types
│ │ │ └── index.ts
│ │ ├── utils/ # Navigation utilities
│ │ │ ├── navigation-utils.ts # Navigation helpers
│ │ │ └── index.ts
│ │ ├── constants/ # Navigation constants
│ │ │ ├── routes.ts # Route definitions
│ │ │ └── index.ts
│ │ └── index.ts # Feature export
│ │
│ └── notifications/ # 🔔 Complete Notification feature
│ ├── components/ # All Notification components
│ │ ├── NotificationCenter.tsx # Notification center
│ │ ├── Toast.tsx # Toast notifications
│ │ ├── Alert.tsx # Alert banners
│ │ ├── Snackbar.tsx # Snackbar notifications
│ │ └── index.ts
│ ├── hooks/ # All Notification hooks
│ │ ├── useNotification.ts # Notification management
│ │ ├── useToast.ts # Toast management
│ │ └── index.ts
│ ├── store/ # Notification state
│ │ ├── notificationStore.ts # Notification state
│ │ └── index.ts
│ ├── types/ # All Notification types
│ │ ├── notification.types.ts # Notification types
│ │ └── index.ts
│ ├── utils/ # Notification utilities
│ │ ├── notification-utils.ts # Notification helpers
│ │ └── index.ts
│ └── index.ts # Feature export
│
└── pages/ # 📄 Pure Presentation Layer (orchestration only)
├── HomePage.tsx # Orchestrates: beer-search + navigation
├── BeerDetailsPage.tsx # Orchestrates: beer-details + navigation
├── RateBeerPage.tsx # Orchestrates: beer-search + beer-rating
├── Login
```
