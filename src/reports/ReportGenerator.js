/**
 * ReportGenerator - Generates market research reports in various formats
 *
 * Supports:
 * - Markdown reports
 * - JSON data export
 * - Executive summaries
 * - Detailed analysis reports
 */

export class ReportGenerator {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.defaultFormat = options.defaultFormat || 'markdown';
  }

  /**
   * Log messages when verbose mode is enabled
   */
  log(message) {
    if (this.verbose) {
      console.log(`[ReportGenerator] ${message}`);
    }
  }

  /**
   * Generate a report from research context
   */
  async generate(params) {
    const { context, format = this.defaultFormat, options = {} } = params;

    this.log(`Generating ${format} report`);

    switch (format.toLowerCase()) {
      case 'markdown':
      case 'md':
        return this.generateMarkdownReport(context, options);
      case 'json':
        return this.generateJsonReport(context, options);
      case 'executive':
        return this.generateExecutiveSummary(context, options);
      case 'detailed':
        return this.generateDetailedReport(context, options);
      default:
        return this.generateMarkdownReport(context, options);
    }
  }

  /**
   * Generate a Markdown format report
   */
  generateMarkdownReport(context, options = {}) {
    const sections = [];

    // Title
    sections.push(this.generateTitle(context));

    // Executive Summary
    sections.push(this.generateExecutiveSection(context));

    // Industry Analysis (if available)
    if (context.industry) {
      sections.push(this.generateIndustrySection(context));
    }

    // Company Analysis (if available)
    if (context.company) {
      sections.push(this.generateCompanySection(context));
    }

    // Competitor Analysis (if available)
    if (context.competitors && context.competitors.length > 0) {
      sections.push(this.generateCompetitorSection(context));
    }

    // Key Findings
    if (context.findings && context.findings.length > 0) {
      sections.push(this.generateFindingsSection(context));
    }

    // Recommendations
    sections.push(this.generateRecommendationsSection(context));

    // Appendix
    if (options.includeAppendix) {
      sections.push(this.generateAppendix(context));
    }

    return {
      format: 'markdown',
      content: sections.join('\n\n'),
      generatedAt: new Date().toISOString(),
      wordCount: this.countWords(sections.join(' '))
    };
  }

  /**
   * Generate report title section
   */
  generateTitle(context) {
    const title = context.company
      ? `Market Research Report: ${context.company}`
      : context.industry
        ? `${context.industry} Industry Analysis`
        : 'Market Research Report';

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `# ${title}\n\n**Report Date:** ${date}\n\n---`;
  }

  /**
   * Generate executive summary section
   */
  generateExecutiveSection(context) {
    const lines = [
      '## Executive Summary',
      ''
    ];

    // Add key metrics
    lines.push('### Key Metrics');
    lines.push('');
    lines.push(`- **Research Scope:** ${context.industry || 'General Market'}`);
    lines.push(`- **Primary Company:** ${context.company || 'N/A'}`);
    lines.push(`- **Competitors Analyzed:** ${context.competitors?.length || 0}`);
    lines.push(`- **Total Findings:** ${context.findings?.length || 0}`);
    lines.push('');

    // Add summary if available
    if (context.findings && context.findings.length > 0) {
      lines.push('### Summary');
      lines.push('');
      lines.push(this.generateOverviewParagraph(context));
    }

    return lines.join('\n');
  }

  /**
   * Generate overview paragraph
   */
  generateOverviewParagraph(context) {
    const parts = [];

    if (context.industry) {
      parts.push(`This report analyzes the ${context.industry} industry`);
    }

    if (context.company) {
      parts.push(`with a focus on ${context.company} and its competitive positioning`);
    }

    if (context.competitors && context.competitors.length > 0) {
      parts.push(`The analysis includes ${context.competitors.length} key competitors`);
    }

    if (context.findings && context.findings.length > 0) {
      const trendFindings = context.findings.filter(f => f.type === 'industry_trends');
      const competitorFindings = context.findings.filter(f => f.type === 'competitor_analysis');

      if (trendFindings.length > 0) {
        parts.push('and evaluates current industry trends');
      }
      if (competitorFindings.length > 0) {
        parts.push('along with detailed competitor analyses');
      }
    }

    return parts.join(', ') + '.';
  }

  /**
   * Generate industry analysis section
   */
  generateIndustrySection(context) {
    const lines = [
      '## Industry Analysis',
      '',
      `### ${context.industry} Overview`,
      ''
    ];

    // Find industry trends findings
    const trendFindings = context.findings?.filter(f => f.type === 'industry_trends') || [];

    if (trendFindings.length > 0) {
      const latestTrends = trendFindings[trendFindings.length - 1];

      if (latestTrends.trends && latestTrends.trends.trends) {
        lines.push('### Key Industry Trends');
        lines.push('');
        lines.push('| Trend | Impact | Momentum | Adoption |');
        lines.push('|-------|--------|----------|----------|');

        for (const trend of latestTrends.trends.trends.slice(0, 5)) {
          lines.push(`| ${trend.name} | ${trend.impact} | ${trend.momentum || 'N/A'} | ${trend.adoptionRate}% |`);
        }

        lines.push('');
      }

      if (latestTrends.trends && latestTrends.trends.forecast) {
        lines.push('### Industry Outlook');
        lines.push('');
        const outlook = latestTrends.trends.forecast.outlook;
        lines.push(`**Rating:** ${outlook.rating.replace('_', ' ').toUpperCase()}`);
        lines.push('');
        lines.push(outlook.description);
        lines.push('');
      }

      if (latestTrends.trends && latestTrends.trends.insights) {
        lines.push('### Key Insights');
        lines.push('');
        for (const insight of latestTrends.trends.insights) {
          lines.push(`- **${insight.title}:** ${insight.description}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate company section
   */
  generateCompanySection(context) {
    const lines = [
      '## Company Analysis',
      '',
      `### ${context.company}`,
      ''
    ];

    // Find relevant findings
    const companyFindings = context.findings?.filter(f =>
      f.company === context.company || f.type === 'market_sizing'
    ) || [];

    if (companyFindings.length > 0) {
      lines.push('The company operates in a competitive market environment. ');
      lines.push('Key strategic considerations include:');
      lines.push('');
      lines.push('- Market positioning and differentiation');
      lines.push('- Competitive response strategies');
      lines.push('- Growth opportunities and challenges');
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate competitor analysis section
   */
  generateCompetitorSection(context) {
    const lines = [
      '## Competitive Landscape',
      ''
    ];

    if (!context.competitors || context.competitors.length === 0) {
      lines.push('No competitors were analyzed in this research session.');
      return lines.join('\n');
    }

    lines.push(`### ${context.competitors.length} Competitors Identified`);
    lines.push('');
    lines.push('| Competitor | Relevance Score | Status |');
    lines.push('|------------|-----------------|--------|');

    for (const competitor of context.competitors) {
      const score = (competitor.relevanceScore * 100).toFixed(0);
      lines.push(`| ${competitor.name} | ${score}% | Active |`);
    }

    lines.push('');

    // Add detailed analysis if available
    const competitorFindings = context.findings?.filter(f => f.type === 'competitor_analysis') || [];

    if (competitorFindings.length > 0) {
      const latestAnalysis = competitorFindings[competitorFindings.length - 1];

      if (latestAnalysis.analysis && latestAnalysis.analysis.landscape) {
        lines.push('### Competitive Landscape Summary');
        lines.push('');

        const landscape = latestAnalysis.analysis.landscape;
        if (landscape.marketLeaders && landscape.marketLeaders.length > 0) {
          lines.push(`**Market Leaders:** ${landscape.marketLeaders.join(', ')}`);
          lines.push('');
        }

        if (landscape.challengers && landscape.challengers.length > 0) {
          lines.push(`**Challengers:** ${landscape.challengers.join(', ')}`);
          lines.push('');
        }
      }

      if (latestAnalysis.analysis && latestAnalysis.analysis.insights) {
        lines.push('### Competitive Insights');
        lines.push('');
        for (const insight of latestAnalysis.analysis.insights) {
          lines.push(`- **${insight.title}:** ${insight.description}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate findings section
   */
  generateFindingsSection(context) {
    const lines = [
      '## Research Findings',
      ''
    ];

    if (!context.findings || context.findings.length === 0) {
      lines.push('No specific findings were recorded in this research session.');
      return lines.join('\n');
    }

    // Group findings by type
    const findingsByType = {};
    for (const finding of context.findings) {
      const type = finding.type || 'general';
      if (!findingsByType[type]) {
        findingsByType[type] = [];
      }
      findingsByType[type].push(finding);
    }

    for (const [type, findings] of Object.entries(findingsByType)) {
      const typeName = type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      lines.push(`### ${typeName}`);
      lines.push('');
      lines.push(`Found ${findings.length} research item(s) in this category.`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate recommendations section
   */
  generateRecommendationsSection(context) {
    const lines = [
      '## Recommendations',
      ''
    ];

    const recommendations = this.generateRecommendations(context);

    for (let i = 0; i < recommendations.length; i++) {
      lines.push(`### ${i + 1}. ${recommendations[i].title}`);
      lines.push('');
      lines.push(recommendations[i].description);
      lines.push('');
      lines.push(`**Priority:** ${recommendations[i].priority}`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate recommendations based on context
   */
  generateRecommendations(context) {
    const recommendations = [];

    // Competitor-based recommendations
    if (context.competitors && context.competitors.length > 0) {
      recommendations.push({
        title: 'Monitor Competitive Activity',
        description: `Continue to track the ${context.competitors.length} identified competitors for changes in strategy, pricing, and market positioning.`,
        priority: 'High'
      });
    }

    // Trend-based recommendations
    const trendFindings = context.findings?.filter(f => f.type === 'industry_trends') || [];
    if (trendFindings.length > 0) {
      recommendations.push({
        title: 'Capitalize on Emerging Trends',
        description: 'Evaluate opportunities to align product/service offerings with identified industry trends to maintain competitive advantage.',
        priority: 'High'
      });
    }

    // General recommendations
    recommendations.push({
      title: 'Conduct Regular Market Research',
      description: 'Establish a cadence for ongoing market research to stay informed about changes in the competitive landscape and industry dynamics.',
      priority: 'Medium'
    });

    recommendations.push({
      title: 'Develop Strategic Response Plans',
      description: 'Create contingency plans for responding to competitive threats and market changes identified in this analysis.',
      priority: 'Medium'
    });

    return recommendations;
  }

  /**
   * Generate appendix
   */
  generateAppendix(context) {
    const lines = [
      '## Appendix',
      '',
      '### Research Methodology',
      '',
      'This report was generated using automated market research tools that analyze:',
      '- Web search results for market data',
      '- Competitor information and positioning',
      '- Industry trend analysis',
      '- Market sizing estimates',
      '',
      '### Data Sources',
      '',
      'Data was collected from publicly available sources including:',
      '- Industry reports and publications',
      '- Company websites and press releases',
      '- Financial databases and filings',
      '- News articles and market commentary',
      '',
      '### Limitations',
      '',
      'This analysis is based on available data and may not reflect:',
      '- Private company information',
      '- Real-time market changes',
      '- Internal strategic decisions',
      ''
    ];

    return lines.join('\n');
  }

  /**
   * Generate JSON format report
   */
  generateJsonReport(context, options = {}) {
    return {
      format: 'json',
      content: JSON.stringify({
        metadata: {
          generatedAt: new Date().toISOString(),
          industry: context.industry,
          company: context.company
        },
        summary: {
          competitorCount: context.competitors?.length || 0,
          findingsCount: context.findings?.length || 0,
          researchTimestamp: context.timestamp
        },
        competitors: context.competitors || [],
        findings: context.findings || []
      }, null, 2),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate executive summary report
   */
  generateExecutiveSummary(context, options = {}) {
    const lines = [
      '# Executive Summary',
      '',
      `**Date:** ${new Date().toLocaleDateString()}`,
      '',
      '## Overview',
      '',
      this.generateOverviewParagraph(context),
      '',
      '## Key Findings',
      ''
    ];

    // Add top 3 findings
    if (context.findings && context.findings.length > 0) {
      const topFindings = context.findings.slice(0, 3);
      for (let i = 0; i < topFindings.length; i++) {
        lines.push(`${i + 1}. **${topFindings[i].type.replace(/_/g, ' ').toUpperCase()}**: Research completed for ${topFindings[i].industry || topFindings[i].company || 'target'}.`);
      }
    } else {
      lines.push('- No specific findings recorded');
    }

    lines.push('');
    lines.push('## Recommended Actions');
    lines.push('');

    const recommendations = this.generateRecommendations(context);
    for (const rec of recommendations.slice(0, 3)) {
      lines.push(`- **${rec.title}** (${rec.priority} Priority)`);
    }

    return {
      format: 'executive',
      content: lines.join('\n'),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Generate detailed analysis report
   */
  generateDetailedReport(context, options = {}) {
    // Include all sections with appendix
    return this.generateMarkdownReport(context, { ...options, includeAppendix: true });
  }

  /**
   * Count words in text
   */
  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}

export default ReportGenerator;
