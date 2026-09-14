import React from "react";
import {
  Umbrella,
  Droplets,
  Thermometer,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import {
  NeighbourhoodWeather,
  NEIGHBOURHOODS,
  deriveUmbrellaSuggestion,
  FIXED_DEMO_DATE,
} from "../data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface TodayScreenProps {
  selectedNeighbourhood: NeighbourhoodWeather;
  onSelectNeighbourhood: (neighbourhoodId: string) => void;
  onNavigateToHourly: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  selectedNeighbourhood,
  onSelectNeighbourhood,
  onNavigateToHourly,
}) => {
  const current = selectedNeighbourhood.current;
  const umbrellaSuggestion = deriveUmbrellaSuggestion(
    current.rainChancePercent,
    current.condition
  );

  return (
    <div className="space-y-5 pb-4">
      {/* Location Selector */}
      <section
        id="location-selector-section"
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs"
      >
        <label
          htmlFor="neighbourhood-select"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"
        >
          <MapPin className="w-4 h-4 text-sky-700" aria-hidden="true" />
          Select Singapore Neighbourhood
        </label>
        
        <div className="relative">
          <select
            id="neighbourhood-select"
            value={selectedNeighbourhood.id}
            onChange={(e) => onSelectNeighbourhood(e.target.value)}
            className="w-full min-h-[52px] text-lg font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-3 focus:ring-sky-100 transition-colors"
          >
            {NEIGHBOURHOODS.map((item) => (
              <option key={item.id} value={item.id} className="text-base py-1">
                {item.name} ({item.tagline})
              </option>
            ))}
          </select>
        </div>

        {/* Fast Tap Chips for 6 neighbourhoods */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium mb-2">Quick tap:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NEIGHBOURHOODS.map((item) => {
              const isSelected = item.id === selectedNeighbourhood.id;
              return (
                <button
                  key={item.id}
                  id={`quick-select-${item.id}`}
                  onClick={() => onSelectNeighbourhood(item.id)}
                  type="button"
                  className={`min-h-[44px] px-3 py-2 text-left text-sm font-medium rounded-lg border transition-all flex items-center justify-between gap-1 ${
                    isSelected
                      ? "bg-sky-700 text-white border-sky-700 font-semibold shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-sm shrink-0 ${
                      isSelected
                        ? "bg-sky-800 text-sky-100"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.current.temperatureC}°
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected Location Current Weather Card */}
      <section
        id="today-weather-summary-card"
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden"
      >
        {/* Header with location & date */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Current Conditions
            </span>
            <span className="text-xs font-medium text-slate-500">
              {FIXED_DEMO_DATE}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-700 shrink-0" aria-hidden="true" />
            <span>{selectedNeighbourhood.name}</span>
          </h1>
          <p className="text-sm text-slate-500 pl-8">{selectedNeighbourhood.tagline}</p>
        </div>

        {/* Main Weather Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
          {/* Temperature & Condition */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 shrink-0">
              <WeatherIcon condition={current.condition} className="w-10 h-10" size={40} />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                  {current.temperatureC}
                </span>
                <span className="text-2xl font-semibold text-slate-700 ml-0.5">°C</span>
              </div>
              <div className="text-base font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <span>{current.condition}</span>
              </div>
            </div>
          </div>

          {/* Chance of Rain */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="p-3 bg-sky-100 rounded-xl shadow-xs border border-sky-200 shrink-0">
              <Droplets className="w-10 h-10 text-sky-700" aria-hidden="true" />
            </div>
            <div className="w-full">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Chance of Rain
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-sky-900 tracking-tight">
                  {current.rainChancePercent}
                </span>
                <span className="text-2xl font-semibold text-sky-800">%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    current.rainChancePercent >= 60
                      ? "bg-blue-600"
                      : current.rainChancePercent >= 30
                      ? "bg-sky-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${current.rainChancePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Info row */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100/70 px-3 py-2 rounded-lg mt-3">
          <span className="flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-slate-500" />
            Feels like {current.temperatureC + 2}°C with tropical humidity ({current.humidityPercent}%)
          </span>
          <span className="font-semibold text-slate-700">Singapore Time (SGT)</span>
        </div>
      </section>

      {/* Umbrella Recommendation Card (Derived Directly from Rain Chance Data) */}
      <section
        id="umbrella-suggestion-card"
        className={`rounded-2xl p-5 border-2 shadow-xs transition-colors ${
          umbrellaSuggestion.status === "needed"
            ? "bg-rose-50 border-rose-300 text-rose-950"
            : umbrellaSuggestion.status === "handy"
            ? "bg-amber-50 border-amber-300 text-amber-950"
            : "bg-emerald-50 border-emerald-300 text-emerald-950"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              umbrellaSuggestion.status === "needed"
                ? "bg-rose-600 text-white"
                : umbrellaSuggestion.status === "handy"
                ? "bg-amber-500 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            <Umbrella className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-current">
                Umbrella Recommendation
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  umbrellaSuggestion.status === "needed"
                    ? "bg-rose-200 text-rose-900"
                    : umbrellaSuggestion.status === "handy"
                    ? "bg-amber-200 text-amber-900"
                    : "bg-emerald-200 text-emerald-900"
                }`}
              >
                {umbrellaSuggestion.badgeText}
              </span>
            </div>

            <p className="text-lg sm:text-xl font-bold mt-1.5 leading-snug">
              {umbrellaSuggestion.recommendation}
            </p>

            <p className="text-xs sm:text-sm mt-1 opacity-90">
              Based on {current.rainChancePercent}% rain probability and &ldquo;{current.condition}&rdquo; in {selectedNeighbourhood.name}.
            </p>
          </div>
        </div>
      </section>

      {/* Action to review next 12 hours */}
      <div className="pt-1">
        <button
          id="btn-goto-hourly-forecast"
          type="button"
          onClick={onNavigateToHourly}
          className="w-full min-h-[52px] bg-sky-800 hover:bg-sky-900 text-white font-bold text-base px-5 py-3 rounded-xl flex items-center justify-between transition-colors shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-200" aria-hidden="true" />
            <span>Check Next 12 Hours (Find Best Time to Head Out)</span>
          </span>
          <ArrowRight className="w-5 h-5 text-sky-200 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
