"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, AlertCircle, Plus, Check, ShoppingBag, Layers, Wrench, ShieldAlert } from "lucide-react";

export default function InventoryManager() {
  const [items, setItems] = useState([
    { id: 1, name: "Urea Fertilizer (45% N)", category: "Fertilizer", stock: 12, unit: "Bags (50kg)", status: "Optimal", minThreshold: 5 },
    { id: 2, name: "DAP (Diammonium Phosphate)", category: "Fertilizer", stock: 3, unit: "Bags (50kg)", status: "Low Stock", minThreshold: 5 },
    { id: 3, name: "Hybrid Mustard Seeds (Var-502)", category: "Seeds", stock: 25, unit: "kg", status: "Optimal", minThreshold: 10 },
    { id: 4, name: "Chlorpyrifos 20% EC", category: "Pesticides", stock: 2, unit: "Liters", status: "Low Stock", minThreshold: 4 },
    { id: 5, name: "Drip Irrigation Lateral Tubes", category: "Equipment", stock: 800, unit: "Meters", status: "Optimal", minThreshold: 200 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", category: "Fertilizer", stock: "", unit: "Bags" });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.stock) return;

    const stockNum = Number(newItem.stock);
    const item = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      stock: stockNum,
      unit: newItem.unit,
      status: stockNum <= 5 ? "Low Stock" : "Optimal",
      minThreshold: 5,
    };

    setItems([item, ...items]);
    setNewItem({ name: "", category: "Fertilizer", stock: "", unit: "Bags" });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-emerald-400 text-sm font-medium mb-3">
            <Package className="w-4 h-4" /> Farm Resource Control
          </div>
          <h2 className="text-3xl font-bold">Inventory & Equipment Tracker</h2>
          <p className="text-white/60 text-sm mt-1">Keep track of seeds, fertilizers, pesticides, and machinery maintenance.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Inventory Item
        </button>
      </div>

      {/* Add Item Modal / Collapsible Form */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-3xl border border-white/10 mb-8">
          <h3 className="text-lg font-bold mb-4">Add New Resource Item</h3>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1">Item Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. NPK 19:19:19"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Fertilizer">Fertilizer</option>
                <option value="Seeds">Seeds</option>
                <option value="Pesticides">Pesticides</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1">Stock Quantity & Unit</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  placeholder="Qty"
                  className="w-24 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="text"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  placeholder="Unit"
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-all">
                Save Item
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Inventory Table */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-white/5 text-xs uppercase text-white/40 border-b border-white/10">
              <tr>
                <th className="p-4 font-semibold">Resource Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Current Stock</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{item.name}</td>
                  <td className="p-4">
                    <span className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-white/80">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {item.stock} <span className="font-normal text-xs text-white/50">{item.unit}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 ${
                      item.status === 'Optimal'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                    }`}>
                      {item.status === 'Optimal' ? <Check className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
