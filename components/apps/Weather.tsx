'use client';

import { useState } from 'react';
import {
  Sun,
  CloudRain,
  CloudSun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  Compass,
  Search,
  MapPin,
  Calendar,
  Zap,
} from 'lucide-react';

interface CityWeather {
  city: string;
  country: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  airQuality: string;
  hourly: { time: string; temp: number; icon: any }[];
  weekly: { day: string; condition: string; high: number; low: number; icon: any }[];
}

const CITIES: Record<string, CityWeather> = {
  'San Francisco': {
    city: 'San Francisco',
    country: 'United States',
    temp: 68,
    condition: 'Sunny',
    high: 72,
    low: 55,
    humidity: 62,
    windSpeed: 12,
    uvIndex: 6,
    airQuality: 'Good (24 AQI)',
    hourly: [
      { time: 'Now', temp: 68, icon: Sun },
      { time: '1 PM', temp: 70, icon: Sun },
      { time: '2 PM', temp: 72, icon: Sun },
      { time: '3 PM', temp: 71, icon: CloudSun },
      { time: '4 PM', temp: 69, icon: CloudSun },
      { time: '5 PM', temp: 66, icon: Sun },
    ],
    weekly: [
      { day: 'Today', condition: 'Sunny', high: 72, low: 55, icon: Sun },
      { day: 'Tue', condition: 'Partly Cloudy', high: 69, low: 54, icon: CloudSun },
      { day: 'Wed', condition: 'Breezy', high: 65, low: 52, icon: Wind },
      { day: 'Thu', condition: 'Clear', high: 71, low: 53, icon: Sun },
      { day: 'Fri', condition: 'Sunny', high: 74, low: 56, icon: Sun },
    ],
  },
  'New York': {
    city: 'New York',
    country: 'United States',
    temp: 75,
    condition: 'Partly Cloudy',
    high: 78,
    low: 64,
    humidity: 55,
    windSpeed: 9,
    uvIndex: 7,
    airQuality: 'Moderate (42 AQI)',
    hourly: [
      { time: 'Now', temp: 75, icon: CloudSun },
      { time: '1 PM', temp: 77, icon: Sun },
      { time: '2 PM', temp: 78, icon: Sun },
      { time: '3 PM', temp: 77, icon: CloudSun },
      { time: '4 PM', temp: 76, icon: CloudSun },
      { time: '5 PM', temp: 73, icon: Sun },
    ],
    weekly: [
      { day: 'Today', condition: 'Partly Cloudy', high: 78, low: 64, icon: CloudSun },
      { day: 'Tue', condition: 'Scattered Showers', high: 71, low: 60, icon: CloudRain },
      { day: 'Wed', condition: 'Sunny', high: 76, low: 62, icon: Sun },
      { day: 'Thu', condition: 'Clear', high: 80, low: 65, icon: Sun },
      { day: 'Fri', condition: 'Partly Cloudy', high: 77, low: 63, icon: CloudSun },
    ],
  },
  London: {
    city: 'London',
    country: 'United Kingdom',
    temp: 61,
    condition: 'Light Rain',
    high: 64,
    low: 50,
    humidity: 82,
    windSpeed: 15,
    uvIndex: 3,
    airQuality: 'Good (18 AQI)',
    hourly: [
      { time: 'Now', temp: 61, icon: CloudRain },
      { time: '1 PM', temp: 62, icon: CloudRain },
      { time: '2 PM', temp: 64, icon: CloudSun },
      { time: '3 PM', temp: 63, icon: CloudSun },
      { time: '4 PM', temp: 60, icon: CloudRain },
      { time: '5 PM', temp: 58, icon: CloudRain },
    ],
    weekly: [
      { day: 'Today', condition: 'Light Rain', high: 64, low: 50, icon: CloudRain },
      { day: 'Tue', condition: 'Cloudy', high: 62, low: 49, icon: CloudSun },
      { day: 'Wed', condition: 'Rain', high: 59, low: 48, icon: CloudRain },
      { day: 'Thu', condition: 'Sunny Spells', high: 65, low: 51, icon: Sun },
      { day: 'Fri', condition: 'Breezy', high: 63, low: 50, icon: Wind },
    ],
  },
  Tokyo: {
    city: 'Tokyo',
    country: 'Japan',
    temp: 72,
    condition: 'Clear',
    high: 76,
    low: 61,
    humidity: 48,
    windSpeed: 7,
    uvIndex: 8,
    airQuality: 'Good (28 AQI)',
    hourly: [
      { time: 'Now', temp: 72, icon: Sun },
      { time: '1 PM', temp: 75, icon: Sun },
      { time: '2 PM', temp: 76, icon: Sun },
      { time: '3 PM', temp: 74, icon: Sun },
      { time: '4 PM', temp: 71, icon: CloudSun },
      { time: '5 PM', temp: 68, icon: Sun },
    ],
    weekly: [
      { day: 'Today', condition: 'Clear', high: 76, low: 61, icon: Sun },
      { day: 'Tue', condition: 'Sunny', high: 78, low: 63, icon: Sun },
      { day: 'Wed', condition: 'Partly Cloudy', high: 74, low: 60, icon: CloudSun },
      { day: 'Thu', condition: 'Clear', high: 75, low: 62, icon: Sun },
      { day: 'Fri', condition: 'Sunny', high: 79, low: 64, icon: Sun },
    ],
  },
};

export default function Weather() {
  const [selectedCityName, setSelectedCityName] = useState('San Francisco');
  const [searchQuery, setSearchQuery] = useState('');

  const weather = CITIES[selectedCityName] || CITIES['San Francisco'];
  const MainIcon = weather.temp > 70 ? Sun : weather.condition.includes('Rain') ? CloudRain : CloudSun;

  const filteredCityNames = Object.keys(CITIES).filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-sky-950 to-blue-900 text-white flex flex-col overflow-hidden select-none font-sans">
      {/* Search & Location Bar */}
      <div className="px-4 py-3 bg-white/10 backdrop-blur-md border-b border-white/10 flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-2 text-sky-300">
          <MapPin size={16} />
          <span className="text-xs font-semibold tracking-wide">
            {weather.city}, {weather.country}
          </span>
        </div>

        <div className="relative w-48">
          <input
            type="text"
            placeholder="Search city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/30 border border-white/15 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-zinc-400 outline-none focus:border-sky-400/60 transition-all"
          />
          <Search size={13} className="absolute left-2.5 top-2 text-zinc-400" />

          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900/95 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50">
              {filteredCityNames.map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => {
                    setSelectedCityName(cityName);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-sky-600/30 transition-colors flex items-center justify-between"
                >
                  <span>{cityName}</span>
                  <span className="text-[10px] text-sky-300">{CITIES[cityName].temp}°F</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Telemetry Canvas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Hero Temperature Card */}
        <div className="relative rounded-3xl bg-gradient-to-tr from-sky-600/30 to-blue-500/20 border border-white/20 p-6 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl">
          <MainIcon size={56} className="text-amber-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)] mb-2" />
          <h1 className="text-6xl font-black tracking-tight drop-shadow-md">{weather.temp}°</h1>
          <p className="text-lg font-medium text-sky-200 mt-1">{weather.condition}</p>
          <div className="flex space-x-3 text-xs text-sky-300/80 font-medium mt-1">
            <span>H: {weather.high}°</span>
            <span>•</span>
            <span>L: {weather.low}°</span>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
          <div className="flex items-center space-x-1.5 text-xs text-sky-300 font-semibold mb-3">
            <Zap size={14} />
            <span>HOURLY FORECAST</span>
          </div>
          <div className="grid grid-cols-6 gap-2 text-center">
            {weather.hourly.map((h, idx) => {
              const IconComp = h.icon;
              return (
                <div key={idx} className="flex flex-col items-center space-y-1 py-1">
                  <span className="text-[11px] text-zinc-300 font-medium">{h.time}</span>
                  <IconComp size={18} className="text-amber-300" />
                  <span className="text-xs font-bold text-white">{h.temp}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5-Day Weekly Forecast */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md">
          <div className="flex items-center space-x-1.5 text-xs text-sky-300 font-semibold mb-3">
            <Calendar size={14} />
            <span>5-DAY FORECAST</span>
          </div>
          <div className="space-y-2">
            {weather.weekly.map((w, idx) => {
              const IconComp = w.icon;
              return (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
                  <span className="w-16 font-semibold text-zinc-200">{w.day}</span>
                  <div className="flex items-center space-x-2 text-sky-200">
                    <IconComp size={16} className="text-amber-300" />
                    <span className="w-28 text-left text-[11px] truncate text-zinc-300">{w.condition}</span>
                  </div>
                  <div className="flex space-x-2 font-mono text-[11px]">
                    <span className="text-white font-bold">{w.high}°</span>
                    <span className="text-zinc-400">{w.low}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-sky-300 font-medium">
              <Wind size={13} />
              <span>WIND SPEED</span>
            </div>
            <span className="text-lg font-bold text-white">{weather.windSpeed} mph</span>
            <span className="text-[10px] text-zinc-400">NW • Moderate Breeze</span>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-sky-300 font-medium">
              <Droplets size={13} />
              <span>HUMIDITY</span>
            </div>
            <span className="text-lg font-bold text-white">{weather.humidity}%</span>
            <span className="text-[10px] text-zinc-400">Dew point is 54°</span>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-sky-300 font-medium">
              <Sun size={13} />
              <span>UV INDEX</span>
            </div>
            <span className="text-lg font-bold text-white">{weather.uvIndex}</span>
            <span className="text-[10px] text-zinc-400">Moderate risk</span>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex flex-col space-y-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-sky-300 font-medium">
              <Thermometer size={13} />
              <span>AIR QUALITY</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">{weather.airQuality}</span>
            <span className="text-[10px] text-zinc-400">Air quality is healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
