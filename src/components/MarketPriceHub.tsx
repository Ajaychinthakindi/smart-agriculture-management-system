"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Building2, MapPin, Calculator, ArrowUpRight, Filter, ShieldCheck, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MarketPriceHub() {
  const [selectedCrop, setSelectedCrop] = useState("Cotton");
  const [selectedState, setSelectedState] = useState("Telangana");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  
  const [marketData, setMarketData] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(50); // in quintals
  const [loading, setLoading] = useState(false);

  const fetchMarketData = async (crop: string, state: string, district: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/market?crop=${encodeURIComponent(crop)}&state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
      const data = await res.json();
      if (data.success) {
        setMarketData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(selectedCrop, selectedState, selectedDistrict);
  }, [selectedCrop, selectedState, selectedDistrict]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict("All"); // reset district on state change
  };

  const calculateRevenue = () => {
    if (!marketData || !marketData.mandis || marketData.mandis.length === 0) return 0;
    const topPrice = Math.max(...marketData.mandis.map((m: any) => m.modalPrice));
    return quantity * topPrice;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card text-purple-400 text-sm font-medium mb-3 border border-purple-500/20">
          <TrendingUp className="w-4 h-4" /> Regional Mandi & State Price Intelligence
        </div>
        <h2 className="text-3xl font-bold">Crop Selling Price & Mandi Hub</h2>
        <p className="text-white/60 text-sm mt-1 max-w-xl mx-auto">
          Filter selling prices by State and District to discover highest paying Mandis for your harvest.
        </p>
      </div>

      {/* State, District & Crop Filter Panel */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 mb-10">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-purple-400">
          <Filter className="w-4 h-4" /> Select Region & Commodity
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1.5">Crop / Commodity</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              {marketData?.allCrops ? (
                marketData.allCrops.map((c: string) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                ))
              ) : (
                <>
                  <option value="Cotton">Cotton</option>
                  <option value="Rice (Paddy)">Rice (Paddy)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Maize">Maize</option>
                  <option value="Red Chili">Red Chili</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Groundnut">Groundnut</option>
                </>
              )}
            </select>
          </div>

          {/* State Selector */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1.5">State</label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              {marketData?.allStates ? (
                marketData.allStates.map((st: string) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">{st}</option>
                ))
              ) : (
                <>
                  <option value="Telangana">Telangana</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </>
              )}
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-xs font-semibold text-white/60 mb-1.5">District (in {selectedState})</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              {marketData?.allDistricts?.map((dst: string) => (
                <option key={dst} value={dst} className="bg-slate-900 text-white">
                  {dst === 'All' ? 'All Districts' : dst}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {marketData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Price & Mandi Table Section */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview Summary Header */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {selectedCrop} Price • {selectedState} {selectedDistrict !== 'All' ? `(${selectedDistrict} District)` : ''}
                  </div>
                  <div className="flex items-baseline gap-3 mt-2">
                    <h3 className="text-4xl font-extrabold text-white">₹{marketData.topPrice.toLocaleString()}</h3>
                    <span className="text-sm font-normal text-white/50">/ Quintal (Top Rate)</span>
                    <span className={`text-sm font-bold flex items-center gap-0.5 px-2.5 py-0.5 rounded-full ${
                      marketData.trend === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {marketData.trend === 'bullish' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {marketData.priceChange}
                    </span>
                  </div>
                </div>

                {/* MSP Comparison Pill */}
                <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-right">
                  <span className="text-xs font-semibold text-white/50 block">Govt MSP Baseline</span>
                  <span className="text-base font-bold text-emerald-400">₹{marketData.msp.toLocaleString()} <span className="text-xs font-normal text-white/60">/ Quintal</span></span>
                </div>
              </div>

              {/* Recommended Action Pill */}
              <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-xl mb-6">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">AI Market Advisory</span>
                <p className="text-sm text-white/90 font-medium">{marketData.recommendedAction}</p>
              </div>

              {/* Price Trajectory Chart */}
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">7-Day Price Trajectory ({selectedState})</h4>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData.historicalPrices}>
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#c084fc" strokeWidth={3} dot={{ fill: '#c084fc', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* State Mandi Rates Detailed Table */}
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  Mandi Selling Rates in {selectedState}
                </h4>
                <span className="text-xs text-white/50">{marketData.mandis.length} Mandis Found</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/70">
                  <thead className="text-xs uppercase text-white/40 border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="p-3 font-semibold">Mandi & District</th>
                      <th className="p-3 font-semibold">Min Price</th>
                      <th className="p-3 font-semibold">Max Price</th>
                      <th className="p-3 font-semibold">Modal (Selling) Price</th>
                      <th className="p-3 font-semibold">Today's Arrival</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {marketData.mandis.map((mandi: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-medium text-white">
                          <div>{mandi.name}</div>
                          <div className="text-xs text-white/40 font-normal">{mandi.district} Dist • {mandi.distance}</div>
                        </td>
                        <td className="p-3 text-white/60">₹{mandi.minPrice}</td>
                        <td className="p-3 text-white/60">₹{mandi.maxPrice}</td>
                        <td className="p-3 font-bold text-emerald-400">
                          ₹{mandi.modalPrice}
                          {mandi.modalPrice >= marketData.msp && (
                            <span className="ml-2 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Above MSP</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-xs text-white/70">
                          {mandi.arrivalQty} {mandi.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Revenue Calculator Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden sticky top-24">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 blur-[80px] pointer-events-none rounded-full" />
              
              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                Harvest Revenue Estimator
              </h3>
              <p className="text-xs text-white/60 mb-6">Calculate expected payout based on {selectedState}'s highest Mandi selling price.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1.5">Harvest Quantity (Quintals)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-[11px] text-white/40 mt-1 block">1 Quintal = 100 Kilograms</span>
                </div>

                <div className="bg-purple-950/40 border border-purple-500/30 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">Estimated Gross Payout</span>
                  <div className="text-3xl font-extrabold text-white">
                    ₹{calculateRevenue().toLocaleString()}
                  </div>
                  <p className="text-xs text-white/60">
                    Based on top Mandi selling price of <strong className="text-emerald-400">₹{marketData.topPrice}</strong> / Quintal in {selectedState}
                  </p>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2">
                  Connect with Buyers in {selectedState} <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
