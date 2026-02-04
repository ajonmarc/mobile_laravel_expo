// src/types/api.ts

/**
 * Common shapes for API responses & errors
 * (especially Laravel Sanctum / typical JSON:API style)
 */

// ── Successful responses ──
//types/api.ts
export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  // user?: User;   // sometimes included here, sometimes fetched separately via /me
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  // Add any custom fields your app uses (role, avatar_url, etc.)
}

// ── Error responses ──

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  // status?: number;           // sometimes included
  // code?: string | number;
}

// Most common Laravel validation error (422)
export interface LaravelValidationError extends ApiErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

// 401 unauthorized (wrong credentials)
export interface UnauthorizedError {
  message: string;
  // usually just "Unauthenticated." or "Invalid credentials"
}

// ── Optional: Axios error with better typing ──

export type ApiError = Error & {
  response?: {
    status: number;
    data: ApiErrorResponse | LaravelValidationError | UnauthorizedError | any;
    headers?: any;
  };
  request?: any;
  config?: any;
};