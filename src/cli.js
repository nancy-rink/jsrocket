#!/usr/bin/env node

/**
 * Market Research Agent CLI
 *
 * Usage:
 *   market-research research <query>     - Perform a general market research query
 *   market-research competitors <company> - Analyze competitors for a company
 *   market-research trends <industry>    - Research industry trends
 *   market-research analyze <company> <industry> - Comprehensive analysis
 *   market-research report               - Generate a report from session data
 */

import { MarketResearchAgent } from './agent/MarketResearchAgent.js';
import { parseArgs } from 'node:util';
import { writeFile } from 'node:fs/promises';

// CLI Configuration
const CLI_NAME = 'market-research';
const VERSION = '1.0.0';

/**
 * Display help information
 */
function showHelp() {
  console.log(`
${CLI_NAME} v${VERSION}
An AI-powered market research agent

USAGE:
  ${CLI_NAME} <command> [options] [arguments]

COMMANDS:
  research <query>              Perform a general market research query
  competitors <company>         Analyze competitors for a company
  trends <industry>             Research industry trends
  analyze <company> <industry>  Comprehensive market analysis
  report                        Generate a report from session data

OPTIONS:
  -h, --help                    Show this help message
  -v, --verbose                 Enable verbose output
  -o, --output <file>           Save output to file
  -f, --format <format>         Output format (json, markdown, executive)
  --version                     Show version number

EXAMPLES:
  ${CLI_NAME} research "cloud computing market size"
  ${CLI_NAME} competitors "Acme Corp" --verbose
  ${CLI_NAME} trends "healthcare technology" -o trends.md
  ${CLI_NAME} analyze "TechStartup" "SaaS" --format json
`);
}

/**
 * Display version
 */
function showVersion() {
  console.log(`${CLI_NAME} v${VERSION}`);
}

/**
 * Format output based on specified format
 */
function formatOutput(data, format) {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'markdown':
    case 'md':
      return formatMarkdown(data);
    default:
      return JSON.stringify(data, null, 2);
  }
}

/**
 * Format data as markdown
 */
function formatMarkdown(data) {
  const lines = [];

  if (data.company) {
    lines.push(`# Analysis: ${data.company}`);
  } else if (data.industry) {
    lines.push(`# ${data.industry} Research`);
  } else if (data.query) {
    lines.push(`# Research: ${data.query}`);
  } else {
    lines.push('# Market Research Results');
  }

  lines.push('');
  lines.push(`*Generated: ${new Date().toISOString()}*`);
  lines.push('');

  // Add sections based on data content
  if (data.items) {
    lines.push('## Search Results');
    lines.push('');
    for (const item of data.items) {
      lines.push(`### ${item.title}`);
      lines.push(item.snippet);
      lines.push(`*Source: ${item.url}*`);
      lines.push('');
    }
  }

  if (data.competitors) {
    lines.push('## Competitors');
    lines.push('');
    if (Array.isArray(data.competitors)) {
      for (const comp of data.competitors) {
        lines.push(`- **${comp.name}** (Relevance: ${(comp.relevanceScore * 100).toFixed(0)}%)`);
      }
    }
    lines.push('');
  }

  if (data.trends) {
    lines.push('## Industry Trends');
    lines.push('');
    const trends = data.trends.trends || data.trends;
    if (Array.isArray(trends)) {
      for (const trend of trends) {
        lines.push(`- **${trend.name}**: ${trend.description || ''} (Impact: ${trend.impact}, Adoption: ${trend.adoptionRate}%)`);
      }
    }
    lines.push('');
  }

  if (data.insights) {
    lines.push('## Key Insights');
    lines.push('');
    for (const insight of data.insights) {
      lines.push(`- **${insight.title || insight.type}**: ${insight.description || insight.summary}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Save output to file
 */
async function saveToFile(filepath, content) {
  await writeFile(filepath, content, 'utf-8');
  console.log(`Output saved to: ${filepath}`);
}

/**
 * Print results to console
 */
function printResults(data, options) {
  const output = formatOutput(data, options.format);
  console.log(output);
}

/**
 * Main CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  // Handle empty args
  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  // Parse options
  let options;
  try {
    const parsed = parseArgs({
      args,
      options: {
        help: { type: 'boolean', short: 'h' },
        verbose: { type: 'boolean', short: 'v' },
        output: { type: 'string', short: 'o' },
        format: { type: 'string', short: 'f', default: 'json' },
        version: { type: 'boolean' }
      },
      allowPositionals: true
    });
    options = parsed.values;
    args.splice(0, args.length, ...parsed.positionals);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    showHelp();
    process.exit(1);
  }

  // Handle help and version flags
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.version) {
    showVersion();
    process.exit(0);
  }

  // Get command and arguments
  const command = args[0];
  const commandArgs = args.slice(1);

  // Initialize agent
  const agent = new MarketResearchAgent({ verbose: options.verbose });

  try {
    let result;

    switch (command) {
      case 'research':
        if (commandArgs.length === 0) {
          console.error('Error: Please provide a search query');
          process.exit(1);
        }
        const query = commandArgs.join(' ');
        console.log(`Researching: ${query}\n`);
        result = await agent.research(query);
        break;

      case 'competitors':
        if (commandArgs.length === 0) {
          console.error('Error: Please provide a company name');
          process.exit(1);
        }
        const company = commandArgs.join(' ');
        console.log(`Analyzing competitors for: ${company}\n`);
        result = await agent.analyzeCompetitors(company);
        break;

      case 'trends':
        if (commandArgs.length === 0) {
          console.error('Error: Please provide an industry');
          process.exit(1);
        }
        const industry = commandArgs.join(' ');
        console.log(`Researching trends for: ${industry}\n`);
        result = await agent.researchTrends(industry);
        break;

      case 'analyze':
        if (commandArgs.length < 2) {
          console.error('Error: Please provide company and industry');
          console.error('Usage: analyze <company> <industry>');
          process.exit(1);
        }
        const analysisCompany = commandArgs[0];
        const analysisIndustry = commandArgs.slice(1).join(' ');
        console.log(`Comprehensive analysis for: ${analysisCompany} in ${analysisIndustry}\n`);
        result = await agent.comprehensiveAnalysis({
          company: analysisCompany,
          industry: analysisIndustry
        });
        break;

      case 'report':
        console.log('Generating report...\n');
        const report = await agent.generateReport(options.format || 'markdown');
        result = report;
        break;

      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }

    // Handle output
    if (options.output) {
      const content = formatOutput(result, options.format);
      await saveToFile(options.output, content);
    } else {
      printResults(result, options);
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run CLI
main().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
