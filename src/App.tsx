import React, { useState, useEffect, useCallback } from "react";
import { AppHeader } from "./components/AppHeader";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { Navigation, ScreenId } from "./components/Navigation";
import { TodayScreen, ForecastState } from "./components/TodayScreen";
import { HourlyScreen } from "./components/HourlyScreen";
import { LocationsScreen } from "./components/LocationsScreen";
import { FooterAttribution } from "./components/FooterAttribution";

export interface WeatherArea {
  name: string;
  forecast: string;
}

export interface WeatherDataResponse {
  areas: WeatherArea[];
  sourceTimestamps: {
    updateTimestamp: string | null;
    timestamp: string | null;
  } | null;
  validPeriod: {
    start: string | null;
    end: string | null;
    text: string | null;
  } | null;
  retrievedAt: string;
  empty?: boolean;
}

export default function App() {
  const [selectedAreaName, setSelectedAreaName] = useState<string>("City");
  const [activeScreen, setActiveScreen] = useState<ScreenId>("today");

  // Four explicit states: loading, empty, refused, unreachable (or success with real data)
  const [forecastState, setForecastState] = useState<ForecastState>("loading");
  const [statusSentence, setStatusSentence] = useState<string>(
    "Getting the latest two-hour forecast…"
  );

  // Real weather API state
  const [areas, setAreas] = useState<WeatherArea[]>([]);
  const [sourceTimestamps, setSourceTimestamps] = useState<{
    updateTimestamp: string | null;
    timestamp: string | null;
  } | null>(null);
  const [validPeriod, setValidPeriod] = useState<{
    start: string | null;
    end: string | null;
    text: string | null;
  } | null>(null);
  const [retrievedAt, setRetrievedAt] = useState<string | null>(null);

  // Fetch all areas once on mount from our serverless function
  const fetchWeather = useCallback(async () => {
    setForecastState("loading");
    setStatusSentence("Getting the latest two-hour forecast…");

    try {
      // Calls our dedicated serverless function
      const response = await fetch("/api/skylahweatherforecasting");

      if (!response.ok) {
        if (response.status === 503 || response.status === 504 || response.status === 502) {
          // Case 4: Upstream is unreachable
          setForecastState("unreachable");
          setStatusSentence("We couldn’t reach the weather service. Please try again shortly.");
        } else {
          // Case 3: Upstream refused (401, 403, 429, etc.)
          setForecastState("refused");
          setStatusSentence("The weather service declined this request. Please try again later.");
        }
        return;
      }

      const data: WeatherDataResponse = await response.json();

      if (data.empty || !Array.isArray(data.areas) || data.areas.length === 0) {
        // Case 2: Data is empty
        setForecastState("empty");
        setStatusSentence("No forecast is available for this area right now.");
        setAreas([]);
        return;
      }

      // Success with live real forecast data
      setForecastState("success");
      setStatusSentence("");
      setAreas(data.areas);
      setSourceTimestamps(data.sourceTimestamps || null);
      setValidPeriod(data.validPeriod || null);
      setRetrievedAt(data.retrievedAt || new Date().toISOString());

      // Default to "City" if available, else first area
      setSelectedAreaName((current) => {
        const hasCity = data.areas.some(
          (a) => a.name.toLowerCase() === "city"
        );
        if (hasCity) return "City";
        const exists = data.areas.some(
          (a) => a.name.toLowerCase() === current.toLowerCase()
        );
        return exists ? current : data.areas[0].name;
      });
    } catch (_err) {
      // Case 4: Network error / unreachable
      setForecastState("unreachable");
      setStatusSentence("We couldn’t reach the weather service. Please try again shortly.");
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSelectArea = (areaName: string) => {
    setSelectedAreaName(areaName);
  };

  const handleSelectAreaAndOpenToday = (areaName: string) => {
    setSelectedAreaName(areaName);
    setActiveScreen("today");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Header with Selected Location */}
      <AppHeader
        selectedAreaName={selectedAreaName}
        onOpenLocations={() => setActiveScreen("locations")}
      />

      {/* Prominent Demo Disclaimer - Displayed on Every Screen */}
      <DisclaimerBanner />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-24">
        {activeScreen === "today" && (
          <TodayScreen
            selectedAreaName={selectedAreaName}
            allAreas={areas}
            onSelectArea={handleSelectArea}
            onNavigateToHourly={() => setActiveScreen("hourly")}
            forecastState={forecastState}
            statusSentence={statusSentence}
            isLoading={forecastState === "loading"}
            errorMessage={
              forecastState === "refused" || forecastState === "unreachable"
                ? statusSentence
                : null
            }
            validPeriod={validPeriod}
            sourceTimestamps={sourceTimestamps}
            onRetry={fetchWeather}
          />
        )}

        {activeScreen === "hourly" && (
          <HourlyScreen
            selectedAreaName={selectedAreaName}
            allAreas={areas}
            onSelectArea={handleSelectArea}
          />
        )}

        {activeScreen === "locations" && (
          <LocationsScreen
            selectedAreaName={selectedAreaName}
            allAreas={areas}
            onSelectAreaAndOpenToday={handleSelectAreaAndOpenToday}
            isLoading={forecastState === "loading"}
            validPeriod={validPeriod}
          />
        )}

        {/* Singapore data.gov.sg attribution footer */}
        <FooterAttribution retrievedAt={retrievedAt} />
      </main>

      {/* Persistent Bottom Tab Navigation for Mobile Comfort */}
      <Navigation
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
      />
    </div>
  );
}
