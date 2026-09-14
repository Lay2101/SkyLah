import React from "react";
import { Info, Radio } from "lucide-react";

export const DisclaimerBanner: React.FC = () => {
  return (
    <div
      id="weather-provenance-banner"
      className="bg-sky-50 border-b border-sky-200 px-4 py-2 text-slate-800 flex items-center justify-between gap-3 shadow-xs"
      role="note"
      aria-label="Data Sourcing Notice"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Radio className="w-4 h-4 text-sky-700 shrink-0 animate-pulse" aria-hidden="true" />
        <p className="text-xs sm:text-sm font-medium text-slate-700 leading-snug">
          <strong className="text-sky-900 font-semibold">Live 2-Hour Forecast</strong> sourced directly from Singapore data.gov.sg (NEA/MSS). Temperature, humidity, rain chance %, and 12-hour predictions are demo values.
        </p>
      </div>
      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-300 shrink-0">
        Live Sourced
      </span>
    </div>
  );
};
