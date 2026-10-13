import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Agriculture Management System",
  description: "Empowering farmers with AI-driven insights, weather forecasting, and market data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="font-bold text-lg tracking-tight">AgriSmart</span>
            </div>
            <div className="hidden md:flex gap-6 text-sm font-medium text-white/70">
              <a href="#recommendation" className="hover:text-white transition-colors">Crop Advisor</a>
              <a href="#fertilizer-calc" className="hover:text-white transition-colors">Fertilizer Calculator</a>
              <a href="#weather" className="hover:text-white transition-colors">Weather & Soil</a>
              <a href="#market" className="hover:text-white transition-colors">Mandi Prices</a>
              <a href="#disease" className="hover:text-white transition-colors">Disease Scanner</a>
              <a href="#inventory" className="hover:text-white transition-colors">Inventory</a>
            </div>
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              Get Started
            </button>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 bg-black/20 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-white/50 text-sm">
            © {new Date().getFullYear()} AgriSmart. Built for modern farmers.
          </div>
        </footer>
      </body>
    </html>
  );
}
