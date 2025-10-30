// frontend/app/city/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/fetcher";
import CityForecast from "@/app/components/CityForecast";

export default function CityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params as any)?.id as string;
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    (async () => {
      const res = await apiFetch(`/api/cities/${id}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        setError(res.data?.error || "Failed to load city");
        setLoading(false);
        return;
      }
      setCity(res.data?.city ?? null);
      setForecast(res.data?.forecast ?? null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Loading Skeleton */}
          <div className="animate-pulse space-y-6">
            {/* Back button skeleton */}
            <div className="h-10 bg-white/5 rounded-xl w-32"></div>
            
            {/* Main card skeleton */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-white/10 rounded w-48"></div>
                  <div className="h-6 bg-white/10 rounded w-64"></div>
                  <div className="h-16 bg-white/10 rounded w-32"></div>
                </div>
                <div className="w-32 h-32 bg-white/10 rounded-2xl"></div>
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-[#1a1a1a] border border-white/10 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading City</h3>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => router.back()}
              className="mt-6 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl
                         hover:bg-white/20 transition-all duration-200">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-gray-400">City not found</p>
          </div>
        </div>
      </div>
    );
  }

  const w = city.weather || {};
  const iconUrl = w.icon ? `https://openweathermap.org/img/wn/${w.icon}@4x.png` : null;
  const sunrise = w.sunrise ? new Date(w.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";
  const sunset = w.sunset ? new Date(w.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-";

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 
                     rounded-xl text-white hover:bg-white/10 hover:border-white/20
                     transition-all duration-200 group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Main Weather Card */}
        <div className="relative overflow-hidden bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 
                        shadow-xl hover:border-white/20 transition-all duration-300">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left section - City info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                  {city.name}
                </h1>
                <p className="text-lg text-gray-400 capitalize">
                  {w.description || w.condition || "No description"}
                </p>
              </div>
              
              {/* Temperature display */}
              <div className="flex items-baseline gap-2">
                <span className="text-7xl md:text-8xl font-black bg-linear-to-br from-blue-400 to-purple-400 
                                 bg-clip-text text-transparent">
                  {Math.round(w.temp ?? 0)}°
                </span>
                <span className="text-2xl text-gray-500">
                  {w.feels_like ? `Feels like ${Math.round(w.feels_like)}°` : ""}
                </span>
              </div>

              {/* Additional info badges */}
              <div className="flex flex-wrap gap-2">
                {w.pressure && (
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                    {w.pressure} hPa
                  </span>
                )}
                {w.visibility && (
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                    Visibility: {(w.visibility / 1000).toFixed(1)} km
                  </span>
                )}
              </div>
            </div>

            {/* Right section - Weather icon */}
            {iconUrl && (
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 
                                rounded-3xl blur-2xl"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 
                                rounded-3xl p-4 shadow-2xl">
                  <img src={iconUrl} alt="Weather icon" className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weather Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Humidity Card */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 
                          hover:border-blue-500/30 hover:bg-[#1f1f1f] 
                          transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-400">Humidity</h4>
              <svg className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{w.humidity ?? "-"}%</p>
          </div>

          {/* Wind Speed Card */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 
                          hover:border-green-500/30 hover:bg-[#1f1f1f] 
                          transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-400">Wind Speed</h4>
              <svg className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{w.windSpeed ?? "-"} <span className="text-lg text-gray-500">m/s</span></p>
          </div>

          {/* Sunrise Card */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 
                          hover:border-yellow-500/30 hover:bg-[#1f1f1f] 
                          transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-400">Sunrise</h4>
              <svg className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{sunrise}</p>
          </div>

          {/* Sunset Card */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 
                          hover:border-orange-500/30 hover:bg-[#1f1f1f] 
                          transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-400">Sunset</h4>
              <svg className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-white">{sunset}</p>
          </div>
        </div>

        {/* Forecast Section */}
        <CityForecast forecast={forecast} />
      </div>
    </div>
  );
}
