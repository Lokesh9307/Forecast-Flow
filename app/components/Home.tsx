// app/components/Home.tsx
"use client";

import React, { useState, useTransition } from "react";
import SearchAddCity from "./SearchAddCity";
import CityCard from "./CityCard";

type City = any;

export default function ClientHome({ initialCities }: { initialCities: City[] }) {
  const [cities, setCities] = useState<City[]>(initialCities ?? []);
  const [refreshing, setRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loading = isPending && cities.length === 0;

  async function load() {
    // Fast: fetch again but keep current UI; swap in with a transition.
    startTransition(async () => {
      const res = await fetch("/api/cities", { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      setCities(data || []);
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove city from tracking?")) return;

    // Optimistic UI
    const prev = cities;
    setCities((c) => c.filter((x: any) => x._id !== id));

    const res = await fetch(`/api/cities/${id}`, { method: "DELETE" });
    if (!res.ok) {
      // revert on failure
      setCities(prev);
      alert("Failed to delete. Please try again.");
    }
  }

  async function triggerUpdateAll() {
    setRefreshing(true);
    await fetch("/api/update-all", { method: "PATCH" });
    await load();
    setRefreshing(false);
  }

  return (
    <>
      {/* Controls Section */}
      <div className="mb-8 space-y-4">
        <SearchAddCity onAdded={load} />

        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={load}
            className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/5
                       text-white font-medium
                       hover:bg-white/10 hover:border-white/30
                       active:scale-95
                       transition-all duration-200
                       flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>

          <button
            onClick={triggerUpdateAll}
            disabled={refreshing}
            className="px-5 py-2.5 rounded-xl font-medium
                       bg-linear-to-r from-green-600 to-emerald-600 text-white
                       hover:from-green-500 hover:to-emerald-500
                       disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-green-500/50
                       active:scale-95
                       transition-all duration-200
                       flex items-center justify-center gap-2 cursor-pointer"
          >
            {refreshing ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Update All (hourly)</span>
                <span className="sm:hidden">Update All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-white/10 rounded w-3/4" />
                    <div className="h-8 bg-white/10 rounded w-1/2" />
                  </div>
                  <div className="w-16 h-16 bg-white/10 rounded-xl" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 h-10 bg-white/10 rounded-xl" />
                  <div className="w-20 h-10 bg-white/10 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : cities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 sm:p-12 max-w-md text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-linear-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border border-white/10">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Cities Added Yet</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              Start tracking weather by adding your first city using the search bar above.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Try: London</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Try: New York</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Try: Tokyo</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {cities.map((city: any) => (
            <CityCard key={city._id} city={city} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </>
  );
}
