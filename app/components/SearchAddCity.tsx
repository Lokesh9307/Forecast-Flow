'use client';
import React, { useState } from 'react';
import { apiFetch } from '../lib/fetcher';

export default function SearchAddCity({ onAdded }: { onAdded: () => void }) {
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function addCity(e?: React.FormEvent) {
    e?.preventDefault();
    if (!q.trim()) return;
    setLoading(true); setMsg(null);
    const r = await apiFetch('/api/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: q.trim() })
    });
    if (!r.ok) setMsg(r.data?.error || 'Failed to add');
    else { setQ(''); setMsg('Added ' + r.data.name); onAdded(); }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={addCity} className="relative">
        {/* Search container with glassmorphic effect */}
        <div className="relative flex items-center gap-3 bg-[#1a1a1a] border border-white/10 
                        rounded-2xl p-2 shadow-lg
                        focus-within:border-white/30 focus-within:shadow-xl
                        transition-all duration-300">
          
          {/* Search icon */}
          <div className="pl-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input field */}
          <input 
            className="flex-1 bg-transparent text-white placeholder-gray-500 
                       text-base outline-none px-2 py-2.5"
            placeholder="Search for a city to add..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)}
            disabled={loading}
          />

          {/* Add button */}
          <button 
            type="submit"
            disabled={loading || !q.trim()}
            className="px-6 py-2.5 rounded-xl font-semibold
                       bg-linear-to-r from-blue-600 to-purple-600 text-white
                       hover:from-blue-500 hover:to-purple-500
                       disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-blue-500/50
                       active:scale-95
                       transition-all duration-200
                       flex items-center gap-2 cursor-pointer">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add City
              </>
            )}
          </button>
        </div>
      </form>

      {/* Status message */}
      {msg && (
        <div className={`mt-3 px-4 py-2.5 rounded-lg border backdrop-blur-sm
                        ${msg.includes('Failed') || msg.includes('error') 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                          : 'bg-green-500/10 border-green-500/30 text-green-400'
                        }
                        flex items-center gap-2 animate-fadeIn`}>
          {msg.includes('Failed') || msg.includes('error') ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-medium">{msg}</span>
        </div>
      )}
    </div>
  );
}
