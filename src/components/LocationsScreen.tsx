import React from "react";
import {
  MapPin,
  ChevronRight,
  Droplets,
  Umbrella,
  Check,
} from "lucide-react";
import {
  NeighbourhoodWeather,
  NEIGHBOURHOODS,
  deriveUmbrellaSuggestion,
} from "../data/weatherData";
import { WeatherIcon } from "./WeatherIcon";

interface LocationsScreenProps {
  selectedNeighbourhoodId: string;
  onSelectNeighbourhoodAndOpenToday: (neighbourhoodId: string) => void;
}

export const LocationsScreen: React.FC<LocationsScreenProps> = ({
  selectedNeighbourhoodId,
  onSelectNeighbourhoodAndOpenToday,
}) => {
  return (
    <div className="space-y-4 pb-6">
      {/* Screen Header */}
      <section
        id="locations-header-card"
        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-sky-700" aria-hidden="true" />
          <span>My Locations Comparison</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compare current weather and rain chances across all 6 fictional Singapore neighbourhoods. Tap any location to view its detailed Today screen.
        </p>
      </section>

      {/* Grid / List of Neighbourhoods */}
      <section
        id="neighbourhoods-comparison-list"
        aria-label="Neighbourhood Weather Comparison"
        className="space-y-3"
      >
        {NEIGHBOURHOODS.map((neighbourhood) => {
          const isSelected = neighbourhood.id === selectedNeighbourhoodId;
          const umbrella = deriveUmbrellaSuggestion(
            neighbourhood.current.rainChancePercent,
            neighbourhood.current.condition
          );

          return (
            <button
              key={neighbourhood.id}
              id={`neighbourhood-card-${neighbourhood.id}`}
              type="button"
              onClick={() => onSelectNeighbourhoodAndOpenToday(neighbourhood.id)}
              className={`w-full text-left rounded-2xl p-4 border transition-all cursor-pointer min-h-[96px] relative flex flex-col justify-between ${
                isSelected
                  ? "bg-sky-50/80 border-sky-600 ring-2 ring-sky-300 shadow-sm"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
              }`}
            >
              {/* Top Row: Name, Current Selection Indicator, Chevron */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base sm:text-lg font-bold text-slate-900 truncate">
                    {neighbourhood.name}
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-bold bg-sky-700 text-white px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-sky-800 font-semibold shrink-0">
                  <span>View Today</span>
                  <ChevronRight className="w-4 h-4 text-sky-700" aria-hidden="true" />
                </div>
              </div>

              <div className="text-xs text-slate-500 -mt-1">
                {neighbourhood.tagline}
              </div>

              {/* Middle Row: Weather condition, Temp, Rain chance */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 items-center">
                {/* Condition */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-50 rounded-lg shrink-0 border border-slate-100">
                    <WeatherIcon
                      condition={neighbourhood.current.condition}
                      className="w-5 h-5"
                      size={20}
                    />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {neighbourhood.current.condition}
                  </div>
                </div>

                {/* Temperature */}
                <div className="text-center">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {neighbourhood.current.temperatureC}°C
                  </span>
                </div>

                {/* Rain Chance */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Droplets
                      className={`w-3.5 h-3.5 ${
                        neighbourhood.current.rainChancePercent >= 60
                          ? "text-blue-600"
                          : neighbourhood.current.rainChancePercent >= 30
                          ? "text-sky-500"
                          : "text-emerald-500"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-base sm:text-lg font-extrabold ${
                        neighbourhood.current.rainChancePercent >= 60
                          ? "text-blue-900"
                          : neighbourhood.current.rainChancePercent >= 30
                          ? "text-slate-800"
                          : "text-emerald-800"
                      }`}
                    >
                      {neighbourhood.current.rainChancePercent}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">
                    rain chance
                  </div>
                </div>
              </div>

              {/* Bottom Row: Umbrella pill */}
              <div className="mt-2.5 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ${
                    umbrella.status === "needed"
                      ? "bg-rose-100 text-rose-900 border border-rose-200"
                      : umbrella.status === "handy"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                  }`}
                >
                  <Umbrella className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{umbrella.shortAction}</span>
                </span>

                <span className="text-[11px] text-slate-400 font-medium">
                  Tap card to switch
                </span>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
};
