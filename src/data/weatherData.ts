export interface HourlyForecast {
  id: string;
  neighbourhoodId: string;
  hour: string; // e.g., "07:00 SGT"
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Passing Showers' | 'Thundery Showers' | 'Heavy Rain';
  temperatureC: number;
  rainChancePercent: number;
}

export interface NeighbourhoodWeather {
  id: string;
  name: string;
  tagline: string;
  current: {
    condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Passing Showers' | 'Thundery Showers' | 'Heavy Rain';
    temperatureC: number;
    rainChancePercent: number;
    humidityPercent: number;
  };
}

export const FIXED_DEMO_DATE = "Monday, 19 October 2026";
export const DEMO_DISCLAIMER = "Demo weather — fictional data, not a live forecast";

export const NEIGHBOURHOODS: NeighbourhoodWeather[] = [
  {
    id: "bukit-cahaya",
    name: "Bukit Cahaya",
    tagline: "Central Green Ridge",
    current: {
      condition: "Thundery Showers",
      temperatureC: 28,
      rainChancePercent: 75,
      humidityPercent: 88,
    },
  },
  {
    id: "marina-breeze",
    name: "Marina Breeze",
    tagline: "South Waterfront",
    current: {
      condition: "Partly Cloudy",
      temperatureC: 31,
      rainChancePercent: 20,
      humidityPercent: 74,
    },
  },
  {
    id: "tanjong-merbok",
    name: "Tanjong Merbok",
    tagline: "East Coast Haven",
    current: {
      condition: "Passing Showers",
      temperatureC: 29,
      rainChancePercent: 45,
      humidityPercent: 82,
    },
  },
  {
    id: "serangoon-heights",
    name: "Serangoon Heights",
    tagline: "North-East District",
    current: {
      condition: "Cloudy",
      temperatureC: 30,
      rainChancePercent: 35,
      humidityPercent: 78,
    },
  },
  {
    id: "jurong-vista",
    name: "Jurong Vista",
    tagline: "West Lake Sector",
    current: {
      condition: "Heavy Rain",
      temperatureC: 26,
      rainChancePercent: 85,
      humidityPercent: 92,
    },
  },
  {
    id: "kallang-grove",
    name: "Kallang Grove",
    tagline: "Central Basin",
    current: {
      condition: "Sunny",
      temperatureC: 32,
      rainChancePercent: 10,
      humidityPercent: 68,
    },
  },
];

// Exactly 72 hourly forecast rows: 12 consecutive hours (07:00 SGT to 18:00 SGT) across 6 fictional neighbourhoods
export const HOURLY_FORECASTS: HourlyForecast[] = [
  // 1. Bukit Cahaya (12 hours: 07:00 to 18:00 SGT)
  { id: "bc-07", neighbourhoodId: "bukit-cahaya", hour: "07:00 SGT", condition: "Thundery Showers", temperatureC: 27, rainChancePercent: 80 },
  { id: "bc-08", neighbourhoodId: "bukit-cahaya", hour: "08:00 SGT", condition: "Thundery Showers", temperatureC: 28, rainChancePercent: 75 },
  { id: "bc-09", neighbourhoodId: "bukit-cahaya", hour: "09:00 SGT", condition: "Heavy Rain", temperatureC: 27, rainChancePercent: 70 },
  { id: "bc-10", neighbourhoodId: "bukit-cahaya", hour: "10:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 50 },
  { id: "bc-11", neighbourhoodId: "bukit-cahaya", hour: "11:00 SGT", condition: "Cloudy", temperatureC: 30, rainChancePercent: 35 },
  { id: "bc-12", neighbourhoodId: "bukit-cahaya", hour: "12:00 SGT", condition: "Partly Cloudy", temperatureC: 31, rainChancePercent: 20 },
  { id: "bc-13", neighbourhoodId: "bukit-cahaya", hour: "13:00 SGT", condition: "Partly Cloudy", temperatureC: 32, rainChancePercent: 15 },
  { id: "bc-14", neighbourhoodId: "bukit-cahaya", hour: "14:00 SGT", condition: "Sunny", temperatureC: 33, rainChancePercent: 10 },
  { id: "bc-15", neighbourhoodId: "bukit-cahaya", hour: "15:00 SGT", condition: "Partly Cloudy", temperatureC: 32, rainChancePercent: 20 },
  { id: "bc-16", neighbourhoodId: "bukit-cahaya", hour: "16:00 SGT", condition: "Cloudy", temperatureC: 31, rainChancePercent: 30 },
  { id: "bc-17", neighbourhoodId: "bukit-cahaya", hour: "17:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 45 },
  { id: "bc-18", neighbourhoodId: "bukit-cahaya", hour: "18:00 SGT", condition: "Passing Showers", temperatureC: 28, rainChancePercent: 40 },

  // 2. Marina Breeze (12 hours: 07:00 to 18:00 SGT)
  { id: "mb-07", neighbourhoodId: "marina-breeze", hour: "07:00 SGT", condition: "Partly Cloudy", temperatureC: 28, rainChancePercent: 20 },
  { id: "mb-08", neighbourhoodId: "marina-breeze", hour: "08:00 SGT", condition: "Partly Cloudy", temperatureC: 30, rainChancePercent: 20 },
  { id: "mb-09", neighbourhoodId: "marina-breeze", hour: "09:00 SGT", condition: "Sunny", temperatureC: 31, rainChancePercent: 10 },
  { id: "mb-10", neighbourhoodId: "marina-breeze", hour: "10:00 SGT", condition: "Sunny", temperatureC: 32, rainChancePercent: 10 },
  { id: "mb-11", neighbourhoodId: "marina-breeze", hour: "11:00 SGT", condition: "Partly Cloudy", temperatureC: 33, rainChancePercent: 15 },
  { id: "mb-12", neighbourhoodId: "marina-breeze", hour: "12:00 SGT", condition: "Partly Cloudy", temperatureC: 33, rainChancePercent: 20 },
  { id: "mb-13", neighbourhoodId: "marina-breeze", hour: "13:00 SGT", condition: "Cloudy", temperatureC: 32, rainChancePercent: 30 },
  { id: "mb-14", neighbourhoodId: "marina-breeze", hour: "14:00 SGT", condition: "Passing Showers", temperatureC: 30, rainChancePercent: 40 },
  { id: "mb-15", neighbourhoodId: "marina-breeze", hour: "15:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 45 },
  { id: "mb-16", neighbourhoodId: "marina-breeze", hour: "16:00 SGT", condition: "Cloudy", temperatureC: 29, rainChancePercent: 35 },
  { id: "mb-17", neighbourhoodId: "marina-breeze", hour: "17:00 SGT", condition: "Partly Cloudy", temperatureC: 29, rainChancePercent: 20 },
  { id: "mb-18", neighbourhoodId: "marina-breeze", hour: "18:00 SGT", condition: "Partly Cloudy", temperatureC: 28, rainChancePercent: 15 },

  // 3. Tanjong Merbok (12 hours: 07:00 to 18:00 SGT)
  { id: "tm-07", neighbourhoodId: "tanjong-merbok", hour: "07:00 SGT", condition: "Cloudy", temperatureC: 27, rainChancePercent: 30 },
  { id: "tm-08", neighbourhoodId: "tanjong-merbok", hour: "08:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 45 },
  { id: "tm-09", neighbourhoodId: "tanjong-merbok", hour: "09:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 50 },
  { id: "tm-10", neighbourhoodId: "tanjong-merbok", hour: "10:00 SGT", condition: "Cloudy", temperatureC: 30, rainChancePercent: 35 },
  { id: "tm-11", neighbourhoodId: "tanjong-merbok", hour: "11:00 SGT", condition: "Partly Cloudy", temperatureC: 31, rainChancePercent: 25 },
  { id: "tm-12", neighbourhoodId: "tanjong-merbok", hour: "12:00 SGT", condition: "Sunny", temperatureC: 32, rainChancePercent: 15 },
  { id: "tm-13", neighbourhoodId: "tanjong-merbok", hour: "13:00 SGT", condition: "Sunny", temperatureC: 33, rainChancePercent: 15 },
  { id: "tm-14", neighbourhoodId: "tanjong-merbok", hour: "14:00 SGT", condition: "Sunny", temperatureC: 33, rainChancePercent: 15 },
  { id: "tm-15", neighbourhoodId: "tanjong-merbok", hour: "15:00 SGT", condition: "Partly Cloudy", temperatureC: 31, rainChancePercent: 20 },
  { id: "tm-16", neighbourhoodId: "tanjong-merbok", hour: "16:00 SGT", condition: "Cloudy", temperatureC: 30, rainChancePercent: 30 },
  { id: "tm-17", neighbourhoodId: "tanjong-merbok", hour: "17:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 40 },
  { id: "tm-18", neighbourhoodId: "tanjong-merbok", hour: "18:00 SGT", condition: "Cloudy", temperatureC: 28, rainChancePercent: 25 },

  // 4. Serangoon Heights (12 hours: 07:00 to 18:00 SGT)
  { id: "sh-07", neighbourhoodId: "serangoon-heights", hour: "07:00 SGT", condition: "Cloudy", temperatureC: 28, rainChancePercent: 30 },
  { id: "sh-08", neighbourhoodId: "serangoon-heights", hour: "08:00 SGT", condition: "Cloudy", temperatureC: 30, rainChancePercent: 35 },
  { id: "sh-09", neighbourhoodId: "serangoon-heights", hour: "09:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 55 },
  { id: "sh-10", neighbourhoodId: "serangoon-heights", hour: "10:00 SGT", condition: "Thundery Showers", temperatureC: 28, rainChancePercent: 65 },
  { id: "sh-11", neighbourhoodId: "serangoon-heights", hour: "11:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 45 },
  { id: "sh-12", neighbourhoodId: "serangoon-heights", hour: "12:00 SGT", condition: "Cloudy", temperatureC: 30, rainChancePercent: 30 },
  { id: "sh-13", neighbourhoodId: "serangoon-heights", hour: "13:00 SGT", condition: "Partly Cloudy", temperatureC: 31, rainChancePercent: 20 },
  { id: "sh-14", neighbourhoodId: "serangoon-heights", hour: "14:00 SGT", condition: "Partly Cloudy", temperatureC: 32, rainChancePercent: 20 },
  { id: "sh-15", neighbourhoodId: "serangoon-heights", hour: "15:00 SGT", condition: "Sunny", temperatureC: 32, rainChancePercent: 10 },
  { id: "sh-16", neighbourhoodId: "serangoon-heights", hour: "16:00 SGT", condition: "Sunny", temperatureC: 31, rainChancePercent: 10 },
  { id: "sh-17", neighbourhoodId: "serangoon-heights", hour: "17:00 SGT", condition: "Partly Cloudy", temperatureC: 29, rainChancePercent: 20 },
  { id: "sh-18", neighbourhoodId: "serangoon-heights", hour: "18:00 SGT", condition: "Partly Cloudy", temperatureC: 28, rainChancePercent: 15 },

  // 5. Jurong Vista (12 hours: 07:00 to 18:00 SGT)
  { id: "jv-07", neighbourhoodId: "jurong-vista", hour: "07:00 SGT", condition: "Thundery Showers", temperatureC: 26, rainChancePercent: 85 },
  { id: "jv-08", neighbourhoodId: "jurong-vista", hour: "08:00 SGT", condition: "Heavy Rain", temperatureC: 26, rainChancePercent: 85 },
  { id: "jv-09", neighbourhoodId: "jurong-vista", hour: "09:00 SGT", condition: "Thundery Showers", temperatureC: 27, rainChancePercent: 75 },
  { id: "jv-10", neighbourhoodId: "jurong-vista", hour: "10:00 SGT", condition: "Passing Showers", temperatureC: 28, rainChancePercent: 60 },
  { id: "jv-11", neighbourhoodId: "jurong-vista", hour: "11:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 50 },
  { id: "jv-12", neighbourhoodId: "jurong-vista", hour: "12:00 SGT", condition: "Cloudy", temperatureC: 30, rainChancePercent: 40 },
  { id: "jv-13", neighbourhoodId: "jurong-vista", hour: "13:00 SGT", condition: "Cloudy", temperatureC: 31, rainChancePercent: 35 },
  { id: "jv-14", neighbourhoodId: "jurong-vista", hour: "14:00 SGT", condition: "Partly Cloudy", temperatureC: 31, rainChancePercent: 25 },
  { id: "jv-15", neighbourhoodId: "jurong-vista", hour: "15:00 SGT", condition: "Partly Cloudy", temperatureC: 31, rainChancePercent: 25 },
  { id: "jv-16", neighbourhoodId: "jurong-vista", hour: "16:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 45 },
  { id: "jv-17", neighbourhoodId: "jurong-vista", hour: "17:00 SGT", condition: "Heavy Rain", temperatureC: 27, rainChancePercent: 80 },
  { id: "jv-18", neighbourhoodId: "jurong-vista", hour: "18:00 SGT", condition: "Thundery Showers", temperatureC: 26, rainChancePercent: 70 },

  // 6. Kallang Grove (12 hours: 07:00 to 18:00 SGT)
  { id: "kg-07", neighbourhoodId: "kallang-grove", hour: "07:00 SGT", condition: "Partly Cloudy", temperatureC: 29, rainChancePercent: 15 },
  { id: "kg-08", neighbourhoodId: "kallang-grove", hour: "08:00 SGT", condition: "Sunny", temperatureC: 32, rainChancePercent: 10 },
  { id: "kg-09", neighbourhoodId: "kallang-grove", hour: "09:00 SGT", condition: "Sunny", temperatureC: 33, rainChancePercent: 10 },
  { id: "kg-10", neighbourhoodId: "kallang-grove", hour: "10:00 SGT", condition: "Sunny", temperatureC: 34, rainChancePercent: 10 },
  { id: "kg-11", neighbourhoodId: "kallang-grove", hour: "11:00 SGT", condition: "Sunny", temperatureC: 34, rainChancePercent: 10 },
  { id: "kg-12", neighbourhoodId: "kallang-grove", hour: "12:00 SGT", condition: "Partly Cloudy", temperatureC: 33, rainChancePercent: 20 },
  { id: "kg-13", neighbourhoodId: "kallang-grove", hour: "13:00 SGT", condition: "Partly Cloudy", temperatureC: 32, rainChancePercent: 25 },
  { id: "kg-14", neighbourhoodId: "kallang-grove", hour: "14:00 SGT", condition: "Passing Showers", temperatureC: 30, rainChancePercent: 45 },
  { id: "kg-15", neighbourhoodId: "kallang-grove", hour: "15:00 SGT", condition: "Passing Showers", temperatureC: 29, rainChancePercent: 40 },
  { id: "kg-16", neighbourhoodId: "kallang-grove", hour: "16:00 SGT", condition: "Cloudy", temperatureC: 29, rainChancePercent: 30 },
  { id: "kg-17", neighbourhoodId: "kallang-grove", hour: "17:00 SGT", condition: "Partly Cloudy", temperatureC: 29, rainChancePercent: 20 },
  { id: "kg-18", neighbourhoodId: "kallang-grove", hour: "18:00 SGT", condition: "Partly Cloudy", temperatureC: 28, rainChancePercent: 15 },
];

/**
 * Derives the umbrella recommendation strictly based on rain chance and condition data.
 */
export interface UmbrellaSuggestion {
  status: "needed" | "handy" | "not_needed";
  badgeText: string;
  recommendation: string;
  shortAction: string;
}

export function deriveUmbrellaSuggestion(rainChancePercent: number, condition: string): UmbrellaSuggestion {
  if (rainChancePercent >= 60 || condition === "Heavy Rain" || condition === "Thundery Showers") {
    return {
      status: "needed",
      badgeText: "Umbrella Required",
      recommendation: "Definitely take an umbrella lah! High chance of wet weather.",
      shortAction: "Carry an umbrella",
    };
  }

  if (rainChancePercent >= 30 || condition === "Passing Showers") {
    return {
      status: "handy",
      badgeText: "Pack Compact Umbrella",
      recommendation: "Keep a folding brolly handy in your bag just in case showers hit.",
      shortAction: "Bring folding umbrella",
    };
  }

  return {
    status: "not_needed",
    badgeText: "No Umbrella Needed",
    recommendation: "Clear to head out! Low rain risk right now.",
    shortAction: "No umbrella needed",
  };
}

/**
 * Derives the hourly forecast row with the lowest rain chance for a neighbourhood.
 * If there is a tie between multiple hours, it highlights the earliest hour.
 */
export function deriveLowestRainHour(hourlyRows: HourlyForecast[]): HourlyForecast | null {
  if (!hourlyRows || hourlyRows.length === 0) return null;

  // Reduce to find the row with strictly lower rainChancePercent.
  // Using strictly '<' preserves the earliest hour in case of ties.
  return hourlyRows.reduce((lowest, current) => {
    return current.rainChancePercent < lowest.rainChancePercent ? current : lowest;
  }, hourlyRows[0]);
}

/**
 * Helper to fetch a neighbourhood by ID with safe fallback.
 */
export function getNeighbourhoodById(id: string): NeighbourhoodWeather {
  const found = NEIGHBOURHOODS.find((n) => n.id === id);
  return found || NEIGHBOURHOODS[0];
}

/**
 * Helper to get all 12 hours for a given neighbourhood.
 */
export function getHourlyForecastsForNeighbourhood(neighbourhoodId: string): HourlyForecast[] {
  return HOURLY_FORECASTS.filter((row) => row.neighbourhoodId === neighbourhoodId);
}
