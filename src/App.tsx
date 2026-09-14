import React, { useState } from "react";
import {
  NEIGHBOURHOODS,
  getNeighbourhoodById,
} from "./data/weatherData";
import { AppHeader } from "./components/AppHeader";
import { DisclaimerBanner } from "./components/DisclaimerBanner";
import { Navigation, ScreenId } from "./components/Navigation";
import { TodayScreen } from "./components/TodayScreen";
import { HourlyScreen } from "./components/HourlyScreen";
import { LocationsScreen } from "./components/LocationsScreen";

export default function App() {
  // Default to Bukit Cahaya as the active neighbourhood
  const [selectedNeighbourhoodId, setSelectedNeighbourhoodId] = useState<string>(
    NEIGHBOURHOODS[0].id
  );
  // Default to 'today' screen
  const [activeScreen, setActiveScreen] = useState<ScreenId>("today");

  const selectedNeighbourhood = getNeighbourhoodById(selectedNeighbourhoodId);

  const handleSelectNeighbourhood = (neighbourhoodId: string) => {
    setSelectedNeighbourhoodId(neighbourhoodId);
  };

  const handleSelectAndOpenToday = (neighbourhoodId: string) => {
    setSelectedNeighbourhoodId(neighbourhoodId);
    setActiveScreen("today");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Header */}
      <AppHeader
        selectedNeighbourhood={selectedNeighbourhood}
        onOpenLocations={() => setActiveScreen("locations")}
      />

      {/* Prominent Demo Disclaimer - Displayed on Every Screen */}
      <DisclaimerBanner />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4 pb-24">
        {activeScreen === "today" && (
          <TodayScreen
            selectedNeighbourhood={selectedNeighbourhood}
            onSelectNeighbourhood={handleSelectNeighbourhood}
            onNavigateToHourly={() => setActiveScreen("hourly")}
          />
        )}

        {activeScreen === "hourly" && (
          <HourlyScreen
            selectedNeighbourhood={selectedNeighbourhood}
            onSelectNeighbourhood={handleSelectNeighbourhood}
          />
        )}

        {activeScreen === "locations" && (
          <LocationsScreen
            selectedNeighbourhoodId={selectedNeighbourhoodId}
            onSelectNeighbourhoodAndOpenToday={handleSelectAndOpenToday}
          />
        )}
      </main>

      {/* Persistent Bottom Tab Navigation for Mobile Comfort */}
      <Navigation
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
      />
    </div>
  );
}
