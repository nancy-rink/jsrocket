'use client';

import { useState } from 'react';
import { Report } from '@/types';

interface ReportViewerProps {
  report: Report | null;
  onClose: () => void;
}

export default function ReportViewer({ report, onClose }: ReportViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'report' | 'slack'>('report');

  if (!report) return null;

  const handleCopy = async () => {
    const text = activeView === 'slack' ? report.slackMessage : report.content;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 truncate pr-4">
            {report.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            &times;
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveView('report')}
            className={`px-4 py-2 text-sm font-medium ${
              activeView === 'report'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Full Report
          </button>
          <button
            onClick={() => setActiveView('slack')}
            className={`px-4 py-2 text-sm font-medium ${
              activeView === 'slack'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Slack Message
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
            {activeView === 'slack' ? report.slackMessage : report.content}
          </pre>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {copied ? 'Copied!' : activeView === 'slack' ? 'Copy Slack Message' : 'Copy Report'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
