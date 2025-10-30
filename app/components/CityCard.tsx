'use client';
import React from 'react';
import Link from 'next/link';

export default function CityCard({ city, onDelete }: { city: any; onDelete: (id: string) => void }) {
  const w = city.weather || {};
  const iconUrl = w.icon ? `https://openweathermap.org/img/wn/${w.icon}@2x.png` : null;

  return (
    <div className="group relative overflow-hidden bg-[#1a1a1a] border border-white/10 
                    rounded-2xl p-6 transition-all duration-300
                    hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10">
      
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 via-blue-500/0 to-pink-500/0 
                      group-hover:from-purple-500/5 group-hover:via-blue-500/5 group-hover:to-pink-500/5
                      transition-all duration-500 pointer-events-none"></div>

      {/* Content */}
      <div className="relative space-y-6">
        
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4">
          {/* City name and location badge */}
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl font-black text-white tracking-tight 
                           group-hover:text-transparent group-hover:bg-linear-to-r 
                           group-hover:from-purple-400 group-hover:to-blue-400 
                           group-hover:bg-clip-text transition-all duration-300">
              {city.name}
            </h3>
            
            {/* Condition badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm 
                            px-3 py-2 rounded-lg border border-white/10
                            group-hover:border-purple-500/30 transition-all duration-300">
              <span className="text-sm text-gray-400 capitalize">
                {w.condition || w.description || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Weather icon with glow effect */}
          {iconUrl && (
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 
                              rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 
                              rounded-2xl p-3 group-hover:border-white/20 transition-all duration-300">
                <img src={iconUrl} alt="Weather icon" className="w-16 h-16 drop-shadow-2xl" />
              </div>
            </div>
          )}
        </div>

        {/* Temperature Section */}
        <div className="flex items-baseline gap-3 py-4 border-y border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black bg-linear-to-br from-blue-400 to-purple-400 
                             bg-clip-text text-transparent">
              {Math.round(w.temp ?? 0)}°
            </span>
            {w.feels_like && (
              <span className="text-sm text-gray-500">
                Feels {Math.round(w.feels_like)}°
              </span>
            )}
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-3">
          {/* Humidity */}
          {w.humidity && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3
                            hover:bg-white/10 transition-all duration-200">
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="text-xs text-gray-400">Humidity</span>
                <span className="text-sm font-bold text-white">{w.humidity}%</span>
              </div>
            </div>
          )}

          {/* Wind Speed */}
          {w.windSpeed && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3
                            hover:bg-white/10 transition-all duration-200">
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-xs text-gray-400">Wind</span>
                <span className="text-sm font-bold text-white">{w.windSpeed}m/s</span>
              </div>
            </div>
          )}

          {/* Pressure */}
          {w.pressure && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3
                            hover:bg-white/10 transition-all duration-200">
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs text-gray-400">Pressure</span>
                <span className="text-sm font-bold text-white">{w.pressure}hPa</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Link href={`/city/${city._id}`} className="flex-1">
            <button className="w-full px-5 py-3 font-semibold rounded-xl
                             bg-linear-to-r from-purple-600 to-blue-600 text-white
                             hover:from-purple-500 hover:to-blue-500
                             shadow-lg hover:shadow-purple-500/50
                             active:scale-[0.98] transition-all duration-200
                             flex items-center justify-center gap-2 cursor-pointer">
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
          
          <button
            onClick={() => onDelete(city._id)}
            className="px-5 py-3 font-semibold rounded-xl
                       bg-red-500/10 text-red-400 border border-red-500/30
                       hover:bg-red-500/20 hover:border-red-500/50
                       active:scale-[0.98] transition-all duration-200
                       flex items-center justify-center gap-2 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
