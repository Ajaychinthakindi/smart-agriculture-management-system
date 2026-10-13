import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cropType, sampleId } = body;

    // Simulate AI model inference processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const diseaseDatabase: Record<string, any> = {
      'tomato_blight': {
        diseaseName: 'Tomato Early Blight (Alternaria solani)',
        crop: 'Tomato',
        confidence: 94.8,
        severity: 'Moderate (35% Leaf Coverage)',
        pathogen: 'Fungal Pathogen',
        symptoms: 'Concentric dark rings (bullseye shape) on mature lower leaves surrounded by yellow chlorotic halos.',
        treatment: {
          organic: 'Apply Neem oil spray (5ml/L) or Copper Octanoate solution every 7 days.',
          chemical: 'Spray Chlorothalonil 75% WP @ 2g/L or Mancozeb 75% WP @ 2.5g/L.',
          preventive: 'Ensure proper plant spacing for airflow, stake tomatoes off moist ground, avoid overhead irrigation.'
        }
      },
      'paddy_blight': {
        diseaseName: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
        crop: 'Rice / Paddy',
        confidence: 96.2,
        severity: 'Severe (60% Leaf Coverage)',
        pathogen: 'Bacterial Pathogen',
        symptoms: 'Water-soaked lesions on leaf margins rapidly elongating into yellow-white wavy stripes.',
        treatment: {
          organic: 'Spray fresh cow dung slurry filtrate (20%) mixed with Asafoetida (1g/L).',
          chemical: 'Spray Streptocycline @ 0.1g/L + Copper Oxychloride @ 2.5g/L.',
          preventive: 'Avoid excessive nitrogenous fertilizer application. Drain field temporarily for 3-4 days.'
        }
      },
      'corn_rust': {
        diseaseName: 'Common Corn Rust (Puccinia sorghi)',
        crop: 'Maize / Corn',
        confidence: 91.5,
        severity: 'Mild (15% Leaf Coverage)',
        pathogen: 'Fungal Pathogen',
        symptoms: 'Small, golden-brown to cinnamon-brown pustules scattered across upper leaf surfaces.',
        treatment: {
          organic: 'Spray sulfur dust or potassium bicarbonate solution during early morning.',
          chemical: 'Spray Azoxystrobin 23% SC @ 1ml/L or Propiconazole 25% EC @ 1ml/L.',
          preventive: 'Plant rust-resistant hybrids and rotate crops with non-cereal legumes.'
        }
      },
      'healthy_leaf': {
        diseaseName: 'Healthy Crop Leaf (No Pathogens Detected)',
        crop: 'General',
        confidence: 99.1,
        severity: 'Healthy (0% Infection)',
        pathogen: 'None',
        symptoms: 'Vibrant green tissue, robust cellular density, optimal chlorophyll levels.',
        treatment: {
          organic: 'Maintain current organic compost & micronutrient foliar spray schedule.',
          chemical: 'No chemical fungicides needed.',
          preventive: 'Continue routine soil testing and preventive bio-fertilizer application.'
        }
      }
    };

    const result = diseaseDatabase[sampleId] || diseaseDatabase['tomato_blight'];

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Scan failed' }, { status: 500 });
  }
}
