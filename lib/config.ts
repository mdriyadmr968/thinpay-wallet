/**
 * ThinPay Wallet Centralized Configuration
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://127.0.0.1:5000";

export const API_V1_URL = `${API_BASE_URL}/api/v1`;

export const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || `${API_BASE_URL}/graphql`;

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath.startsWith("/api/v1")) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  return `${API_V1_URL}${cleanPath}`;
}
