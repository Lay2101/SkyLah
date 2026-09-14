import React from "react";
import {
  Clock,
  Sparkles,
  Droplets,
  MapPin,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  NeighbourhoodWeather,
  NEIGHBOURHOODS,
  getHourlyForecastsForNeighbourhood,
  deriveLowestRainHour,
  FIXED_DEMO_DATE,
} from "../data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyScreenProps {
  selectedNeighbourhood: NeighbourhoodWeather;
  onSelectNeighbourhood: (neighbourhoodId: string) => void;
}

export const HourlyScreen: React.FC<HourlyScreenProps> = ({
  selectedNeighbourhood,
  onSelectNeighbourhood,
}) => {
  const hourlyRows = getHourlyForecastsForNeighbourhood(selectedNeighbourhood.id);
  const bestHour = deriveLowestRainHour(hourlyRows);

  return (
    <div className="space-y-4 pb-6">
      {/* Location Bar & Switcher */}
      <section
        id="hourly-location-header"
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-800">
              <MapPin className="w-4 h-4 text-sky-700" />
              <span>Forecast Location</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {selectedNeighbourhood.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {FIXED_DEMO_DATE} &bull; 12 Consecutive Hours (SGT)
            </p>
          </div>

          <div className="sm:w-64">
            <label htmlFor="hourly-neighbourhood-select" className="sr-only">
              Switch neighbourhood
            </label>
            <select
              id="hourly-neighbourhood-select"
              value={selectedNeighbourhood.id}
              onChange={(e) => onSelectNeighbourhood(e.target.value)}
              className="w-full min-h-[44px] text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:border-sky-600 focus:bg-white focus:outline-none"
            >
              {NEIGHBOURHOODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.current.condition})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Best Time to Head Out Recommendation Highlight Box */}
      {bestHour && (
        <section
          id="best-hour-callout-card"
          className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-wide bg-emerald-700 text-white px-2 py-0.5 rounded-sm">
                  Recommended Head-Out Window
                </span>
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Lowest Rain Probability
                </span>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
                    {bestHour.hour}
                  </span>
                  <span className="text-sm font-medium text-emerald-900 ml-2">
                    ({bestHour.condition}, {bestHour.temperatureC}°C)
                  </span>
                </div>
                <div className="text-sm font-bold text-emerald-900 bg-white/90 border border-emerald-300 px-3 py-1 rounded-lg shrink-0 self-start sm:self-auto">
                  Only {bestHour.rainChancePercent}% rain chance
                </div>
              </div>

              <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
                If you are planning outdoor activities or commuting in{" "}
                <strong className="font-semibold">{selectedNeighbourhood.name}</strong>, this is your driest window within the next 12 hours.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Hourly Forecast Table / List */}
      <section
        id="hourly-forecast-list"
        aria-label="Next 12 Hours Forecast"
        className="space-y-2.5"
      >
        <div className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>12-Hour Timeline</span>
          <span>Time &bull; Condition &bull; Rain Risk</span>
        </div>

        {hourlyRows.map((row) => {
          const isBestHour = bestHour?.id === row.id;

          return (
            <div
              key={row.id}
              id={`hourly-row-${row.id}`}
              className={`rounded-xl p-3.5 sm:p-4 border transition-all ${
                isBestHour
                  ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-400 shadow-sm"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Time & Highlight Badge */}
                <div className="w-28 sm:w-36 shrink-0">
                  <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-slate-900">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{row.hour}</span>
                  </div>
                  {isBestHour ? (
                    <span className="inline-block mt-0.5 text-[11px] font-extrabold uppercase tracking-tight bg-emerald-600 text-white px-1.5 py-0.5 rounded-sm">
                      Driest Hour
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Singapore Time</span>
                  )}
                </div>

                {/* Weather Condition & Icon */}
                <div className="flex-1 flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-slate-50 rounded-lg shrink-0 border border-slate-100">
                    <WeatherIcon condition={row.condition} className="w-6 h-6" size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                      {row.condition}
                    </div>
                    <div className="text-xs text-slate-500">
                      {row.temperatureC}°C
                    </div>
                  </div>
                </div>

                {/* Rain Probability Badge */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1">
                    <Droplets
                      className={`w-4 h-4 ${
                        row.rainChancePercent >= 60
                          ? "text-blue-600"
                          : row.rainChancePercent >= 30
                          ? "text-sky-500"
                          : "text-emerald-500"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-base sm:text-lg font-extrabold ${
                        row.rainChancePercent >= 60
                          ? "text-blue-900"
                          : row.rainChancePercent >= 30
                          ? "text-slate-800"
                          : "text-emerald-800"
                      }`}
                    >
                      {row.rainChancePercent}%
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    rain chance
                  </div>
                </div>
              </div>

              {/* Progress bar visual for rain probability */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    row.rainChancePercent >= 60
                      ? "bg-blue-600"
                      : row.rainChancePercent >= 30
                      ? "bg-sky-400"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${Math.max(row.rainChancePercent, 6)}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
