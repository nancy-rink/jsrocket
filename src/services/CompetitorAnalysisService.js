/**
 * CompetitorAnalysisService - Analyzes competitors for a given company or market
 *
 * Provides functionality to:
 * - Identify competitors in a market
 * - Analyze competitor strengths and weaknesses
 * - Compare market positioning
 * - Track competitor activities
 */

import { WebSearchService } from './WebSearchService.js';

export class CompetitorAnalysisService {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.webSearch = new WebSearchService(options);

    // Competitor database (mock data for demonstration)
    this.competitorDatabase = new Map();
  }

  /**
   * Log messages when verbose mode is enabled
   */
  log(message) {
    if (this.verbose) {
      console.log(`[CompetitorAnalysisService] ${message}`);
    }
  }

  /**
   * Analyze competitors for a given company
   */
  async analyze(company, options = {}) {
    this.log(`Starting competitor analysis for: ${company}`);

    // Search for competitors
    const competitorSearch = await this.searchCompetitors(company);

    // Identify and rank competitors
    const competitors = await this.identifyCompetitors(company, competitorSearch);

    // Analyze each competitor
    const analyses = await this.analyzeCompetitorList(competitors, options);

    // Generate competitive landscape
    const landscape = this.generateCompetitiveLandscape(company, analyses);

    // Generate insights
    const insights = this.generateInsights(company, analyses, landscape);

    return {
      company,
      competitors,
      analyses,
      landscape,
      insights,
      analyzedAt: new Date().toISOString()
    };
  }

  /**
   * Search for competitors of a company
   */
  async searchCompetitors(company) {
    const queries = [
      `${company} competitors`,
      `${company} alternatives`,
      `companies like ${company}`,
      `${company} vs`
    ];

    const results = [];
    for (const query of queries) {
      const searchResults = await this.webSearch.search(query, { maxResults: 5 });
      results.push({ query, data: searchResults });
    }

    return results;
  }

  /**
   * Identify competitors from search results
   */
  async identifyCompetitors(company, searchResults) {
    // Extract potential competitor names from search results
    const potentialCompetitors = new Set();

    // Common competitor patterns (simulated extraction)
    const mockCompetitors = this.generateMockCompetitors(company);

    for (const competitor of mockCompetitors) {
      potentialCompetitors.add(competitor);
    }

    // Convert to array with metadata
    const competitors = Array.from(potentialCompetitors).map((name, index) => ({
      id: `competitor-${index + 1}`,
      name,
      relevanceScore: 0.95 - (index * 0.1),
      identifiedFrom: 'search_results'
    }));

    // Sort by relevance
    competitors.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return competitors.slice(0, 10); // Return top 10
  }

  /**
   * Generate mock competitors for demonstration
   */
  generateMockCompetitors(company) {
    // Simulated competitor lists based on company patterns
    const competitorPatterns = {
      tech: ['TechCorp', 'InnovateSoft', 'DataPrime', 'CloudFirst', 'NextGen Solutions'],
      retail: ['MegaMart', 'ShopEasy', 'QuickBuy', 'ValueStore', 'PrimeShop'],
      finance: ['FinanceHub', 'MoneyWise', 'WealthMax', 'CapitalOne', 'TrustBank'],
      healthcare: ['HealthFirst', 'MedCare Plus', 'WellnessHub', 'CarePoint', 'MedTech']
    };

    // Return generic competitors if company pattern not recognized
    return [
      `${company} Competitor A`,
      `${company} Competitor B`,
      `${company} Competitor C`,
      `${company} Competitor D`,
      `${company} Competitor E`
    ];
  }

  /**
   * Analyze a list of competitors
   */
  async analyzeCompetitorList(competitors, options = {}) {
    const analyses = [];

    for (const competitor of competitors) {
      const analysis = await this.analyzeIndividualCompetitor(competitor, options);
      analyses.push(analysis);
    }

    return analyses;
  }

  /**
   * Analyze an individual competitor
   */
  async analyzeIndividualCompetitor(competitor, options = {}) {
    this.log(`Analyzing competitor: ${competitor.name}`);

    // Generate mock analysis (in production, this would fetch real data)
    const analysis = {
      competitor: competitor.name,
      id: competitor.id,
      profile: this.generateCompetitorProfile(competitor),
      strengths: this.identifyStrengths(competitor),
      weaknesses: this.identifyWeaknesses(competitor),
      marketPosition: this.assessMarketPosition(competitor),
      recentActivity: await this.getRecentActivity(competitor),
      analyzedAt: new Date().toISOString()
    };

    // Cache the analysis
    this.competitorDatabase.set(competitor.id, analysis);

    return analysis;
  }

  /**
   * Generate a competitor profile
   */
  generateCompetitorProfile(competitor) {
    return {
      name: competitor.name,
      description: `${competitor.name} is a competitor operating in the same market space.`,
      founded: this.randomYear(2000, 2020),
      headquarters: 'United States',
      employees: this.randomRange(50, 10000),
      estimatedRevenue: `$${this.randomRange(1, 500)}M`,
      website: `https://www.${competitor.name.toLowerCase().replace(/\s+/g, '')}.com`,
      socialPresence: {
        twitter: true,
        linkedin: true,
        facebook: true
      }
    };
  }

  /**
   * Identify competitor strengths
   */
  identifyStrengths(competitor) {
    const allStrengths = [
      'Strong brand recognition',
      'Large customer base',
      'Innovative product features',
      'Competitive pricing',
      'Excellent customer service',
      'Strong technical team',
      'Wide distribution network',
      'Strategic partnerships',
      'Strong financial backing',
      'First mover advantage'
    ];

    // Return 3-5 random strengths
    const count = this.randomRange(3, 5);
    return this.shuffleArray(allStrengths).slice(0, count);
  }

  /**
   * Identify competitor weaknesses
   */
  identifyWeaknesses(competitor) {
    const allWeaknesses = [
      'Limited market presence',
      'Higher pricing',
      'Complex user interface',
      'Limited customer support',
      'Slower innovation cycle',
      'Technical debt',
      'Limited integrations',
      'Geographic restrictions',
      'Scalability challenges',
      'Resource constraints'
    ];

    // Return 2-4 random weaknesses
    const count = this.randomRange(2, 4);
    return this.shuffleArray(allWeaknesses).slice(0, count);
  }

  /**
   * Assess market position
   */
  assessMarketPosition(competitor) {
    const positions = ['Leader', 'Challenger', 'Follower', 'Niche Player'];
    const position = positions[Math.floor(Math.random() * positions.length)];

    return {
      category: position,
      marketShare: `${this.randomRange(1, 30)}%`,
      growthRate: `${this.randomRange(-5, 25)}%`,
      customerSegments: this.identifyCustomerSegments(),
      competitiveAdvantage: this.identifyCompetitiveAdvantage()
    };
  }

  /**
   * Identify customer segments
   */
  identifyCustomerSegments() {
    const segments = [
      'Enterprise',
      'Mid-Market',
      'Small Business',
      'Startups',
      'Consumers',
      'Government'
    ];
    const count = this.randomRange(1, 3);
    return this.shuffleArray(segments).slice(0, count);
  }

  /**
   * Identify competitive advantage
   */
  identifyCompetitiveAdvantage() {
    const advantages = [
      'Technology',
      'Price',
      'Brand',
      'Distribution',
      'Customer Experience',
      'Innovation'
    ];
    return advantages[Math.floor(Math.random() * advantages.length)];
  }

  /**
   * Get recent activity for a competitor
   */
  async getRecentActivity(competitor) {
    // Simulated recent activity
    return [
      {
        type: 'product_launch',
        title: `${competitor.name} launches new product feature`,
        date: this.recentDate(30)
      },
      {
        type: 'funding',
        title: `${competitor.name} raises funding round`,
        date: this.recentDate(90)
      },
      {
        type: 'partnership',
        title: `${competitor.name} announces strategic partnership`,
        date: this.recentDate(60)
      }
    ];
  }

  /**
   * Generate competitive landscape
   */
  generateCompetitiveLandscape(company, analyses) {
    const landscape = {
      company,
      totalCompetitors: analyses.length,
      marketLeaders: [],
      challengers: [],
      followers: [],
      nichePlayers: [],
      competitiveIntensity: 'High',
      marketMaturity: 'Growing'
    };

    // Categorize competitors by position
    for (const analysis of analyses) {
      const position = analysis.marketPosition.category;
      switch (position) {
        case 'Leader':
          landscape.marketLeaders.push(analysis.competitor);
          break;
        case 'Challenger':
          landscape.challengers.push(analysis.competitor);
          break;
        case 'Follower':
          landscape.followers.push(analysis.competitor);
          break;
        case 'Niche Player':
          landscape.nichePlayers.push(analysis.competitor);
          break;
      }
    }

    return landscape;
  }

  /**
   * Generate insights from competitor analysis
   */
  generateInsights(company, analyses, landscape) {
    const insights = [];

    // Market concentration insight
    if (landscape.marketLeaders.length > 0) {
      insights.push({
        type: 'market_structure',
        title: 'Market Leadership',
        description: `The market has ${landscape.marketLeaders.length} clear leader(s): ${landscape.marketLeaders.join(', ')}.`,
        importance: 'high'
      });
    }

    // Competitive intensity insight
    insights.push({
      type: 'competitive_intensity',
      title: 'Competitive Landscape',
      description: `Identified ${landscape.totalCompetitors} competitors with ${landscape.competitiveIntensity.toLowerCase()} competitive intensity.`,
      importance: 'high'
    });

    // Opportunity insight
    if (landscape.nichePlayers.length < landscape.totalCompetitors / 2) {
      insights.push({
        type: 'opportunity',
        title: 'Niche Opportunity',
        description: 'There may be opportunities to differentiate in underserved market segments.',
        importance: 'medium'
      });
    }

    // Strength-based insights
    const commonStrengths = this.findCommonStrengths(analyses);
    if (commonStrengths.length > 0) {
      insights.push({
        type: 'competitive_parity',
        title: 'Common Competitive Factors',
        description: `Most competitors share these strengths: ${commonStrengths.slice(0, 3).join(', ')}.`,
        importance: 'medium'
      });
    }

    return insights;
  }

  /**
   * Find common strengths among competitors
   */
  findCommonStrengths(analyses) {
    const strengthCounts = {};

    for (const analysis of analyses) {
      for (const strength of analysis.strengths) {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1;
      }
    }

    // Return strengths that appear in more than half of competitors
    const threshold = analyses.length / 2;
    return Object.entries(strengthCounts)
      .filter(([, count]) => count >= threshold)
      .map(([strength]) => strength);
  }

  /**
   * Compare two competitors
   */
  async compareCompetitors(competitor1, competitor2) {
    const analysis1 = this.competitorDatabase.get(competitor1) ||
      await this.analyzeIndividualCompetitor({ name: competitor1, id: 'temp-1' });
    const analysis2 = this.competitorDatabase.get(competitor2) ||
      await this.analyzeIndividualCompetitor({ name: competitor2, id: 'temp-2' });

    return {
      competitors: [competitor1, competitor2],
      comparison: {
        strengths: {
          [competitor1]: analysis1.strengths,
          [competitor2]: analysis2.strengths
        },
        weaknesses: {
          [competitor1]: analysis1.weaknesses,
          [competitor2]: analysis2.weaknesses
        },
        marketPosition: {
          [competitor1]: analysis1.marketPosition,
          [competitor2]: analysis2.marketPosition
        }
      },
      recommendation: this.generateComparisonRecommendation(analysis1, analysis2)
    };
  }

  /**
   * Generate comparison recommendation
   */
  generateComparisonRecommendation(analysis1, analysis2) {
    const recommendations = [];

    // Compare market positions
    if (analysis1.marketPosition.category !== analysis2.marketPosition.category) {
      recommendations.push(`${analysis1.competitor} holds a ${analysis1.marketPosition.category} position while ${analysis2.competitor} is a ${analysis2.marketPosition.category}.`);
    }

    // Identify unique strengths
    const uniqueStrengths1 = analysis1.strengths.filter(s => !analysis2.strengths.includes(s));
    const uniqueStrengths2 = analysis2.strengths.filter(s => !analysis1.strengths.includes(s));

    if (uniqueStrengths1.length > 0) {
      recommendations.push(`${analysis1.competitor} uniquely offers: ${uniqueStrengths1.join(', ')}.`);
    }

    if (uniqueStrengths2.length > 0) {
      recommendations.push(`${analysis2.competitor} uniquely offers: ${uniqueStrengths2.join(', ')}.`);
    }

    return recommendations;
  }

  // Utility functions
  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomYear(min, max) {
    return this.randomRange(min, max);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  recentDate(withinDays) {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * withinDays);
    now.setDate(now.getDate() - daysAgo);
    return now.toISOString().split('T')[0];
  }
}

export default CompetitorAnalysisService;
