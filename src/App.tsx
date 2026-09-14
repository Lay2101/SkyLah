import React, { useState, useEffect, useCallback } from "react";
import { AppHeader } from "./components/AppHeader";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { Navigation, ScreenId } from "./components/Navigation";
import { TodayScreen } from "./components/TodayScreen";
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
  // Default to 'City' if available, otherwise initialized once areas arrive
  const [selectedAreaName, setSelectedAreaName] = useState<string>("City");
  const [activeScreen, setActiveScreen] = useState<ScreenId>("today");

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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all areas together once on mount so changing selection never triggers upstream request
  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/weather");

      if (response.status === 429) {
        setErrorMessage(
          "The weather service is receiving too many requests. Please wait a moment and try again."
        );
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        // Safe upstream error handling
        if (response.status === 503 || response.status === 504) {
          setErrorMessage(
            "We couldn’t reach the weather service. Please try again shortly."
          );
        } else {
          setErrorMessage(
            "The weather service declined this request. Please try again later."
          );
        }
        setIsLoading(false);
        return;
      }

      const data: WeatherDataResponse = await response.json();

      if (data.empty || !Array.isArray(data.areas) || data.areas.length === 0) {
        setErrorMessage("No forecast is available for this area right now.");
        setAreas([]);
        setIsLoading(false);
        return;
      }

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
      // Network unreachable or client abort
      setErrorMessage(
        "We couldn’t reach the weather service. Please try again shortly."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSelectArea = (areaName: string) => {
    // Changing selection strictly uses already fetched areas without upstream requests
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
            isLoading={isLoading}
            errorMessage={errorMessage}
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
            isLoading={isLoading}
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
