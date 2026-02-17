'use client';

import { useState } from 'react';
import ProductTab from '@/components/ProductTab';
import StrategicTab from '@/components/StrategicTab';

type Tab = 'product' | 'strategic';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('product');

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Market Research Agent
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered competitive intelligence and strategic market analysis
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('product')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'product'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Product Feature Tracking
          </button>
          <button
            onClick={() => setActiveTab('strategic')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'strategic'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Strategic Market Intelligence
          </button>
        </div>

        {activeTab === 'product' ? <ProductTab /> : <StrategicTab />}
      </div>
    </div>
  );
}
