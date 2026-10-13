import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'Punjab, India';

  // Mock comprehensive weather data tailored for agricultural intelligence
  const weatherData: Record<string, any> = {
    'Punjab, India': {
      location: 'Punjab, India',
      temp: 28,
      condition: 'Partly Cloudy',
      humidity: 62,
      windSpeed: 12,
      uvIndex: 6,
      soilTemp: 22,
      soilMoisture: 48,
      evapotranspiration: '4.2 mm/day',
      alerts: [
        { severity: 'warning', title: 'Rainfall Alert', message: 'Moderate rain expected in 36 hours (18-25mm). Hold off on heavy fertilizer application.' }
      ],
      forecast: [
        { day: 'Mon', tempMax: 29, tempMin: 18, rainProb: 10, humidity: 60, icon: 'sun' },
        { day: 'Tue', tempMax: 27, tempMin: 17, rainProb: 75, humidity: 82, icon: 'rain' },
        { day: 'Wed', tempMax: 25, tempMin: 16, rainProb: 60, humidity: 78, icon: 'cloud-rain' },
        { day: 'Thu', tempMax: 28, tempMin: 17, rainProb: 20, humidity: 64, icon: 'cloud' },
        { day: 'Fri', tempMax: 30, tempMin: 19, rainProb: 5, humidity: 55, icon: 'sun' },
        { day: 'Sat', tempMax: 31, tempMin: 20, rainProb: 0, humidity: 50, icon: 'sun' },
        { day: 'Sun', tempMax: 30, tempMin: 19, rainProb: 15, humidity: 58, icon: 'cloud-sun' },
      ],
      irrigationAdvice: 'Soil moisture is optimal (48%). Next automated irrigation cycle recommended in 3 days post-rain.'
    },
    'Maharashtra, India': {
      location: 'Maharashtra, India',
      temp: 33,
      condition: 'Sunny & Dry',
      humidity: 45,
      windSpeed: 15,
      uvIndex: 8,
      soilTemp: 27,
      soilMoisture: 32,
      evapotranspiration: '5.8 mm/day',
      alerts: [
        { severity: 'danger', title: 'Heatwave & High Evaporation Alert', message: 'High temperatures causing rapid moisture loss. Schedule drip irrigation during early morning hours.' }
      ],
      forecast: [
        { day: 'Mon', tempMax: 33, tempMin: 22, rainProb: 0, humidity: 45, icon: 'sun' },
        { day: 'Tue', tempMax: 34, tempMin: 23, rainProb: 5, humidity: 42, icon: 'sun' },
        { day: 'Wed', tempMax: 35, tempMin: 24, rainProb: 10, humidity: 40, icon: 'sun' },
        { day: 'Thu', tempMax: 33, tempMin: 22, rainProb: 15, humidity: 48, icon: 'cloud-sun' },
        { day: 'Fri', tempMax: 32, tempMin: 21, rainProb: 30, humidity: 55, icon: 'cloud' },
        { day: 'Sat', tempMax: 31, tempMin: 21, rainProb: 40, humidity: 60, icon: 'rain' },
        { day: 'Sun', tempMax: 32, tempMin: 22, rainProb: 20, humidity: 52, icon: 'cloud-sun' },
      ],
      irrigationAdvice: 'Low soil moisture (32%). Deep irrigation needed immediately for cotton and sugarcane crops.'
    },
    'Iowa, USA': {
      location: 'Iowa, USA',
      temp: 21,
      condition: 'Mild & Clear',
      humidity: 55,
      windSpeed: 18,
      uvIndex: 5,
      soilTemp: 16,
      soilMoisture: 65,
      evapotranspiration: '3.1 mm/day',
      alerts: [
        { severity: 'info', title: 'Optimal Sowing Conditions', message: 'Soil temperature and moisture levels ideal for corn planting this week.' }
      ],
      forecast: [
        { day: 'Mon', tempMax: 21, tempMin: 11, rainProb: 5, humidity: 55, icon: 'sun' },
        { day: 'Tue', tempMax: 22, tempMin: 12, rainProb: 10, humidity: 52, icon: 'sun' },
        { day: 'Wed', tempMax: 20, tempMin: 10, rainProb: 25, humidity: 62, icon: 'cloud' },
        { day: 'Thu', tempMax: 18, tempMin: 8, rainProb: 70, humidity: 80, icon: 'rain' },
        { day: 'Fri', tempMax: 19, tempMin: 9, rainProb: 35, humidity: 70, icon: 'cloud-rain' },
        { day: 'Sat', tempMax: 21, tempMin: 11, rainProb: 10, humidity: 58, icon: 'cloud-sun' },
        { day: 'Sun', tempMax: 23, tempMin: 13, rainProb: 0, humidity: 50, icon: 'sun' },
      ],
      irrigationAdvice: 'Soil moisture is high (65%). No artificial irrigation needed for the next 5 days.'
    }
  };

  const selectedData = weatherData[location] || {
    ...weatherData['Punjab, India'],
    location: location
  };

  return NextResponse.json({ success: true, data: selectedData });
}
