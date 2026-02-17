'use client';

import { Report } from '@/types';

interface ReportHistoryProps {
  reports: Report[];
  onDelete: (id: string) => void;
  onView: (report: Report) => void;
}

export default function ReportHistory({ reports, onDelete, onView }: ReportHistoryProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No reports yet. Run a research action to generate your first report.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Report History</h3>
      {reports.map((report) => (
        <div
          key={report.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
            <p className="text-xs text-gray-500">
              {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onView(report)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              View
            </button>
            <button
              onClick={() => onDelete(report.id)}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
