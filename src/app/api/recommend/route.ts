import { NextResponse } from 'next/server';

// This is a mock AI recommendation engine
// In a real application, this would call a Python ML endpoint or an external AI service
export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, season } = data;

        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Basic logic for demonstration (A real ML model would use robust algorithms)
        let recommendations = [];

        if (season === 'summer') {
            if (temperature > 25 && rainfall < 50) {
                recommendations = [
                    { crop: 'Millet', confidence: 92, reason: 'High heat tolerance, low water requirement.' },
                    { crop: 'Sorghum', confidence: 85, reason: 'Drought resistant.' }
                ];
            } else {
                recommendations = [
                    { crop: 'Cotton', confidence: 88, reason: 'Suitable for summer with moderate water.' },
                    { crop: 'Maize', confidence: 80, reason: 'Good summer crop if moisture is maintained.' }
                ];
            }
        } else if (season === 'winter') {
            if (temperature < 20) {
                recommendations = [
                    { crop: 'Wheat', confidence: 95, reason: 'Ideal winter crop for cooler climates.' },
                    { crop: 'Mustard', confidence: 89, reason: 'Thrives in winter conditions.' }
                ];
            } else {
                recommendations = [
                    { crop: 'Chickpea', confidence: 82, reason: 'Good winter leguminous crop.' }
                ];
            }
        } else if (season === 'monsoon') {
            if (rainfall > 100) {
                recommendations = [
                    { crop: 'Rice', confidence: 96, reason: 'Requires standing water, perfect for heavy monsoon.' },
                    { crop: 'Sugarcane', confidence: 85, reason: 'Heavy water requirement crop.' }
                ];
            } else {
                recommendations = [
                    { crop: 'Soybean', confidence: 90, reason: 'Good for moderate monsoon.' }
                ];
            }
        } else {
            // fallback generic
            recommendations = [
                { crop: 'Tomato', confidence: 75, reason: 'Versatile crop for moderate conditions.' },
                { crop: 'Potato', confidence: 70, reason: 'Can be grown in varied conditions with care.' }
            ]
        }

        // Fertilizer recommendation based on NPK
        let fertilizer = "Balanced NPK (19:19:19)";
        let actions = [];
        if (nitrogen < 30) {
            fertilizer = "Urea or Nitrogen-rich fertilizer";
            actions.push("Add organic compost to boost long-term Nitrogen.");
        }
        if (phosphorus < 20) {
            fertilizer = "DAP (Diammonium Phosphate)";
            actions.push("Apply bone meal for natural phosphorus.");
        }
        if (ph < 5.5) {
            actions.push("Soil is too acidic. Apply agricultural lime.");
        } else if (ph > 7.5) {
            actions.push("Soil is too alkaline. Apply sulfur or peat moss.");
        }

        return NextResponse.json({
            success: true,
            recommendations,
            soilHealth: {
                fertilizer,
                actions,
                status: nitrogen > 30 && phosphorus > 30 && potassium > 30 ? 'Good' : 'Needs attention'
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Processing failed' }, { status: 500 });
    }
}
