import { NextResponse } from 'next/server';

// Standard per-acre fertilizer dosage parameters for key crops
const CROP_DOSAGE_PER_ACRE: Record<string, {
  ureaBags: number; // per acre 50kg bags
  dapBags: number;  // per acre 50kg bags
  mopBags: number;  // per acre 50kg bags
  nanoUreaBottles: number; // 500ml bottles
  liquidNpkLiters: number; // 1L bottles
  zincSulfateKg: number;  // kg
  organicCompostTons: number; // tons
}> = {
  "Cotton": { ureaBags: 2.0, dapBags: 1.0, mopBags: 0.8, nanoUreaBottles: 2, liquidNpkLiters: 1.5, zincSulfateKg: 5, organicCompostTons: 2.0 },
  "Rice (Paddy)": { ureaBags: 1.8, dapBags: 1.2, mopBags: 0.6, nanoUreaBottles: 2, liquidNpkLiters: 1.0, zincSulfateKg: 10, organicCompostTons: 2.5 },
  "Wheat": { ureaBags: 1.6, dapBags: 1.0, mopBags: 0.5, nanoUreaBottles: 1.5, liquidNpkLiters: 1.0, zincSulfateKg: 5, organicCompostTons: 2.0 },
  "Maize": { ureaBags: 2.2, dapBags: 1.2, mopBags: 0.8, nanoUreaBottles: 2, liquidNpkLiters: 2.0, zincSulfateKg: 8, organicCompostTons: 3.0 },
  "Red Chili": { ureaBags: 2.5, dapBags: 1.5, mopBags: 1.2, nanoUreaBottles: 3, liquidNpkLiters: 2.5, zincSulfateKg: 10, organicCompostTons: 4.0 },
  "Sugarcane": { ureaBags: 4.0, dapBags: 2.0, mopBags: 1.5, nanoUreaBottles: 4, liquidNpkLiters: 3.0, zincSulfateKg: 15, organicCompostTons: 5.0 },
  "Soybean": { ureaBags: 0.6, dapBags: 1.0, mopBags: 0.5, nanoUreaBottles: 1, liquidNpkLiters: 1.0, zincSulfateKg: 5, organicCompostTons: 1.5 },
  "Tomato": { ureaBags: 2.2, dapBags: 1.4, mopBags: 1.0, nanoUreaBottles: 2.5, liquidNpkLiters: 2.0, zincSulfateKg: 8, organicCompostTons: 3.5 },
  "Mustard": { ureaBags: 1.2, dapBags: 0.8, mopBags: 0.4, nanoUreaBottles: 1.5, liquidNpkLiters: 1.0, zincSulfateKg: 5, organicCompostTons: 1.5 }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { crop, landArea, landUnit } = body;

    const acres = Number(landArea) || 1;
    let multiplier = acres;
    if (landUnit === 'Hectares') multiplier = acres * 2.471;
    if (landUnit === 'Gunta') multiplier = acres * 0.025;

    const baseDosage = CROP_DOSAGE_PER_ACRE[crop] || CROP_DOSAGE_PER_ACRE["Cotton"];

    const totalUreaBags = Math.round(baseDosage.ureaBags * multiplier * 10) / 10;
    const totalDapBags = Math.round(baseDosage.dapBags * multiplier * 10) / 10;
    const totalMopBags = Math.round(baseDosage.mopBags * multiplier * 10) / 10;

    const totalNanoUreaBottles = Math.ceil(baseDosage.nanoUreaBottles * multiplier);
    const totalLiquidNpkLiters = Math.round(baseDosage.liquidNpkLiters * multiplier * 10) / 10;
    const totalZincSulfateKg = Math.round(baseDosage.zincSulfateKg * multiplier * 10) / 10;
    const totalOrganicCompostTons = Math.round(baseDosage.organicCompostTons * multiplier * 10) / 10;

    const schedule = [
      {
        stage: "Basal Application (At Sowing)",
        timeline: "Day 0",
        solidFertilizers: [
          `DAP (18:46:0): ${totalDapBags} Bags (50kg each)`,
          `MOP / Potash: ${Math.round(totalMopBags * 0.5 * 10) / 10} Bags`,
          `Zinc Sulfate: ${totalZincSulfateKg} kg`,
          `Well-rotted Farmyard Manure: ${totalOrganicCompostTons} Tons`
        ],
        liquidFertilizers: ["Root dip or soil drenching with Bio-NPK Consortium (500ml/Acre)"],
        instructions: "Mix DAP and Potash thoroughly into the topsoil prior to seed sowing."
      },
      {
        stage: "First Top Dressing (Vegetative Growth)",
        timeline: "25 - 30 Days After Sowing",
        solidFertilizers: [
          `Urea (46% N): ${Math.round(totalUreaBags * 0.5 * 10) / 10} Bags (50kg)`
        ],
        liquidFertilizers: [
          `IFFCO Nano Urea Liquid: ${Math.ceil(totalNanoUreaBottles * 0.5)} Bottles (500ml each) mixed with 150L water/Acre`
        ],
        instructions: "Apply Urea top dressing when soil has adequate moisture. Spray Nano Urea on leaves."
      },
      {
        stage: "Second Top Dressing & Flowering Stage",
        timeline: "50 - 60 Days After Sowing",
        solidFertilizers: [
          `Urea (46% N): ${Math.round(totalUreaBags * 0.5 * 10) / 10} Bags`,
          `MOP / Potash: ${Math.round(totalMopBags * 0.5 * 10) / 10} Bags`
        ],
        liquidFertilizers: [
          `Liquid NPK (19:19:19 / 0:52:34): ${totalLiquidNpkLiters} Liters for foliar spray`,
          `Boron 20%: ${Math.round(250 * multiplier)} grams in 200L water`
        ],
        instructions: "Foliar spray of 19:19:19 improves flower retention and boll/fruit formation."
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        crop,
        landArea: acres,
        landUnit: landUnit || 'Acres',
        effectiveAcres: Math.round(multiplier * 100) / 100,
        totals: {
          ureaBags: totalUreaBags,
          dapBags: totalDapBags,
          mopBags: totalMopBags,
          nanoUreaBottles: totalNanoUreaBottles,
          liquidNpkLiters: totalLiquidNpkLiters,
          zincSulfateKg: totalZincSulfateKg,
          organicCompostTons: totalOrganicCompostTons
        },
        fertilizerDetails: [
          { name: "Urea (46% Nitrogen)", type: "Solid Bag (50kg)", quantity: `${totalUreaBags} Bags`, role: "Promotes rapid vegetative growth and leaf greenness." },
          { name: "DAP (Diammonium Phosphate 18:46:0)", type: "Solid Bag (50kg)", quantity: `${totalDapBags} Bags`, role: "Stimulates strong root establishment & early vigour." },
          { name: "MOP (Muriate of Potash 0:0:60)", type: "Solid Bag (50kg)", quantity: `${totalMopBags} Bags`, role: "Enhances pest resistance, drought tolerance & grain weight." },
          { name: "IFFCO Nano Urea Liquid", type: "Liquid Bottle (500ml)", quantity: `${totalNanoUreaBottles} Bottles`, role: "Eco-friendly liquid spray with 80%+ nitrogen absorption efficiency." },
          { name: "Liquid NPK (19:19:19 / 0:52:34)", type: "Liquid Spray (1L)", quantity: `${totalLiquidNpkLiters} Liters`, role: "Instant nutrient boost during flowering & fruiting." },
          { name: "Zinc Sulfate (33% Zn)", type: "Micronutrient Powder", quantity: `${totalZincSulfateKg} kg`, role: "Prevents leaf yellowing & zinc deficiency." },
          { name: "Farmyard Manure / Organic Compost", type: "Organic Bulk", quantity: `${totalOrganicCompostTons} Tons`, role: "Improves soil organic carbon & water retention." }
        ],
        schedule
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Calculation failed' }, { status: 500 });
  }
}
