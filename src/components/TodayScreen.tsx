import React from "react";
import {
  Umbrella,
  Droplets,
  MapPin,
  Clock,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import {
  formatSingaporeTime,
  isForecastExpired,
  getDemoMetricsForArea,
  deriveUmbrellaSuggestion,
} from "../data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface TodayScreenProps {
  selectedAreaName: string;
  allAreas: Array<{ name: string; forecast: string }>;
  onSelectArea: (areaName: string) => void;
  onNavigateToHourly: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  validPeriod: { start: string | null; end: string | null; text: string | null } | null;
  sourceTimestamps: { updateTimestamp: string | null; timestamp: string | null } | null;
  onRetry?: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  selectedAreaName,
  allAreas,
  onSelectArea,
  onNavigateToHourly,
  isLoading,
  errorMessage,
  validPeriod,
  sourceTimestamps,
  onRetry,
}) => {
  // Find current area forecast
  const currentArea = allAreas.find(
    (a) => a.name.toLowerCase() === selectedAreaName.toLowerCase()
  );
  const realForecastText = currentArea?.forecast || "";
  const isExpired = isForecastExpired(validPeriod?.end);

  // Demo values (strictly separated and labelled)
  const demoMetrics = getDemoMetricsForArea(selectedAreaName);
  const demoUmbrella = deriveUmbrellaSuggestion(
    demoMetrics.rainChancePercent,
    realForecastText || "Cloudy"
  );

  // Quick popular areas for 1-tap switching
  const quickAreas = ["City", "Ang Mo Kio", "Bedok", "Bishan", "Jurong East", "Woodlands"];

  return (
    <div className="space-y-5 pb-4">
      {/* Location Selector (from API actual forecast areas) */}
      <section
        id="location-selector-section"
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs"
      >
        <label
          htmlFor="neighbourhood-select"
          className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"
        >
          <MapPin className="w-4 h-4 text-sky-700" aria-hidden="true" />
          Select Forecast Area (Singapore data.gov.sg)
        </label>

        <div className="relative">
          <select
            id="neighbourhood-select"
            value={selectedAreaName}
            onChange={(e) => onSelectArea(e.target.value)}
            disabled={allAreas.length === 0}
            className="w-full min-h-[52px] text-lg font-bold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-2.5 focus:border-sky-600 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-sky-100 transition-colors"
          >
            {allAreas.length === 0 ? (
              <option value="City">City (Loading forecast areas...)</option>
            ) : (
              allAreas.map((item) => (
                <option key={item.name} value={item.name} className="text-base py-1">
                  {item.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Quick Tap Area Chips */}
        {allAreas.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-2">Quick switch area:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickAreas.map((areaName) => {
                const isSelected = selectedAreaName.toLowerCase() === areaName.toLowerCase();
                const exists = allAreas.some((a) => a.name.toLowerCase() === areaName.toLowerCase());
                if (!exists) return null;

                return (
                  <button
                    key={areaName}
                    id={`quick-select-${areaName.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => onSelectArea(areaName)}
                    type="button"
                    className={`min-h-[44px] px-3 py-2 text-left text-sm font-medium rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-sky-700 text-white border-sky-700 font-semibold shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate">{areaName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Connected 2-Hour Weather Forecast Card */}
      <section
        id="today-weather-summary-card"
        className="bg-white rounded-2xl border-2 border-sky-600 p-5 shadow-xs relative overflow-hidden"
      >
        {/* Header with location & connection badge */}
        <div className="border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-900 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
              Next 2 Hours
            </span>
            {sourceTimestamps?.updateTimestamp && (
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Updated: {formatSingaporeTime(sourceTimestamps.updateTimestamp)} SGT
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-sky-700 shrink-0" aria-hidden="true" />
            <span>{selectedAreaName}</span>
          </h1>

          {/* Validity Period in Singapore Time */}
          {validPeriod && (
            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-sky-700 shrink-0" />
              <span>
                Forecast Validity:{" "}
                <strong className="text-slate-800 font-semibold">
                  {validPeriod.text
                    ? `${validPeriod.text} SGT`
                    : `${formatSingaporeTime(validPeriod.start)} to ${formatSingaporeTime(validPeriod.end)} SGT`}
                </strong>
              </span>
            </p>
          )}
        </div>

        {/* Expired Forecast Banner */}
        {isExpired && (
          <div
            id="forecast-expired-alert"
            className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 flex items-start gap-2.5 text-sm"
          >
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Forecast Status</p>
              <p className="mt-0.5 text-xs sm:text-sm">
                This forecast has expired; an updated forecast is not available yet.
              </p>
            </div>
          </div>
        )}

        {/* State 1: Loading */}
        {isLoading && (
          <div
            id="weather-loading-state"
            className="py-10 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="flex justify-center">
              <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              Getting the latest two-hour forecast…
            </p>
          </div>
        )}

        {/* State 2: Error (never substitute fictional data) */}
        {!isLoading && errorMessage && (
          <div
            id="weather-error-state"
            className="py-8 px-4 text-center space-y-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950"
          >
            <div className="flex justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            </div>
            <p className="text-base font-bold leading-relaxed max-w-sm mx-auto">
              {errorMessage}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-2 min-h-[44px] px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}
          </div>
        )}

        {/* State 3: Empty forecast */}
        {!isLoading && !errorMessage && !realForecastText && (
          <div
            id="weather-empty-state"
            className="py-8 px-4 text-center space-y-2 bg-slate-50 rounded-xl border border-slate-200"
          >
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-base font-semibold text-slate-700">
              No forecast is available for this area right now.
            </p>
          </div>
        )}

        {/* State 4: Real Forecast Display */}
        {!isLoading && !errorMessage && realForecastText && (
          <div className="bg-sky-50/60 p-4 sm:p-5 rounded-xl border border-sky-200">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-800 mb-2">
              Official 2-Hour Weather Description
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-sky-100 shrink-0">
                <WeatherIcon condition={realForecastText} className="w-12 h-12" size={48} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {realForecastText}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  Source: data.gov.sg 2-Hour Weather Forecast
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Visually Separate Demo Metrics Section (Fictional Demo Data) */}
      <section
        id="demo-metrics-section"
        className="bg-white rounded-2xl border border-dashed border-slate-300 p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <Layers className="w-3.5 h-3.5" />
            Demo — fictional data
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Not supplied by 2-hour API
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The official 2-hour weather API does not supply temperature, humidity, rain probability, or umbrella suggestions. The values below are mock demo metrics kept for prototyping:
        </p>

        {/* Demo Temperature & Chance of Rain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Temperature */}
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 shrink-0">
              <span className="text-xl font-bold text-slate-700">°C</span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Demo Temperature
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {demoMetrics.temperatureC}°C
              </div>
              <div className="text-[11px] text-slate-500">
                Humidity: {demoMetrics.humidityPercent}% (demo)
              </div>
            </div>
          </div>

          {/* Rain Probability */}
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="p-2.5 bg-sky-100 rounded-lg border border-sky-200 shrink-0">
              <Droplets className="w-5 h-5 text-sky-700" aria-hidden="true" />
            </div>
            <div className="w-full">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Demo Rain Probability
              </div>
              <div className="text-2xl font-extrabold text-sky-900">
                {demoMetrics.rainChancePercent}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{ width: `${demoMetrics.rainChancePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Umbrella Recommendation Card (Explicitly flagged as derived from demo metrics) */}
        <div
          id="umbrella-suggestion-card"
          className={`rounded-xl p-4 border transition-colors ${
            demoUmbrella.status === "needed"
              ? "bg-rose-50/80 border-rose-200 text-rose-950"
              : demoUmbrella.status === "handy"
              ? "bg-amber-50/80 border-amber-200 text-amber-950"
              : "bg-emerald-50/80 border-emerald-200 text-emerald-950"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                demoUmbrella.status === "needed"
                  ? "bg-rose-600 text-white"
                  : demoUmbrella.status === "handy"
                  ? "bg-amber-500 text-white"
                  : "bg-emerald-600 text-white"
              }`}
            >
              <Umbrella className="w-6 h-6" aria-hidden="true" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 border border-current">
                  Demo Umbrella Guide
                </span>
                <span className="text-xs font-semibold">
                  {demoUmbrella.badgeText}
                </span>
              </div>

              <p className="text-base sm:text-lg font-bold mt-1 leading-snug">
                {demoUmbrella.recommendation}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                Note: Derived strictly from fictional demo chance of rain ({demoMetrics.rainChancePercent}%), not from the official 2-hour weather forecast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Button to check Next 12 Hours */}
      <div className="pt-1">
        <button
          id="btn-goto-hourly-forecast"
          type="button"
          onClick={onNavigateToHourly}
          className="w-full min-h-[52px] bg-sky-800 hover:bg-sky-900 text-white font-bold text-base px-5 py-3 rounded-xl flex items-center justify-between transition-colors shadow-xs"
        >
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-200" aria-hidden="true" />
            <span>Check Next 12 Hours (Demo Projection)</span>
          </span>
          <ArrowRight className="w-5 h-5 text-sky-200 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
