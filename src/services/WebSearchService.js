/**
 * WebSearchService - Handles web search operations for market research
 *
 * This service provides methods for searching the web and extracting
 * relevant market data from search results.
 */

import { fetchUrl, extractDomain } from '../utils/http.js';
import { parseSearchResults, extractKeyPhrases } from '../utils/parser.js';

export class WebSearchService {
  constructor(options = {}) {
    this.maxResults = options.maxResults || 10;
    this.timeout = options.timeout || 10000;
    this.verbose = options.verbose || false;
    this.cache = new Map();
    this.cacheExpiry = options.cacheExpiry || 300000; // 5 minutes
  }

  /**
   * Log messages when verbose mode is enabled
   */
  log(message) {
    if (this.verbose) {
      console.log(`[WebSearchService] ${message}`);
    }
  }

  /**
   * Generate cache key for a search query
   */
  getCacheKey(query, options) {
    return `${query}:${JSON.stringify(options)}`;
  }

  /**
   * Check if cached result is still valid
   */
  isCacheValid(cacheEntry) {
    return cacheEntry && (Date.now() - cacheEntry.timestamp) < this.cacheExpiry;
  }

  /**
   * Perform a web search
   */
  async search(query, options = {}) {
    const cacheKey = this.getCacheKey(query, options);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (this.isCacheValid(cached)) {
      this.log(`Cache hit for: ${query}`);
      return cached.data;
    }

    this.log(`Searching: ${query}`);

    // Build search parameters
    const searchParams = {
      query,
      maxResults: options.maxResults || this.maxResults,
      filters: options.filters || {},
      dateRange: options.dateRange || null
    };

    // Perform the search
    const rawResults = await this.executeSearch(searchParams);

    // Process and enrich results
    const processedResults = await this.processResults(rawResults, options);

    // Cache the results
    this.cache.set(cacheKey, {
      data: processedResults,
      timestamp: Date.now()
    });

    return processedResults;
  }

  /**
   * Execute the actual search operation
   */
  async executeSearch(params) {
    // Simulated search results for demonstration
    // In production, this would integrate with actual search APIs
    const mockResults = this.generateMockResults(params.query, params.maxResults);

    return {
      query: params.query,
      totalResults: mockResults.length,
      items: mockResults,
      searchedAt: new Date().toISOString()
    };
  }

  /**
   * Generate mock search results for demonstration
   */
  generateMockResults(query, count) {
    const keywords = extractKeyPhrases(query);
    const results = [];

    const resultTemplates = [
      {
        titleTemplate: '{keyword} Market Analysis Report 2024',
        snippetTemplate: 'Comprehensive analysis of the {keyword} market including size, growth trends, and key players...',
        type: 'report'
      },
      {
        titleTemplate: '{keyword} Industry Trends and Forecast',
        snippetTemplate: 'Latest trends in {keyword} sector with forecasts for the next 5 years...',
        type: 'trends'
      },
      {
        titleTemplate: 'Top Companies in {keyword} Space',
        snippetTemplate: 'Overview of leading companies operating in the {keyword} market...',
        type: 'competitors'
      },
      {
        titleTemplate: '{keyword} Market Size and Growth Rate',
        snippetTemplate: 'The global {keyword} market is valued at $X billion with a CAGR of Y%...',
        type: 'sizing'
      },
      {
        titleTemplate: '{keyword} Consumer Behavior Study',
        snippetTemplate: 'Research findings on consumer preferences and behavior in {keyword}...',
        type: 'consumer'
      }
    ];

    for (let i = 0; i < Math.min(count, resultTemplates.length * 2); i++) {
      const template = resultTemplates[i % resultTemplates.length];
      const keyword = keywords[i % keywords.length] || query;

      results.push({
        id: `result-${i + 1}`,
        title: template.titleTemplate.replace('{keyword}', keyword),
        snippet: template.snippetTemplate.replace('{keyword}', keyword),
        url: `https://example.com/research/${keyword.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
        type: template.type,
        relevanceScore: 0.95 - (i * 0.05),
        publishedDate: this.generateRandomDate()
      });
    }

    return results;
  }

  /**
   * Generate a random date within the last year
   */
  generateRandomDate() {
    const now = Date.now();
    const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
    const randomTime = oneYearAgo + Math.random() * (now - oneYearAgo);
    return new Date(randomTime).toISOString().split('T')[0];
  }

  /**
   * Process and enrich search results
   */
  async processResults(rawResults, options) {
    const { items, ...metadata } = rawResults;

    const processedItems = items.map(item => ({
      ...item,
      domain: extractDomain(item.url),
      keywords: extractKeyPhrases(item.title + ' ' + item.snippet)
    }));

    // Filter by relevance if threshold specified
    const filteredItems = options.relevanceThreshold
      ? processedItems.filter(item => item.relevanceScore >= options.relevanceThreshold)
      : processedItems;

    // Sort by relevance
    filteredItems.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      ...metadata,
      items: filteredItems,
      sources: [...new Set(filteredItems.map(item => item.domain))],
      insights: this.extractInsights(filteredItems)
    };
  }

  /**
   * Extract insights from search results
   */
  extractInsights(items) {
    const insights = [];

    // Group by type
    const typeGroups = {};
    for (const item of items) {
      if (!typeGroups[item.type]) {
        typeGroups[item.type] = [];
      }
      typeGroups[item.type].push(item);
    }

    // Generate insights based on groups
    for (const [type, groupItems] of Object.entries(typeGroups)) {
      if (groupItems.length > 0) {
        insights.push({
          type,
          count: groupItems.length,
          summary: `Found ${groupItems.length} ${type} related results`
        });
      }
    }

    return insights;
  }

  /**
   * Search for specific topics with specialized queries
   */
  async searchTopic(topic, category, options = {}) {
    const categoryQueries = {
      marketSize: [`${topic} market size`, `${topic} TAM SAM SOM`, `${topic} market valuation`],
      competitors: [`${topic} competitors`, `${topic} market leaders`, `top companies in ${topic}`],
      trends: [`${topic} trends 2024`, `${topic} emerging trends`, `future of ${topic}`],
      news: [`${topic} news`, `${topic} latest updates`, `${topic} announcements`]
    };

    const queries = categoryQueries[category] || [`${topic} ${category}`];
    const allResults = [];

    for (const query of queries) {
      const results = await this.search(query, options);
      allResults.push({
        query,
        results
      });
    }

    return {
      topic,
      category,
      searchResults: allResults,
      combinedInsights: this.combineInsights(allResults)
    };
  }

  /**
   * Combine insights from multiple searches
   */
  combineInsights(searchResults) {
    const allInsights = [];

    for (const { results } of searchResults) {
      if (results.insights) {
        allInsights.push(...results.insights);
      }
    }

    return allInsights;
  }

  /**
   * Clear the search cache
   */
  clearCache() {
    this.cache.clear();
    this.log('Cache cleared');
  }
}

export default WebSearchService;
