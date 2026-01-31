# Market Research Agent

An AI-powered market research agent for competitive analysis, industry trends, and market insights.

## Features

- **Web Search**: Search for market data and research information
- **Competitor Analysis**: Identify and analyze competitors for any company
- **Industry Trends**: Research and track industry trends with forecasts
- **Market Sizing**: Analyze market size and growth potential
- **Report Generation**: Generate comprehensive reports in multiple formats

## Installation

```bash
npm install
```

## Usage

### CLI

```bash
# General market research
npm start research "cloud computing market size"

# Analyze competitors for a company
npm start competitors "Acme Corp"

# Research industry trends
npm start trends "healthcare technology"

# Comprehensive analysis
npm start analyze "TechStartup" "SaaS"

# Generate report
npm start report
```

### CLI Options

```
-h, --help       Show help message
-v, --verbose    Enable verbose output
-o, --output     Save output to file
-f, --format     Output format (json, markdown, executive)
--version        Show version number
```

### Programmatic Usage

```javascript
import { MarketResearchAgent } from './src/index.js';

const agent = new MarketResearchAgent({ verbose: true });

// Initialize a research session
agent.initSession({
  company: 'TechStartup',
  industry: 'SaaS'
});

// Research a topic
const results = await agent.research('cloud computing market');

// Analyze competitors
const competitors = await agent.analyzeCompetitors('Acme Corp');

// Research industry trends
const trends = await agent.researchTrends('healthcare technology');

// Comprehensive analysis
const analysis = await agent.comprehensiveAnalysis({
  company: 'TechStartup',
  industry: 'SaaS',
  includeCompetitors: true,
  includeTrends: true,
  includeMarketSize: true
});

// Generate report
const report = await agent.generateReport('markdown');
console.log(report.content);

// Export data
const data = agent.exportData('json');
```

## Architecture

```
src/
├── agent/
│   └── MarketResearchAgent.js   # Core agent class
├── services/
│   ├── WebSearchService.js      # Web search operations
│   ├── CompetitorAnalysisService.js  # Competitor analysis
│   └── IndustryTrendsService.js # Trend analysis
├── reports/
│   └── ReportGenerator.js       # Report generation
├── utils/
│   ├── http.js                  # HTTP utilities
│   └── parser.js                # Data parsing utilities
├── cli.js                       # CLI interface
└── index.js                     # Main exports
```

## API Reference

### MarketResearchAgent

The main agent class for conducting market research.

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | string | 'MarketResearchAgent' | Agent instance name |
| `verbose` | boolean | false | Enable verbose logging |

#### Methods

##### `research(query, options)`
Perform a market research query.

##### `analyzeCompetitors(company, options)`
Analyze competitors for a given company.

##### `researchTrends(industry, options)`
Research industry trends and forecasts.

##### `analyzeMarketSize(market, options)`
Analyze market size and growth potential.

##### `comprehensiveAnalysis(params)`
Perform comprehensive market analysis including competitors, trends, and market sizing.

##### `generateReport(format)`
Generate a report from the current research session.
- Formats: `'markdown'`, `'json'`, `'executive'`, `'detailed'`

##### `exportData(format)`
Export research data in specified format.

##### `clearSession()`
Clear the current research session.

## Report Formats

- **Markdown**: Full research report with sections for competitors, trends, and recommendations
- **JSON**: Structured data export
- **Executive**: Brief executive summary
- **Detailed**: Comprehensive report with appendix

## Requirements

- Node.js >= 18.0.0

## License

MIT
