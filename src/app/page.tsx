"use client";

import { motion } from "framer-motion";
import { CloudRain, Leaf, BarChart3, ShieldCheck, ThermometerSun, Sprout, ArrowRight, Calculator } from "lucide-react";
import CropRecommendation from "@/components/CropRecommendation";
import FertilizerCalculator from "@/components/FertilizerCalculator";
import WeatherDashboard from "@/components/WeatherDashboard";
import MarketPriceHub from "@/components/MarketPriceHub";
import DiseaseScanner from "@/components/DiseaseScanner";
import InventoryManager from "@/components/InventoryManager";

export default function Home() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-brand-500" />,
      title: "AI Crop Advisor",
      description: "Get seasonal crop suggestions based on soil NPK, pH, moisture, and micro-climate.",
      href: "#recommendation"
    },
    {
      icon: <Calculator className="w-8 h-8 text-emerald-400" />,
      title: "Land-Area Fertilizer Calculator",
      description: "Calculate exact DAP, Urea 50kg bags, Nano Urea bottles, and liquid NPK for your acres.",
      href: "#fertilizer-calc"
    },
    {
      icon: <CloudRain className="w-8 h-8 text-blue-400" />,
      title: "Weather & Climate",
      description: "Live updates, 7-day temperature trends, evapotranspiration, and rain alerts.",
      href: "#weather"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
      title: "Mandi Price Hub",
      description: "State & District level Mandi rates, price trends, and yield revenue calculator.",
      href: "#market"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-red-400" />,
      title: "Disease Diagnostic Scanner",
      description: "AI leaf scanner for quick identification of fungal, bacterial, and pest diseases.",
      href: "#disease"
    },
    {
      icon: <Sprout className="w-8 h-8 text-emerald-400" />,
      title: "Resource Control",
      description: "Manage farm inventory for seeds, fertilizers, pesticides, and equipment.",
      href: "#inventory"
    }
  ];

  return (
    <div className="relative isolate pt-28 pb-20">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#22c55e] to-[#0ea5e9] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-brand-500 text-sm font-medium mb-8 border border-brand-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Next-Gen Agriculture Support System
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Cultivate the Future with <br />
            <span className="text-gradient">Smart Agriculture</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Empowering modern farmers with AI crop recommendations, land-area fertilizer calculators, micro-climate weather forecasting, regional mandi price intelligence, and plant disease diagnostics.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#fertilizer-calc" className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] text-lg flex items-center gap-2">
              Calculate Fertilizer Quantities <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#market" className="text-white/80 hover:text-white glass-card px-8 py-3.5 rounded-full font-semibold transition-colors text-lg">
              Check Mandi Rates
            </a>
          </div>
        </motion.div>
      </div>

      {/* Quick Overview Features Grid */}
      <div id="features" className="max-w-7xl mx-auto px-6 mt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">All-in-One Farm Decision Engine</h2>
          <p className="text-white/60 text-sm">Everything you need to optimize soil health, manage risks, and maximize farm revenue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.a
              key={idx}
              href={feature.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="glass-card p-6 rounded-2xl hover:bg-white/[0.06] transition-all border border-white/5 group"
            >
              <div className="mb-4 p-3.5 rounded-xl glass-card inline-block group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 text-white flex items-center gap-1.5">
                {feature.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-400" />
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Module 1: Crop Recommendation System */}
      <section id="recommendation" className="mt-28 border-t border-white/10 pt-16">
        <CropRecommendation />
      </section>

      {/* Module 2: Land-Area Fertilizer Requirement Calculator */}
      <section id="fertilizer-calc" className="mt-16 border-t border-white/10 pt-16 bg-white/[0.01]">
        <FertilizerCalculator />
      </section>

      {/* Module 3: Weather & Climate Forecasting */}
      <section id="weather" className="mt-16 border-t border-white/10 pt-16">
        <WeatherDashboard />
      </section>

      {/* Module 4: Mandi & Market Prices */}
      <section id="market" className="mt-16 border-t border-white/10 pt-16 bg-white/[0.01]">
        <MarketPriceHub />
      </section>

      {/* Module 5: Plant Disease Diagnostic Scanner */}
      <section id="disease" className="mt-16 border-t border-white/10 pt-16">
        <DiseaseScanner />
      </section>

      {/* Module 6: Farm Inventory Manager */}
      <section id="inventory" className="mt-16 border-t border-white/10 pt-16 bg-white/[0.01]">
        <InventoryManager />
      </section>

      {/* Decorative Bottom Glow */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#16a34a] to-[#052e16] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </div>
  );
}
