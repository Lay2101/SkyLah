import React from "react";
import { Info } from "lucide-react";
import { DEMO_DISCLAIMER, FIXED_DEMO_DATE } from "../data/weatherData";

export const DisclaimerBanner: React.FC = () => {
  return (
    <div
      id="demo-disclaimer-banner"
      className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-amber-950 flex items-center justify-between gap-2 shadow-xs"
      role="note"
      aria-label="Demo Disclaimer"
    >
      <div className="flex items-center gap-2">
        <Info className="w-5 h-5 text-amber-800 shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold tracking-tight leading-tight">
          {DEMO_DISCLAIMER}
        </span>
      </div>
      <span className="hidden sm:inline-block text-xs font-medium bg-amber-200 text-amber-900 px-2 py-0.5 rounded-sm">
        {FIXED_DEMO_DATE}
      </span>
    </div>
  );
};
