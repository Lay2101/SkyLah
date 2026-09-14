import React from "react";
import {
  Clock,
  Sparkles,
  Droplets,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import {
  getHourlyForecastsForArea,
  deriveLowestRainHour,
  FIXED_DEMO_DATE,
} from "../data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyScreenProps {
  selectedAreaName: string;
  allAreas: Array<{ name: string; forecast: string }>;
  onSelectArea: (areaName: string) => void;
}

export const HourlyScreen: React.FC<HourlyScreenProps> = ({
  selectedAreaName,
  allAreas,
  onSelectArea,
}) => {
  const hourlyRows = getHourlyForecastsForArea(selectedAreaName);
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
              {selectedAreaName}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {FIXED_DEMO_DATE} &bull; 12 Consecutive Hours (SGT)
            </p>
          </div>

          <div className="sm:w-64">
            <label htmlFor="hourly-neighbourhood-select" className="sr-only">
              Switch area
            </label>
            <select
              id="hourly-neighbourhood-select"
              value={selectedAreaName}
              onChange={(e) => onSelectArea(e.target.value)}
              className="w-full min-h-[44px] text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:border-sky-600 focus:outline-hidden focus:ring-2 focus:ring-sky-100"
            >
              {allAreas.length === 0 ? (
                <option value={selectedAreaName}>{selectedAreaName}</option>
              ) : (
                allAreas.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Clear Notice: Fictional Demo Data */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-amber-900 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 font-medium">
          <Layers className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Demo — fictional data:</strong> The 2-hour weather API does not supply a 12-hour hourly forecast. The timeline below displays prototype simulation data.
          </span>
        </div>
      </section>

      {/* Best Time to Head Out Recommendation Card */}
      {bestHour && (
        <section
          id="lowest-rain-hour-highlight"
          className="bg-emerald-50 border-2 border-emerald-600 rounded-2xl p-4 sm:p-5 text-emerald-950 shadow-xs"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recommended Window
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                Lowest rain risk at {bestHour.hour}
              </h2>
              <p className="text-sm text-emerald-900 mt-1">
                Chance of rain is just{" "}
                <span className="font-extrabold text-emerald-950 text-base">
                  {bestHour.rainChancePercent}%
                </span>{" "}
                with {bestHour.condition} skies and {bestHour.temperatureC}°C.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Hourly Timeline List */}
      <section
        id="hourly-forecast-list"
        aria-label="12-Hour Hourly Forecast Timeline"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            12-Hour Projection (SGT)
          </span>
          <span className="text-xs text-slate-500 font-medium">
            12 Consecutive Hours
          </span>
        </div>

        <ul className="divide-y divide-slate-100" role="list">
          {hourlyRows.map((row) => {
            const isLowest = bestHour?.id === row.id;

            return (
              <li
                key={row.id}
                id={`hour-row-${row.hour.replace(/\s+/g, "-").replace(/:/g, "")}`}
                className={`p-3.5 sm:p-4 transition-colors flex items-center justify-between gap-3 ${
                  isLowest
                    ? "bg-emerald-50/70 border-l-4 border-emerald-600 font-medium"
                    : "hover:bg-slate-50/80"
                }`}
              >
                {/* Time & Condition */}
                <div className="flex items-center gap-3 min-w-[130px] sm:min-w-[160px]">
                  <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                    <WeatherIcon condition={row.condition} className="w-6 h-6" size={24} />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{row.hour}</span>
                      {isLowest && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.2 rounded-sm">
                          Best
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {row.condition}
                    </div>
                  </div>
                </div>

                {/* Rain Probability with Visual Bar */}
                <div className="flex-1 max-w-[140px] sm:max-w-[200px] px-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      Rain
                    </span>
                    <span
                      className={`font-bold ${
                        row.rainChancePercent >= 60
                          ? "text-rose-700 font-extrabold"
                          : row.rainChancePercent >= 30
                          ? "text-amber-700 font-bold"
                          : "text-emerald-700 font-bold"
                      }`}
                    >
                      {row.rainChancePercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        row.rainChancePercent >= 60
                          ? "bg-rose-500"
                          : row.rainChancePercent >= 30
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${row.rainChancePercent}%` }}
                    />
                  </div>
                </div>

                {/* Temperature in °C */}
                <div className="text-right shrink-0 min-w-[50px]">
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {row.temperatureC}°C
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase">
                    Temp
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
