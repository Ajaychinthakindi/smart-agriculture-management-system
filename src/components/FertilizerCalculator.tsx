"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TestTube, Droplets, Calendar, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Scale, Sprout } from "lucide-react";

export default function FertilizerCalculator() {
  const [crop, setCrop] = useState("Cotton");
  const [landArea, setLandArea] = useState<number>(2);
  const [landUnit, setLandUnit] = useState("Acres");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const crops = ["Cotton", "Rice (Paddy)", "Wheat", "Maize", "Red Chili", "Sugarcane", "Soybean", "Tomato", "Mustard"];
  const units = ["Acres", "Hectares", "Gunta"];

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/fertilizer-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, landArea, landUnit }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-card text-emerald-400 text-sm font-medium mb-3 border border-emerald-500/20">
          <Calculator className="w-4 h-4" /> Precision Land-Area Fertilizer Calculator
        </div>
        <h2 className="text-3xl font-bold">Fertilizer Requirement Calculator</h2>
        <p className="text-white/60 text-sm mt-1 max-w-xl mx-auto">
          Calculate exact DAP, Urea 50kg bags, Nano Urea bottles, and liquid NPK fertilizers needed based on your total land area.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
          {/* Crop Selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-white/60 mb-2">Select Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              {crops.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
              ))}
            </select>
          </div>

          {/* Land Area Input */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-white/60 mb-2">Land Area Size</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={landArea}
                onChange={(e) => setLandArea(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="w-32 bg-black/50 border border-white/15 rounded-xl px-3 py-3.5 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {units.map((u) => (
                  <option key={u} value={u} className="bg-slate-900 text-white">{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
            >
              {loading ? "Calculating..." : "Calculate Fertilizers"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Results Display */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Urea (46% N)</span>
                <Scale className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{result.totals.ureaBags} <span className="text-sm font-normal text-white/60">Bags (50kg)</span></div>
              <p className="text-xs text-white/50 mt-1">For {result.landArea} {result.landUnit} of {result.crop}</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">DAP (18:46:0)</span>
                <Scale className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{result.totals.dapBags} <span className="text-sm font-normal text-white/60">Bags (50kg)</span></div>
              <p className="text-xs text-white/50 mt-1">Basal root establishment dose</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-blue-500/30 bg-blue-950/20">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Nano Urea Liquid</span>
                <Droplets className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{result.totals.nanoUreaBottles} <span className="text-sm font-normal text-white/60">Bottles (500ml)</span></div>
              <p className="text-xs text-white/50 mt-1">High efficiency foliar spray</p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-amber-500/30 bg-amber-950/20">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Liquid NPK (19:19:19)</span>
                <TestTube className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-white">{result.totals.liquidNpkLiters} <span className="text-sm font-normal text-white/60">Liters</span></div>
              <p className="text-xs text-white/50 mt-1">Flowering boost application</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Detailed Fertilizer Breakdown Table */}
            <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-400" />
                Required Fertilizer Itemized List ({result.landArea} {result.landUnit})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/70">
                  <thead className="text-xs uppercase text-white/40 border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="p-3 font-semibold">Fertilizer Name</th>
                      <th className="p-3 font-semibold">Required Quantity</th>
                      <th className="p-3 font-semibold">Agronomic Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.fertilizerDetails.map((f: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-medium text-white">
                          {f.name}
                          <div className="text-[11px] text-white/40">{f.type}</div>
                        </td>
                        <td className="p-3 font-bold text-emerald-400 font-mono text-sm whitespace-nowrap">
                          {f.quantity}
                        </td>
                        <td className="p-3 text-xs text-white/60 leading-relaxed">
                          {f.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Stage Schedule */}
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Application Stage Schedule
              </h3>
              
              {result.schedule.map((stg: any, idx: number) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{stg.stage}</span>
                    <span className="text-[11px] bg-black/40 text-white/60 px-2 py-0.5 rounded font-mono">{stg.timeline}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-white/80">
                    {stg.solidFertilizers.map((sf: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {sf}
                      </li>
                    ))}
                    {stg.liquidFertilizers.map((lf: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        {lf}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-white/50 italic border-t border-white/5 pt-2 mt-2">{stg.instructions}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
