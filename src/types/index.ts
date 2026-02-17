export interface Competitor {
  id: string;
  name: string;
}

export interface Feature {
  id: string;
  name: string;
}

export interface Distributor {
  id: string;
  name: string;
}

export type StakeholderType = 'Executive' | 'Sales' | 'Product' | 'Operations';

export interface Report {
  id: string;
  type: 'product' | 'strategic';
  title: string;
  content: string;
  slackMessage: string;
  timestamp: string;
}

export interface ResearchRequest {
  mode: 'product' | 'strategic';
  action: 'competitor_research' | 'table_stakes' | 'gap_analysis' | 'strategic_intelligence' | 'stakeholder_brief';
  competitors?: string[];
  features?: string[];
  distributors?: string[];
  stakeholder?: StakeholderType;
}
