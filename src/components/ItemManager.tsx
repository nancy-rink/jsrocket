'use client';

import { useState } from 'react';

interface Item {
  id: string;
  name: string;
}

interface ItemManagerProps {
  title: string;
  items: Item[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export default function ItemManager({ title, items, onAdd, onRemove }: ItemManagerProps) {
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (trimmed && !items.some((i) => i.name.toLowerCase() === trimmed.toLowerCase())) {
      onAdd(trimmed);
      setNewItem('');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={`Add ${title.toLowerCase()}...`}
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          disabled={!newItem.trim()}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full"
          >
            {item.name}
            <button
              onClick={() => onRemove(item.id)}
              className="ml-1 text-gray-400 hover:text-red-500"
              aria-label={`Remove ${item.name}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
