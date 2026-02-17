import { NextRequest, NextResponse } from 'next/server';
import { ResearchRequest } from '@/types';

function buildPrompt(request: ResearchRequest): string {
  switch (request.action) {
    case 'competitor_research':
      return `You are a market research analyst for a field service management software company. Research the following competitors and provide a detailed analysis of their current features, pricing, recent updates, and market positioning:

Competitors: ${request.competitors?.join(', ')}

For each competitor, provide:
1. Key features and capabilities
2. Recent product updates or announcements
3. Pricing model
4. Target market segment
5. Strengths and weaknesses

Format the response in a clear, structured way with headers for each competitor.`;

    case 'table_stakes':
      return `You are a market research analyst for a field service management software company. Analyze the following competitors and identify table stakes features - features that are standard across the industry that any competitive product must have:

Competitors: ${request.competitors?.join(', ')}

Provide:
1. A ranked list of table stakes features (must-have features)
2. For each feature, indicate which competitors offer it
3. Identify any emerging table stakes (features becoming standard)
4. Provide a summary of minimum viable feature set

Format clearly with sections and bullet points.`;

    case 'gap_analysis':
      return `You are a market research analyst. Perform a gap analysis comparing the following competitors against our product features:

Competitors: ${request.competitors?.join(', ')}

Our Features:
${request.features?.map((f) => `- ${f}`).join('\n')}

Provide:
1. Feature comparison matrix
2. Our competitive advantages (features competitors lack)
3. Our gaps (features competitors have that we don't)
4. Opportunities for differentiation
5. Priority recommendations

Format as a structured analysis with clear sections.`;

    case 'strategic_intelligence':
      return `You are a strategic market intelligence analyst focused on the HVAC, plumbing, and electrical wholesale distribution industry. Research the following distributors and provide strategic intelligence:

Distributors: ${request.distributors?.join(', ')}

Provide:
1. Company overview and market position
2. Recent news, acquisitions, or strategic moves
3. Technology adoption and digital transformation efforts
4. Key partnerships and integrations
5. Market trends affecting these distributors
6. Opportunities for technology partnerships

Format as a comprehensive intelligence briefing.`;

    case 'stakeholder_brief':
      return `You are a strategic market intelligence analyst. Create a stakeholder-specific brief for the ${request.stakeholder} team based on research about these wholesale distributors:

Distributors: ${request.distributors?.join(', ')}

${getStakeholderContext(request.stakeholder!)}

Format the brief with:
- Executive summary (3-4 sentences)
- Key findings relevant to this stakeholder
- Actionable recommendations
- Risk factors to monitor

Keep it concise and actionable for a ${request.stakeholder} audience.`;

    default:
      return 'Provide a general market research overview.';
  }
}

function getStakeholderContext(stakeholder: string): string {
  switch (stakeholder) {
    case 'Executive':
      return `Focus on:
- Market size and growth opportunities
- Competitive landscape shifts
- Strategic partnership potential
- Revenue impact and ROI projections
- Industry consolidation trends`;
    case 'Sales':
      return `Focus on:
- Key decision makers and buying processes
- Pain points and selling opportunities
- Competitor displacement strategies
- Account penetration tactics
- Pricing and deal structure insights`;
    case 'Product':
      return `Focus on:
- Technology stack and integration requirements
- Feature requests and unmet needs
- User experience pain points
- API and platform capabilities
- Product roadmap implications`;
    case 'Operations':
      return `Focus on:
- Implementation and onboarding processes
- Support and training requirements
- Integration complexity
- Scalability considerations
- Operational efficiency opportunities`;
    default:
      return '';
  }
}

function generateSlackMessage(action: string, content: string): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const titles: Record<string, string> = {
    competitor_research: ':mag: Competitor Research Update',
    table_stakes: ':chart_with_upwards_trend: Table Stakes Analysis',
    gap_analysis: ':dart: Gap Analysis Report',
    strategic_intelligence: ':globe_with_meridians: Strategic Intelligence Brief',
    stakeholder_brief: ':briefcase: Stakeholder Brief',
  };

  const title = titles[action] || ':memo: Market Research Report';

  // Truncate content for Slack message to keep it digestible
  const maxLen = 2000;
  const truncated =
    content.length > maxLen ? content.substring(0, maxLen) + '\n\n_...report truncated. See full report in app._' : content;

  return `*${title}*\n_${timestamp}_\n\n${truncated}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: ResearchRequest = await req.json();
    const prompt = buildPrompt(body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        tools: [
          {
            type: 'web_search' as const,
            name: 'web_search',
            max_uses: 5,
          },
        ],
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract text content from the response
    let textContent = '';
    if (data.content) {
      for (const block of data.content) {
        if (block.type === 'text') {
          textContent += block.text;
        }
      }
    }

    const slackMessage = generateSlackMessage(body.action, textContent);

    return NextResponse.json({
      content: textContent,
      slackMessage,
    });
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform research. Please try again.' },
      { status: 500 }
    );
  }
}
