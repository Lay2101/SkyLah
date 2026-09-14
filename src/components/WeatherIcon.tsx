import React from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
} from "lucide-react";

interface WeatherIconProps {
  condition: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  className = "w-6 h-6",
  size,
}) => {
  switch (condition) {
    case "Sunny":
      return <Sun className={`text-amber-500 ${className}`} size={size} aria-hidden="true" />;
    case "Partly Cloudy":
      return <CloudSun className={`text-amber-600 ${className}`} size={size} aria-hidden="true" />;
    case "Cloudy":
      return <Cloud className={`text-slate-500 ${className}`} size={size} aria-hidden="true" />;
    case "Passing Showers":
      return <CloudDrizzle className={`text-blue-500 ${className}`} size={size} aria-hidden="true" />;
    case "Thundery Showers":
      return <CloudLightning className={`text-indigo-600 ${className}`} size={size} aria-hidden="true" />;
    case "Heavy Rain":
      return <CloudRain className={`text-blue-700 ${className}`} size={size} aria-hidden="true" />;
    default:
      return <CloudSun className={`text-slate-500 ${className}`} size={size} aria-hidden="true" />;
  }
};
