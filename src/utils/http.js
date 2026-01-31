/**
 * HTTP utility functions for web requests
 */

/**
 * Fetch content from a URL
 */
export async function fetchUrl(url, options = {}) {
  const { timeout = 10000, headers = {} } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MarketResearchAgent/1.0',
        ...headers
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

/**
 * Extract domain from a URL
 */
export function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Retry a fetch operation with exponential backoff
 */
export async function fetchWithRetry(url, options = {}, retries = 3) {
  const { delay = 1000, backoffMultiplier = 2 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchUrl(url, options);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      const waitTime = delay * Math.pow(backoffMultiplier, attempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

export default {
  fetchUrl,
  extractDomain,
  isValidUrl,
  buildQueryString,
  fetchWithRetry
};
