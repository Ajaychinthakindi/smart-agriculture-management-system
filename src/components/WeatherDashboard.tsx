"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudRain, Sun, Cloud, Thermometer, Wind, Droplets, AlertTriangle, CheckCircle2, Search, MapPin, Compass } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeatherDashboard() {
  const [location, setLocation] = useState("Punjab, India");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(loc)}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(location);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-blue-400 text-sm font-medium mb-3">
            <CloudRain className="w-4 h-4" /> Live Micro-Climate Intelligence
          </div>
          <h2 className="text-3xl font-bold">Weather & Climate Advisory</h2>
          <p className="text-white/60 text-sm mt-1">Real-time agricultural weather forecasts and soil moisture tracking.</p>
        </div>

        {/* Location Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter region..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-8">
          {/* Alerts Banner */}
          {data.alerts && data.alerts.length > 0 && (
            <div className="space-y-3">
              {data.alerts.map((alert: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border flex items-start gap-4 ${
                    alert.severity === 'danger'
                      ? 'bg-red-500/10 border-red-500/30 text-red-200'
                      : alert.severity === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                  }`}
                >
                  <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider">{alert.title}</h4>
                    <p className="text-sm opacity-90 mt-0.5">{alert.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Current Weather Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Air Temperature</span>
                <Sun className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-4xl font-extrabold text-white">{data.temp}°C</div>
              <p className="text-xs text-white/60 mt-2">{data.condition} • Humidity: {data.humidity}%</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Soil Moisture (10cm)</span>
                <Droplets className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-4xl font-extrabold text-blue-400">{data.soilMoisture}%</div>
              <p className="text-xs text-white/60 mt-2">Evapotranspiration: {data.evapotranspiration}</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Soil Temperature</span>
                <Thermometer className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-4xl font-extrabold text-emerald-400">{data.soilTemp}°C</div>
              <p className="text-xs text-white/60 mt-2">UV Index: {data.uvIndex} / 10</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Wind & Drift</span>
                <Wind className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-4xl font-extrabold text-purple-400">{data.windSpeed} <span className="text-lg font-normal">km/h</span></div>
              <p className="text-xs text-white/60 mt-2">Favorable for pesticide spraying</p>
            </div>
          </div>

          {/* 7-Day Temperature & Rain Forecast Chart */}
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold">7-Day Temperature & Rain Probability</h3>
                <p className="text-xs text-white/50">Plan field work, sowing, and harvesting according to weekly trends.</p>
              </div>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Area type="monotone" dataKey="tempMax" name="Max Temp (°C)" stroke="#22c55e" fillOpacity={1} fill="url(#tempGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="rainProb" name="Rain Prob (%)" stroke="#3b82f6" fillOpacity={1} fill="url(#rainGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Smart Irrigation Advice */}
          <div className="bg-brand-950/40 border border-brand-500/30 rounded-2xl p-6 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-brand-400 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white text-base">Smart Irrigation Recommendation</h4>
              <p className="text-white/80 text-sm mt-1">{data.irrigationAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
