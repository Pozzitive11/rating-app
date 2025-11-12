/**
 * Sanitizes and validates search query input
 * @param query - The search query string
 * @returns Sanitized query string
 * @throws Error if query is invalid
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== "string") {
    throw new Error("Search query must be a non-empty string");
  }

  // Remove any HTML tags and trim whitespace
  const sanitized = query.trim().replace(/<[^>]*>/g, "");

  // Limit query length to prevent abuse
  if (sanitized.length > 100) {
    throw new Error("Search query must be 100 characters or less");
  }

  // Remove potentially dangerous characters but allow normal search terms
  // Allow letters, numbers, spaces, hyphens, and apostrophes
  const cleaned = sanitized.replace(/[^a-zA-Z0-9\s\-']/g, "");

  if (cleaned.length === 0) {
    throw new Error("Search query contains no valid characters");
  }

  return cleaned;
}

/**
 * Validates and sanitizes beer ID
 * @param id - The beer ID (can be string or number)
 * @returns Validated numeric beer ID
 * @throws Error if ID is invalid
 */
export function sanitizeBeerId(id: string | number): number {
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
    throw new Error("Beer ID must be a positive integer");
  }

  // Prevent extremely large IDs (potential DoS)
  if (numericId > Number.MAX_SAFE_INTEGER) {
    throw new Error("Beer ID is too large");
  }

  return numericId;
}

/**
 * Validates and sanitizes page number
 * @param page - The page number
 * @returns Validated page number
 * @throws Error if page is invalid
 */
export function sanitizePageNumber(page: string | number): number {
  const numericPage = typeof page === "string" ? parseInt(page, 10) : page;

  if (isNaN(numericPage) || numericPage < 1 || !Number.isInteger(numericPage)) {
    throw new Error("Page number must be a positive integer");
  }

  // Limit page number to prevent abuse
  if (numericPage > 100) {
    throw new Error("Page number must be 100 or less");
  }

  return numericPage;
}

/**
 * Sanitizes URL to prevent SSRF attacks
 * @param url - The URL to sanitize
 * @param allowedDomain - The allowed domain
 * @returns Sanitized URL
 * @throws Error if URL is invalid or points to disallowed domain
 */
export function sanitizeUrl(url: string, allowedDomain: string): string {
  try {
    const parsedUrl = new URL(url);

    // Ensure URL points to allowed domain
    if (parsedUrl.hostname !== allowedDomain) {
      throw new Error(`URL must point to ${allowedDomain}`);
    }

    // Ensure protocol is https
    if (parsedUrl.protocol !== "https:") {
      throw new Error("URL must use HTTPS protocol");
    }

    return parsedUrl.toString();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid URL format");
    }
    throw error;
  }
}



