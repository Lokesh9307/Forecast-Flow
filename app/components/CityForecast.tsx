// frontend/components/CityForecast.tsx
"use client";
import TemperatureGraph from "./TemperatureGraph";

type DaySummary = {
  date: string;
  temp_min?: number;
  temp_max?: number;
  sunrise?: string;
  sunset?: string;
  weathercode?: number;
  entries?: any[];
};

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return d;
  }
}

export default function CityForecast({ forecast }: { forecast: any }) {
  if (!forecast) return <div className="mt-6 text-sm text-gray-400">No forecast available.</div>;
  if (forecast.error) return <div className="mt-6 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">Forecast error: {forecast.error}</div>;

  // Parse forecast data
  let days: DaySummary[] = [];

  if (forecast.days && Array.isArray(forecast.days) && forecast.days.length > 0) {
    days = forecast.days.map((d: any) => ({
      date: d.date ?? d.time ?? d[0],
      temp_min: d.temp_min ?? d.temperature_2m_min,
      temp_max: d.temp_max ?? d.temperature_2m_max,
      sunrise: d.sunrise,
      sunset: d.sunset,
      weathercode: d.weathercode,
      entries: d.entries
    }));
  } else if (forecast.daily && Array.isArray(forecast.daily) && forecast.daily.length > 0) {
    days = forecast.daily.slice(0, 5).map((d: any) => {
      const temps = (d.entries || []).map((e: any) => e.main?.temp).filter(Boolean);
      return {
        date: d.date,
        temp_min: temps.length ? Math.min(...temps) : undefined,
        temp_max: temps.length ? Math.max(...temps) : undefined,
        entries: d.entries
      };
    });
  } else if (forecast.list && Array.isArray(forecast.list)) {
    const buckets: Record<string, any[]> = {};
    for (const item of forecast.list) {
      const date = new Date(item.dt * 1000).toISOString().slice(0, 10);
      buckets[date] ||= [];
      buckets[date].push(item);
    }
    days = Object.keys(buckets).slice(0, 5).map((date) => {
      const items = buckets[date];
      const temps = items.map((i) => i.main?.temp).filter(Boolean);
      return {
        date,
        temp_min: temps.length ? Math.min(...temps) : undefined,
        temp_max: temps.length ? Math.max(...temps) : undefined,
        entries: items
      };
    });
  }

  if (!days || days.length === 0) {
    return <div className="mt-6 text-sm text-gray-400">No forecast days available.</div>;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">5-Day Forecast</h3>
          <p className="text-sm text-gray-400 mt-1">Temperature trends and daily weather</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-purple-400 rounded"></div>
            <span className="text-gray-400">Max Temp</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-400 rounded"></div>
            <span className="text-gray-400">Min Temp</span>
          </div>
        </div>
      </div>

      {/* Temperature Graph Component */}
      <TemperatureGraph data={days} />

      {/* Daily Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {days.map((d, idx) => (
          <div
            key={d.date + idx}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5
                       hover:border-white/20 hover:bg-[#1f1f1f]
                       transition-all duration-300 group">
            {/* Date */}
            <div className="text-sm font-semibold text-gray-400 mb-3">
              {fmtDate(d.date)}
            </div>

            {/* Temperature */}
            <div className="flex items-baseline gap-2 mb-4">
              <div className="text-3xl font-bold text-white">
                {d.temp_max !== undefined ? Math.round(d.temp_max) : "—"}°
              </div>
              <div className="text-lg text-gray-500">
                / {d.temp_min !== undefined ? Math.round(d.temp_min) : "—"}°
              </div>
            </div>

            {/* Sunrise/Sunset */}
            {d.sunrise || d.sunset ? (
              <div className="space-y-2 mb-4 text-xs">
                {d.sunrise && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{new Date(d.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                {d.sunset && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span>{new Date(d.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
            ) : null}

            {/* Hourly breakdown */}
            {d.entries && d.entries.length > 0 ? (
              <div className="border-t border-white/10 pt-3">
                <div className="text-xs text-gray-500 mb-2 font-medium">Hourly</div>
                <div className="space-y-2">
                  {d.entries.slice(0, 3).map((e: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">
                        {e.dt ? new Date(e.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : e.dt_txt}
                      </span>
                      <span className="font-semibold text-white">
                        {e.main?.temp ? Math.round(e.main.temp) + "°" : "-"}
                      </span>
                      <span className="text-gray-500 capitalize truncate max-w-[60px]">
                        {e.weather?.[0]?.description ?? ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
