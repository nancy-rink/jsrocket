'use client';

import { useState, useEffect, useCallback } from 'react';
import { Distributor, Report, StakeholderType } from '@/types';
import {
  getDistributors,
  saveDistributors,
  getReports,
  saveReport,
  deleteReport,
} from '@/lib/storage';
import ItemManager from './ItemManager';
import ReportHistory from './ReportHistory';
import ReportViewer from './ReportViewer';

const STAKEHOLDERS: StakeholderType[] = ['Executive', 'Sales', 'Product', 'Operations'];

export default function StrategicTab() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [error, setError] = useState('');
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  useEffect(() => {
    setDistributors(getDistributors());
    setReports(getReports().filter((r) => r.type === 'strategic'));
  }, []);

  const addDistributor = useCallback(
    (name: string) => {
      const updated = [...distributors, { id: crypto.randomUUID(), name }];
      setDistributors(updated);
      saveDistributors(updated);
    },
    [distributors]
  );

  const removeDistributor = useCallback(
    (id: string) => {
      const updated = distributors.filter((d) => d.id !== id);
      setDistributors(updated);
      saveDistributors(updated);
    },
    [distributors]
  );

  const handleDeleteReport = useCallback(
    (id: string) => {
      deleteReport(id);
      setReports(reports.filter((r) => r.id !== id));
    },
    [reports]
  );

  const runResearch = async (action: string, title: string, stakeholder?: StakeholderType) => {
    if (distributors.length === 0) {
      setError('Add at least one distributor to run research.');
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
          mode: 'strategic',
          action,
          distributors: distributors.map((d) => d.name),
          stakeholder,
        }),
      });

      if (!response.ok) {
        throw new Error(`Research failed (${response.status})`);
      }

      const data = await response.json();
      const report: Report = {
        id: crypto.randomUUID(),
        type: 'strategic',
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
      <div className="bg-white rounded-lg border p-4">
        <ItemManager
          title="Wholesale Distributors"
          items={distributors}
          onAdd={addDistributor}
          onRemove={removeDistributor}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Research Actions</h3>
        <div className="space-y-4">
          <button
            onClick={() => runResearch('strategic_intelligence', 'Strategic Intelligence')}
            disabled={loading}
            className="w-full px-4 py-3 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && loadingAction === 'Strategic Intelligence' ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner /> Researching...
              </span>
            ) : (
              'Research Strategic Intelligence'
            )}
          </button>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Stakeholder Briefs
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STAKEHOLDERS.map((stakeholder) => {
                const actionTitle = `${stakeholder} Brief`;
                return (
                  <button
                    key={stakeholder}
                    onClick={() =>
                      runResearch('stakeholder_brief', actionTitle, stakeholder)
                    }
                    disabled={loading}
                    className="px-4 py-3 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading && loadingAction === actionTitle ? (
                      <span className="flex items-center justify-center gap-2">
                        <Spinner /> Loading...
                      </span>
                    ) : (
                      stakeholder
                    )}
                  </button>
                );
              })}
            </div>
          </div>
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
