import React, { useState } from "react";
import {
  MapPin,
  ChevronRight,
  Droplets,
  Umbrella,
  Check,
  Search,
  Layers,
  Clock,
} from "lucide-react";
import {
  getDemoMetricsForArea,
  deriveUmbrellaSuggestion,
  formatSingaporeTime,
} from "../data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface LocationsScreenProps {
  selectedAreaName: string;
  allAreas: Array<{ name: string; forecast: string }>;
  onSelectAreaAndOpenToday: (areaName: string) => void;
  isLoading: boolean;
  validPeriod: { start: string | null; end: string | null; text: string | null } | null;
}

export const LocationsScreen: React.FC<LocationsScreenProps> = ({
  selectedAreaName,
  allAreas,
  onSelectAreaAndOpenToday,
  isLoading,
  validPeriod,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAreas = allAreas.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <section
        id="locations-header-card"
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-700" aria-hidden="true" />
            <span>Singapore Areas Comparison</span>
          </h1>
          {validPeriod && (
            <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Valid: {validPeriod.text || `${formatSingaporeTime(validPeriod.start)} - ${formatSingaporeTime(validPeriod.end)}`}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Comparing real-time 2-hour forecasts from data.gov.sg across {allAreas.length} Singapore forecast areas. Tap any area to open its Today forecast.
        </p>

        {/* Search input for quick lookup among 47 areas */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="locations-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Singapore area (e.g. City, Bedok, Jurong)..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-sky-600 focus:outline-hidden focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-1">
          <Layers className="w-3 h-3 text-amber-600" />
          <span>Weather conditions are real-time from data.gov.sg; temperature & rain chance are demo metrics.</span>
        </div>
      </section>

      {/* Loading state */}
      {isLoading && allAreas.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-600">
          <p className="text-base font-semibold">Loading Singapore forecast areas…</p>
        </div>
      )}

      {/* Grid / List of Areas */}
      <section
        id="neighbourhoods-comparison-list"
        aria-label="Singapore Forecast Areas"
        className="space-y-2.5"
      >
        {filteredAreas.map((area) => {
          const isSelected = area.name.toLowerCase() === selectedAreaName.toLowerCase();
          const demoMetrics = getDemoMetricsForArea(area.name);
          const umbrella = deriveUmbrellaSuggestion(
            demoMetrics.rainChancePercent,
            area.forecast
          );

          return (
            <button
              key={area.name}
              id={`area-card-${area.name.toLowerCase().replace(/\s+/g, "-")}`}
              type="button"
              onClick={() => onSelectAreaAndOpenToday(area.name)}
              className={`w-full text-left rounded-2xl p-4 border transition-all cursor-pointer min-h-[88px] relative flex flex-col justify-between ${
                isSelected
                  ? "bg-sky-50/90 border-sky-600 ring-2 ring-sky-300 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
              }`}
            >
              {/* Top Row: Name, Current Selection Indicator, Chevron */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base sm:text-lg font-bold text-slate-900 truncate">
                    {area.name}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-sky-700 text-white px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                    View
                  </span>
                  <ChevronRight className="w-5 h-5 text-sky-700" aria-hidden="true" />
                </div>
              </div>

              {/* Middle Row: Real 2-Hour Forecast & Demo metrics */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                {/* Real Condition */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg shrink-0">
                    <WeatherIcon condition={area.forecast} className="w-5 h-5" size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {area.forecast}
                    </span>
                    <span className="text-[10px] text-sky-700 font-semibold uppercase">
                      Next 2 Hours
                    </span>
                  </div>
                </div>

                {/* Demo Rain Chance & Temp */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span className="font-bold">{demoMetrics.rainChancePercent}%</span>
                    <span className="text-[10px] text-slate-400">(demo)</span>
                  </div>

                  <div className="font-extrabold text-slate-900 text-sm">
                    {demoMetrics.temperatureC}°C
                    <span className="text-[10px] text-slate-400 font-normal"> (demo)</span>
                  </div>
                </div>

                {/* Umbrella Recommendation Pill */}
                <div
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shrink-0 ${
                    umbrella.status === "needed"
                      ? "bg-rose-100 text-rose-900"
                      : umbrella.status === "handy"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-emerald-100 text-emerald-900"
                  }`}
                >
                  <Umbrella className="w-3 h-3" />
                  <span>{umbrella.shortAction}</span>
                </div>
              </div>
            </button>
          );
        })}

        {filteredAreas.length === 0 && (
          <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-sm">
            No Singapore forecast areas matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </section>
    </div>
  );
};
