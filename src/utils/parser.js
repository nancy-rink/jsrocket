/**
 * Parsing utility functions for extracting and processing data
 */

/**
 * Parse search results from raw response
 */
export function parseSearchResults(rawResults) {
  if (!rawResults || !Array.isArray(rawResults.items)) {
    return {
      items: [],
      totalResults: 0,
      parseError: 'Invalid results format'
    };
  }

  const items = rawResults.items.map(item => ({
    title: cleanText(item.title || ''),
    snippet: cleanText(item.snippet || ''),
    url: item.url || item.link || '',
    publishedDate: item.publishedDate || item.date || null,
    source: item.source || null
  }));

  return {
    items,
    totalResults: items.length,
    parsedAt: new Date().toISOString()
  };
}

/**
 * Extract key phrases from text
 */
export function extractKeyPhrases(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Clean the text
  const cleaned = cleanText(text);

  // Split into words
  const words = cleaned.toLowerCase().split(/\s+/);

  // Remove common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'that', 'which', 'who',
    'whom', 'this', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
    'what', 'how', 'when', 'where', 'why', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
    'same', 'so', 'than', 'too', 'very', 'just', 'can', 'about', 'into'
  ]);

  const filtered = words.filter(word =>
    word.length > 2 && !stopWords.has(word) && /^[a-z]+$/.test(word)
  );

  // Count word frequencies
  const wordCounts = {};
  for (const word of filtered) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  // Sort by frequency and return top phrases
  const sorted = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return sorted;
}

/**
 * Clean and normalize text
 */
export function cleanText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
    .trim();
}

/**
 * Extract numbers and metrics from text
 */
export function extractMetrics(text) {
  const metrics = [];

  // Match currency values
  const currencyPattern = /\$[\d,.]+[BMK]?(?:\s*(?:billion|million|thousand))?/gi;
  const currencies = text.match(currencyPattern) || [];
  for (const match of currencies) {
    metrics.push({ type: 'currency', value: match, raw: match });
  }

  // Match percentages
  const percentPattern = /[\d.]+%/g;
  const percentages = text.match(percentPattern) || [];
  for (const match of percentages) {
    metrics.push({ type: 'percentage', value: parseFloat(match), raw: match });
  }

  // Match years
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const years = text.match(yearPattern) || [];
  for (const match of years) {
    metrics.push({ type: 'year', value: parseInt(match), raw: match });
  }

  // Match growth rates (e.g., "CAGR of 15%")
  const cagrPattern = /CAGR\s*(?:of\s*)?[\d.]+%/gi;
  const cagrs = text.match(cagrPattern) || [];
  for (const match of cagrs) {
    metrics.push({ type: 'cagr', value: match, raw: match });
  }

  return metrics;
}

/**
 * Extract company names from text (simplified heuristic)
 */
export function extractCompanyNames(text) {
  // Match patterns that look like company names
  // (Capitalized words followed by common suffixes or standalone)
  const patterns = [
    /[A-Z][a-zA-Z]+(?:\s+(?:Inc|Corp|LLC|Ltd|Company|Co|Group|Technologies|Solutions|Systems|Software|Services))?\.?/g
  ];

  const companies = new Set();

  for (const pattern of patterns) {
    const matches = text.match(pattern) || [];
    for (const match of matches) {
      if (match.length > 2 && !isCommonWord(match)) {
        companies.add(match.trim());
      }
    }
  }

  return Array.from(companies);
}

/**
 * Check if a word is a common word (not likely a company name)
 */
function isCommonWord(word) {
  const commonWords = new Set([
    'The', 'This', 'That', 'These', 'Those', 'Their', 'There',
    'When', 'Where', 'What', 'Which', 'While', 'With', 'Would',
    'Could', 'Should', 'About', 'After', 'Before', 'Between',
    'Through', 'During', 'Under', 'Over', 'Above', 'Below'
  ]);

  return commonWords.has(word);
}

/**
 * Parse date strings into Date objects
 */
export function parseDate(dateString) {
  if (!dateString) {
    return null;
  }

  // Try parsing as ISO date
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  // Try common date formats
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/DD/YYYY
    /^(\d{4})-(\d{2})-(\d{2})$/,        // YYYY-MM-DD
    /^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/   // Month DD, YYYY
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      const parsed = new Date(dateString);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  return null;
}

/**
 * Summarize text to a specified length
 */
export function summarizeText(text, maxLength = 200) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }

  // Try to cut at a sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );

  if (lastSentenceEnd > maxLength * 0.5) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }

  // Otherwise, cut at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

export default {
  parseSearchResults,
  extractKeyPhrases,
  cleanText,
  extractMetrics,
  extractCompanyNames,
  parseDate,
  summarizeText
};
