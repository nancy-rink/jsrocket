'use client';

import { Report, Competitor, Feature, Distributor } from '@/types';

const REPORTS_KEY = 'market_research_reports';
const COMPETITORS_KEY = 'market_research_competitors';
const FEATURES_KEY = 'market_research_features';
const DISTRIBUTORS_KEY = 'market_research_distributors';

const DEFAULT_COMPETITORS: Competitor[] = [
  { id: '1', name: 'Housecall Pro' },
  { id: '2', name: 'Jobber' },
  { id: '3', name: 'ServiceTitan' },
  { id: '4', name: 'FieldPulse' },
  { id: '5', name: 'Workiz' },
];

const DEFAULT_FEATURES: Feature[] = [
  { id: '1', name: 'AI workflow optimization' },
  { id: '2', name: 'Margin analysis' },
  { id: '3', name: 'Distributor integration' },
  { id: '4', name: 'Mobile ordering' },
];

const DEFAULT_DISTRIBUTORS: Distributor[] = [
  { id: '1', name: 'Watsco Inc.' },
  { id: '2', name: 'Ferguson Enterprises' },
  { id: '3', name: 'Winsupply Inc.' },
  { id: '4', name: 'F.W. Webb Co.' },
  { id: '5', name: 'Supplyhouse' },
];

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function getReports(): Report[] {
  return getItem<Report[]>(REPORTS_KEY, []);
}

export function saveReport(report: Report): void {
  const reports = getReports();
  reports.unshift(report);
  setItem(REPORTS_KEY, reports);
}

export function deleteReport(id: string): void {
  const reports = getReports().filter((r) => r.id !== id);
  setItem(REPORTS_KEY, reports);
}

export function getCompetitors(): Competitor[] {
  return getItem<Competitor[]>(COMPETITORS_KEY, DEFAULT_COMPETITORS);
}

export function saveCompetitors(competitors: Competitor[]): void {
  setItem(COMPETITORS_KEY, competitors);
}

export function getFeatures(): Feature[] {
  return getItem<Feature[]>(FEATURES_KEY, DEFAULT_FEATURES);
}

export function saveFeatures(features: Feature[]): void {
  setItem(FEATURES_KEY, features);
}

export function getDistributors(): Distributor[] {
  return getItem<Distributor[]>(DISTRIBUTORS_KEY, DEFAULT_DISTRIBUTORS);
}

export function saveDistributors(distributors: Distributor[]): void {
  setItem(DISTRIBUTORS_KEY, distributors);
}
