"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Upload, AlertCircle, CheckCircle, RefreshCw, Sparkles, FileText, Bug } from "lucide-react";

export default function DiseaseScanner() {
  const [selectedSample, setSelectedSample] = useState("tomato_blight");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const samples = [
    { id: "tomato_blight", name: "Tomato Leaf (Early Blight)", label: "Fungal Suspect" },
    { id: "paddy_blight", name: "Rice Paddy (Bacterial Blight)", label: "Bacterial Suspect" },
    { id: "corn_rust", name: "Corn Leaf (Common Rust)", label: "Rust Suspect" },
    { id: "healthy_leaf", name: "Healthy Soybean Leaf", label: "Healthy Leaf" },
  ];

  const handleScan = async (sampleId: string) => {
    setSelectedSample(sampleId);
    setAnalyzing(true);
    setResult(null);

    try {
      const res = await fetch("/api/disease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropType: "General", sampleId }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-red-400 text-sm font-medium mb-3">
          <Bug className="w-4 h-4" /> AI Plant Diagnostic Scanner
        </div>
        <h2 className="text-3xl font-bold">Crop Disease Detection</h2>
        <p className="text-white/60 text-sm mt-1 max-w-xl mx-auto">
          Scan infected leaf images using our computer vision diagnostic model to instantly identify pathogens and get tailored treatment plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Sample Selector Widget */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden">
            <div className="border-2 border-dashed border-white/20 hover:border-brand-500/50 rounded-2xl p-8 transition-colors cursor-pointer group mb-6">
              <Upload className="w-12 h-12 text-white/40 group-hover:text-brand-400 mx-auto mb-3 transition-colors" />
              <h4 className="font-semibold text-white text-sm">Drag & Drop Leaf Photo</h4>
              <p className="text-xs text-white/50 mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
              <span className="inline-block mt-4 text-xs font-semibold bg-white/10 text-white/80 px-4 py-1.5 rounded-full">
                Or select a test sample below
              </span>
            </div>

            {/* Test Samples Selector */}
            <div className="space-y-2 text-left">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Demo Test Samples</span>
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleScan(sample.id)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-sm transition-all ${
                    selectedSample === sample.id
                      ? "bg-brand-500/20 border-brand-500 text-white"
                      : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="font-medium">{sample.name}</span>
                  <span className="text-xs opacity-60 bg-black/40 px-2 py-1 rounded-md">{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Results Display */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8 rounded-3xl border border-white/10 h-full flex flex-col justify-center">
            {analyzing ? (
              <div className="py-16 text-center space-y-4">
                <RefreshCw className="w-10 h-10 text-brand-400 animate-spin mx-auto" />
                <h4 className="text-lg font-bold">Analyzing Cellular Leaf Patterns...</h4>
                <p className="text-xs text-white/50">Running neural network classification on plant tissue.</p>
              </div>
            ) : result ? (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="flex items-start justify-between border-b border-white/10 pb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Diagnosis Report</span>
                    <h3 className="text-2xl font-extrabold text-white mt-1">{result.diseaseName}</h3>
                    <p className="text-xs text-white/60 mt-1">Pathogen: {result.pathogen} • Crop: {result.crop}</p>
                  </div>
                  <span className="bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold px-3 py-1.5 rounded-full">
                    {result.confidence}% Match
                  </span>
                </div>

                {/* Severity Indicator */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">Infection Severity</span>
                  <p className="text-sm font-bold text-amber-400">{result.severity}</p>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed">{result.symptoms}</p>
                </div>

                {/* Treatment Plans */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recommended Treatment Plan</h4>
                  
                  <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">🌿 Organic Solution</span>
                    <p className="text-xs text-white/80">{result.treatment.organic}</p>
                  </div>

                  <div className="bg-purple-950/30 border border-purple-500/30 p-4 rounded-xl">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">🧪 Chemical Treatment</span>
                    <p className="text-xs text-white/80">{result.treatment.chemical}</p>
                  </div>

                  <div className="bg-blue-950/30 border border-blue-500/30 p-4 rounded-xl">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">🛡️ Preventive Measures</span>
                    <p className="text-xs text-white/80">{result.treatment.preventive}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="py-16 text-center text-white/40 space-y-3">
                <Sparkles className="w-10 h-10 mx-auto" />
                <p>Select a test leaf sample to run AI diagnosis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
