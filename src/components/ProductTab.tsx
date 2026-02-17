'use client';

import { useState, useEffect, useCallback } from 'react';
import { Competitor, Feature, Report } from '@/types';
import {
  getCompetitors,
  saveCompetitors,
  getFeatures,
  saveFeatures,
  getReports,
  saveReport,
  deleteReport,
} from '@/lib/storage';
import ItemManager from './ItemManager';
import ReportHistory from './ReportHistory';
import ReportViewer from './ReportViewer';

export default function ProductTab() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [error, setError] = useState('');
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  useEffect(() => {
    setCompetitors(getCompetitors());
    setFeatures(getFeatures());
    setReports(getReports().filter((r) => r.type === 'product'));
  }, []);

  const addCompetitor = useCallback(
    (name: string) => {
      const updated = [...competitors, { id: crypto.randomUUID(), name }];
      setCompetitors(updated);
      saveCompetitors(updated);
    },
    [competitors]
  );

  const removeCompetitor = useCallback(
    (id: string) => {
      const updated = competitors.filter((c) => c.id !== id);
      setCompetitors(updated);
      saveCompetitors(updated);
    },
    [competitors]
  );

  const addFeature = useCallback(
    (name: string) => {
      const updated = [...features, { id: crypto.randomUUID(), name }];
      setFeatures(updated);
      saveFeatures(updated);
    },
    [features]
  );

  const removeFeature = useCallback(
    (id: string) => {
      const updated = features.filter((f) => f.id !== id);
      setFeatures(updated);
      saveFeatures(updated);
    },
    [features]
  );

  const handleDeleteReport = useCallback(
    (id: string) => {
      deleteReport(id);
      setReports(reports.filter((r) => r.id !== id));
    },
    [reports]
  );

  const runResearch = async (action: string, title: string) => {
    if (competitors.length === 0) {
      setError('Add at least one competitor to run research.');
      return;
    }

    setLoading(true);
    setLoadingAction(title);
    setError('');

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'product',
          action,
          competitors: competitors.map((c) => c.name),
          features: features.map((f) => f.name),
        }),
      });

      if (!response.ok) {
        throw new Error(`Research failed (${response.status})`);
      }

      const data = await response.json();
      const report: Report = {
        id: crypto.randomUUID(),
        type: 'product',
        title,
        content: data.content,
        slackMessage: data.slackMessage,
        timestamp: new Date().toISOString(),
      };

      saveReport(report);
      setReports((prev) => [report, ...prev]);
      setViewingReport(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research failed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingAction('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <ItemManager
            title="Competitors"
            items={competitors}
            onAdd={addCompetitor}
            onRemove={removeCompetitor}
          />
        </div>
        <div className="bg-white rounded-lg border p-4">
          <ItemManager
            title="Our Features"
            items={features}
            onAdd={addFeature}
            onRemove={removeFeature}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Research Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => runResearch('competitor_research', 'Competitor Research')}
            disabled={loading}
            className="px-4 py-3 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && loadingAction === 'Competitor Research' ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Researching...
              </span>
            ) : (
              'Research Competitors'
            )}
          </button>
          <button
            onClick={() => runResearch('table_stakes', 'Table Stakes Analysis')}
            disabled={loading}
            className="px-4 py-3 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && loadingAction === 'Table Stakes Analysis' ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Analyzing...
              </span>
            ) : (
              'Table Stakes Analysis'
            )}
          </button>
          <button
            onClick={() => runResearch('gap_analysis', 'Gap Analysis')}
            disabled={loading}
            className="px-4 py-3 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && loadingAction === 'Gap Analysis' ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Analyzing...
              </span>
            ) : (
              'Gap Analysis'
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <ReportHistory
          reports={reports}
          onDelete={handleDeleteReport}
          onView={setViewingReport}
        />
      </div>

      <ReportViewer
        report={viewingReport}
        onClose={() => setViewingReport(null)}
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
