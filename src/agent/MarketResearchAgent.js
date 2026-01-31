/**
 * MarketResearchAgent - An AI-powered agent for market research tasks
 *
 * Capabilities:
 * - Web search for market data
 * - Competitor analysis
 * - Industry trends research
 * - Market sizing and analysis
 * - Report generation
 */

import { WebSearchService } from '../services/WebSearchService.js';
import { CompetitorAnalysisService } from '../services/CompetitorAnalysisService.js';
import { IndustryTrendsService } from '../services/IndustryTrendsService.js';
import { ReportGenerator } from '../reports/ReportGenerator.js';

export class MarketResearchAgent {
  constructor(options = {}) {
    this.name = options.name || 'MarketResearchAgent';
    this.verbose = options.verbose || false;

    // Initialize services
    this.webSearch = new WebSearchService(options);
    this.competitorAnalysis = new CompetitorAnalysisService(options);
    this.industryTrends = new IndustryTrendsService(options);
    this.reportGenerator = new ReportGenerator(options);

    // Research context
    this.context = {
      industry: null,
      company: null,
      competitors: [],
      findings: [],
      timestamp: null
    };
  }

  /**
   * Log messages when verbose mode is enabled
   */
  log(message) {
    if (this.verbose) {
      console.log(`[${this.name}] ${message}`);
    }
  }

  /**
   * Initialize a new research session
   */
  initSession(params = {}) {
    this.context = {
      industry: params.industry || null,
      company: params.company || null,
      competitors: params.competitors || [],
      findings: [],
      timestamp: new Date().toISOString()
    };
    this.log(`Session initialized for ${params.industry || 'general'} research`);
    return this.context;
  }

  /**
   * Execute a market research query
   */
  async research(query, options = {}) {
    this.log(`Researching: ${query}`);

    const results = await this.webSearch.search(query, options);

    const finding = {
      query,
      results,
      timestamp: new Date().toISOString(),
      type: 'general'
    };

    this.context.findings.push(finding);
    return results;
  }

  /**
   * Analyze competitors for a given company/product
   */
  async analyzeCompetitors(company, options = {}) {
    this.log(`Analyzing competitors for: ${company}`);
    this.context.company = company;

    const analysis = await this.competitorAnalysis.analyze(company, options);

    this.context.competitors = analysis.competitors;
    this.context.findings.push({
      type: 'competitor_analysis',
      company,
      analysis,
      timestamp: new Date().toISOString()
    });

    return analysis;
  }

  /**
   * Research industry trends
   */
  async researchTrends(industry, options = {}) {
    this.log(`Researching trends for: ${industry}`);
    this.context.industry = industry;

    const trends = await this.industryTrends.analyze(industry, options);

    this.context.findings.push({
      type: 'industry_trends',
      industry,
      trends,
      timestamp: new Date().toISOString()
    });

    return trends;
  }

  /**
   * Perform market sizing analysis
   */
  async analyzeMarketSize(market, options = {}) {
    this.log(`Analyzing market size for: ${market}`);

    const queries = [
      `${market} market size 2024`,
      `${market} market growth rate`,
      `${market} total addressable market TAM`,
      `${market} market forecast`
    ];

    const results = [];
    for (const query of queries) {
      const searchResults = await this.webSearch.search(query, options);
      results.push({ query, data: searchResults });
    }

    const analysis = {
      market,
      data: results,
      summary: this.summarizeMarketSize(results),
      timestamp: new Date().toISOString()
    };

    this.context.findings.push({
      type: 'market_sizing',
      market,
      analysis,
      timestamp: new Date().toISOString()
    });

    return analysis;
  }

  /**
   * Summarize market size data
   */
  summarizeMarketSize(results) {
    const summary = {
      dataPoints: results.length,
      sources: results.flatMap(r => r.data.sources || []),
      insights: []
    };

    for (const result of results) {
      if (result.data.insights) {
        summary.insights.push(...result.data.insights);
      }
    }

    return summary;
  }

  /**
   * Perform a comprehensive market analysis
   */
  async comprehensiveAnalysis(params) {
    const { company, industry, includeCompetitors = true, includeTrends = true, includeMarketSize = true } = params;

    this.initSession({ company, industry });
    this.log('Starting comprehensive market analysis');

    const results = {
      company,
      industry,
      timestamp: new Date().toISOString()
    };

    // Run analyses
    if (includeCompetitors && company) {
      results.competitors = await this.analyzeCompetitors(company);
    }

    if (includeTrends && industry) {
      results.trends = await this.researchTrends(industry);
    }

    if (includeMarketSize && industry) {
      results.marketSize = await this.analyzeMarketSize(industry);
    }

    results.summary = this.generateSummary(results);

    return results;
  }

  /**
   * Generate a summary of findings
   */
  generateSummary(results) {
    const summary = {
      totalFindings: this.context.findings.length,
      competitorsIdentified: this.context.competitors.length,
      keyInsights: []
    };

    // Extract key insights from each analysis type
    if (results.competitors?.insights) {
      summary.keyInsights.push(...results.competitors.insights);
    }

    if (results.trends?.insights) {
      summary.keyInsights.push(...results.trends.insights);
    }

    if (results.marketSize?.summary?.insights) {
      summary.keyInsights.push(...results.marketSize.summary.insights);
    }

    return summary;
  }

  /**
   * Generate a report from the current research session
   */
  async generateReport(format = 'markdown') {
    this.log(`Generating ${format} report`);

    const report = await this.reportGenerator.generate({
      context: this.context,
      format
    });

    return report;
  }

  /**
   * Export current research data
   */
  exportData(format = 'json') {
    const data = {
      agent: this.name,
      context: this.context,
      exportedAt: new Date().toISOString()
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    }

    return data;
  }

  /**
   * Clear the current research session
   */
  clearSession() {
    this.context = {
      industry: null,
      company: null,
      competitors: [],
      findings: [],
      timestamp: null
    };
    this.log('Session cleared');
  }
}

export default MarketResearchAgent;
