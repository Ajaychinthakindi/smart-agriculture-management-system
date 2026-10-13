"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Droplets, Thermometer, TestTube, Sprout, Wind, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function CropRecommendation() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const [formData, setFormData] = useState({
        nitrogen: 50,
        phosphorus: 50,
        potassium: 50,
        temperature: 25,
        humidity: 60,
        ph: 6.5,
        rainfall: 100,
        season: "summer",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "season" ? value : Number(value),
        }));
    };

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                setResult(data);
            }
        } catch (error) {
            console.error("Prediction failed");
        } finally {
            setLoading(false);
        }
    };

    const npkData = [
        { name: "Nitrogen (N)", value: formData.nitrogen, color: "#4ade80" },
        { name: "Phosphorus (P)", value: formData.phosphorus, color: "#a78bfa" },
        { name: "Potassium (K)", value: formData.potassium, color: "#f472b6" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 pb-40">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 glass-card rounded-2xl mb-4">
                    <Leaf className="w-8 h-8 text-brand-500" />
                </div>
                <h1 className="text-4xl font-bold mb-4">AI Crop & Fertilizer Advisor</h1>
                <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
                    Input your soil metrics, weather, and season to get tailored crop suggestions and fertilizer actions for maximum yield.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-5 glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] pointer-events-none rounded-full" />

                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-brand-400" />
                        Field Data
                    </h2>

                    <form onSubmit={handlePredict} className="space-y-6 relative z-10">
                        {/* Season Selector */}
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Planting Season</label>
                            <select
                                name="season"
                                value={formData.season}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all appearance-none"
                            >
                                <option value="summer">Summer (Kharif)</option>
                                <option value="winter">Winter (Rabi)</option>
                                <option value="monsoon">Monsoon</option>
                                <option value="spring">Spring (Zaid)</option>
                            </select>
                        </div>

                        {/* NPK Inputs */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-2">Nitrogen (N)</label>
                                <input
                                    type="number"
                                    name="nitrogen"
                                    value={formData.nitrogen}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-2">Phosphorus (P)</label>
                                <input
                                    type="number"
                                    name="phosphorus"
                                    value={formData.phosphorus}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-2">Potassium (K)</label>
                                <input
                                    type="number"
                                    name="potassium"
                                    value={formData.potassium}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Environment Inputs */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-1.5">
                                    <Thermometer className="w-4 h-4 text-orange-400" /> Temp (°C)
                                </label>
                                <input
                                    type="number"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-1.5">
                                    <Wind className="w-4 h-4 text-blue-400" /> Humidity (%)
                                </label>
                                <input
                                    type="number"
                                    name="humidity"
                                    value={formData.humidity}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-1.5">
                                    <TestTube className="w-4 h-4 text-purple-400" /> Soil pH
                                </label>
                                <input
                                    type="number"
                                    name="ph"
                                    step="0.1"
                                    value={formData.ph}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2 flex items-center gap-1.5">
                                    <Droplets className="w-4 h-4 text-cyan-400" /> Rainfall (mm)
                                </label>
                                <input
                                    type="number"
                                    name="rainfall"
                                    value={formData.rainfall}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Soil Profile...
                                </>
                            ) : (
                                "Generate AI Recommendation"
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Visual NPK Chart (Always visible) */}
                    <div className="glass-card rounded-3xl p-8 border border-white/10">
                        <h3 className="text-lg font-semibold mb-6">Current Soil Nutrient Profile (NPK)</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={npkData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                        {npkData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Results */}
                    <div className={`glass-card rounded-3xl p-8 border border-white/10 flex-1 transition-all duration-500 ${result ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-white/40 space-y-4">
                                <Wind className="w-12 h-12" />
                                <p>Enter your field data and generate a recommendation<br />to see AI insights here.</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-8 bg-brand-500 rounded-full" />
                                        <h3 className="text-2xl font-bold">Top Crop Recommendations</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.recommendations.map((rec: any, i: number) => (
                                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
                                                <div className={`absolute top-0 left-0 w-1 h-full ${i === 0 ? 'bg-brand-500' : 'bg-brand-500/30'}`} />

                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-xl font-bold text-white">{rec.crop}</h4>
                                                    <span className="bg-brand-500/20 text-brand-400 text-xs font-bold px-2 py-1 rounded-md">
                                                        {rec.confidence}% Match
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white/60 leading-relaxed">{rec.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6">
                                    <h3 className="text-lg font-semibold mb-4 text-purple-400">Fertilizer Action Plan</h3>
                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
                                        <p className="font-semibold text-white mb-3">Recommended: <span className="text-purple-300">{result.soilHealth.fertilizer}</span></p>

                                        {result.soilHealth.actions.length > 0 && (
                                            <ul className="space-y-2 mt-4">
                                                {result.soilHealth.actions.map((action: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                                        <span className="text-purple-400 mt-0.5">•</span>
                                                        {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
