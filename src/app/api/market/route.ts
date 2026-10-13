import { NextResponse } from 'next/server';

// Comprehensive dataset for Indian States & Districts with agricultural Mandi rates
const STATE_DISTRICT_MAP: Record<string, string[]> = {
  "Telangana": ["Warangal", "Khammam", "Karimnagar", "Nalgonda", "Adilabad", "Nizamabad", "Suryapet", "Mahabubnagar", "Rangareddy", "Hyderabad"],
  "Punjab": ["Khanna", "Ludhiana", "Amritsar", "Tarn Taran", "Patiala", "Bathinda", "Abohar", "Jalandhar", "Sangrur"],
  "Maharashtra": ["Nagpur", "Nashik", "Latur", "Pune", "Amravati", "Aurangabad", "Yavatmal", "Akola", "Solapur"],
  "Gujarat": ["Rajkot", "Surat", "Amreli", "Junagadh", "Bhavnagar", "Ahmedabad", "Patan", "Vadodara"],
  "Karnataka": ["Davangere", "Hubballi", "Bellary", "Belagavi", "Raichur", "Shimoga", "Tumakuru", "Mysuru"],
  "Andhra Pradesh": ["Guntur", "Kurnool", "Vijayawada", "Anantapur", "Eluru", "Kadapa", "Vizianagaram"],
  "Madhya Pradesh": ["Indore", "Ujjain", "Chhindwara", "Neemuch", "Mandsaur", "Bhopal", "Jabalpur"],
  "Uttar Pradesh": ["Kanpur", "Agra", "Mathura", "Aligarh", "Bareilly", "Varanasi", "Gorakhpur", "Lucknow"],
  "Haryana": ["Karnal", "Sirsa", "Hisar", "Ambala", "Rohtak", "Kurukshetra", "Panipat"]
};

// Base price benchmarks for different crops in INR per Quintal
const CROP_BENCHMARKS: Record<string, { basePrice: number; msp: number; unit: string; trend: string; change: string }> = {
  "Cotton": { basePrice: 7250, msp: 7121, unit: "₹ / Quintal", trend: "bullish", change: "+3.4%" },
  "Rice (Paddy)": { basePrice: 3300, msp: 2300, unit: "₹ / Quintal", trend: "bullish", change: "+2.1%" },
  "Wheat": { basePrice: 2480, msp: 2275, unit: "₹ / Quintal", trend: "stable", change: "+0.5%" },
  "Maize": { basePrice: 2180, msp: 2090, unit: "₹ / Quintal", trend: "bullish", change: "+4.8%" },
  "Red Chili": { basePrice: 18500, msp: 16000, unit: "₹ / Quintal", trend: "bullish", change: "+6.2%" },
  "Turmeric": { basePrice: 14200, msp: 12500, unit: "₹ / Quintal", trend: "stable", change: "+1.2%" },
  "Soybean": { basePrice: 4650, msp: 4600, unit: "₹ / Quintal", trend: "bearish", change: "-1.5%" },
  "Groundnut": { basePrice: 6350, msp: 6377, unit: "₹ / Quintal", trend: "bullish", change: "+1.8%" },
  "Mustard": { basePrice: 5600, msp: 5650, unit: "₹ / Quintal", trend: "stable", change: "+0.8%" }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedCrop = searchParams.get('crop') || 'Cotton';
  const selectedState = searchParams.get('state') || 'Telangana';
  const selectedDistrict = searchParams.get('district') || 'All';

  // Benchmark info
  const benchmark = CROP_BENCHMARKS[selectedCrop] || CROP_BENCHMARKS['Cotton'];

  // Get available districts for selected state
  const availableDistricts = STATE_DISTRICT_MAP[selectedState] || STATE_DISTRICT_MAP['Telangana'];

  // Filter districts if user picked a specific district
  const targetDistricts = (selectedDistrict && selectedDistrict !== 'All' && availableDistricts.includes(selectedDistrict))
    ? [selectedDistrict]
    : availableDistricts;

  // Generate deterministic Mandi data for each district based on state + district name seed
  const mandis = targetDistricts.map((district, idx) => {
    // Generate slight price variations per district
    const seed = (district.charCodeAt(0) + district.charCodeAt(district.length - 1) + idx * 7) % 25;
    const variation = (seed - 12) * 25; // variance range -300 to +300
    
    const minPrice = benchmark.basePrice + variation - 150;
    const maxPrice = benchmark.basePrice + variation + 220;
    const modalPrice = Math.round((minPrice + maxPrice) / 2);

    const arrivalQty = 120 + (seed * 45); // quintals arrived today
    const isUp = seed % 2 === 0;

    return {
      name: `${district} APMC Grain Market`,
      district: district,
      state: selectedState,
      minPrice: minPrice,
      maxPrice: maxPrice,
      modalPrice: modalPrice,
      arrivalQty: arrivalQty,
      unit: 'Quintals',
      trend: isUp ? 'up' : 'down',
      demand: modalPrice > benchmark.basePrice ? 'High' : 'Moderate',
      distance: `${(idx + 1) * 14} km`
    };
  });

  // Sort mandis by highest modal price
  mandis.sort((a, b) => b.modalPrice - a.modalPrice);

  const topPrice = mandis[0]?.modalPrice || benchmark.basePrice;
  const avgPrice = Math.round(mandis.reduce((sum, m) => sum + m.modalPrice, 0) / mandis.length);

  // Recommendation logic based on MSP vs Modal Price
  let recommendedAction = `SELL NOW - Current top price of ₹${topPrice} in ${selectedState} is above the MSP baseline (₹${benchmark.msp}).`;
  if (topPrice < benchmark.msp) {
    recommendedAction = `HOLD HARVEST - Current Mandi rates are below MSP (₹${benchmark.msp}). Sell to Government procurement center or wait 2 weeks.`;
  }

  // 7-day historical pricing curve simulation
  const historicalPrices = [
    { date: 'Sep 17', price: Math.round(avgPrice * 0.96) },
    { date: 'Sep 18', price: Math.round(avgPrice * 0.97) },
    { date: 'Sep 19', price: Math.round(avgPrice * 0.98) },
    { date: 'Sep 20', price: Math.round(avgPrice * 0.985) },
    { date: 'Sep 21', price: Math.round(avgPrice * 0.99) },
    { date: 'Sep 22', price: Math.round(avgPrice * 0.995) },
    { date: 'Sep 23', price: avgPrice },
  ];

  return NextResponse.json({
    success: true,
    data: {
      crop: selectedCrop,
      state: selectedState,
      district: selectedDistrict,
      msp: benchmark.msp,
      avgPrice: avgPrice,
      topPrice: topPrice,
      priceChange: benchmark.change,
      trend: benchmark.trend,
      unit: benchmark.unit,
      recommendedAction,
      allStates: Object.keys(STATE_DISTRICT_MAP),
      allDistricts: ["All", ...availableDistricts],
      allCrops: Object.keys(CROP_BENCHMARKS),
      historicalPrices,
      mandis
    }
  });
}
