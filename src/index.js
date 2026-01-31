/**
 * Market Research Agent
 *
 * An AI-powered agent for conducting market research, competitive analysis,
 * and industry trend analysis.
 *
 * @example
 * import { MarketResearchAgent } from 'market-research-agent';
 *
 * const agent = new MarketResearchAgent({ verbose: true });
 *
 * // Research a topic
 * const results = await agent.research('cloud computing market');
 *
 * // Analyze competitors
 * const competitors = await agent.analyzeCompetitors('Acme Corp');
 *
 * // Research industry trends
 * const trends = await agent.researchTrends('healthcare technology');
 *
 * // Comprehensive analysis
 * const analysis = await agent.comprehensiveAnalysis({
 *   company: 'TechStartup',
 *   industry: 'SaaS'
 * });
 *
 * // Generate report
 * const report = await agent.generateReport('markdown');
 */

// Core Agent
export { MarketResearchAgent } from './agent/MarketResearchAgent.js';

// Services
export { WebSearchService } from './services/WebSearchService.js';
export { CompetitorAnalysisService } from './services/CompetitorAnalysisService.js';
export { IndustryTrendsService } from './services/IndustryTrendsService.js';

// Report Generation
export { ReportGenerator } from './reports/ReportGenerator.js';

// Utilities
export * as httpUtils from './utils/http.js';
export * as parserUtils from './utils/parser.js';

// Default export
import { MarketResearchAgent } from './agent/MarketResearchAgent.js';
export default MarketResearchAgent;
