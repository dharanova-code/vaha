export interface DailySensorLog {
  date: string; // e.g. "Jul 01"
  waterConsumedLiters: number;
  averageTemperature: number;
  averageHumidity: number;
  averageTVOC: number;
  isAnomaly: boolean;
  anomalyReason: string;
}

export interface HourlySensorLog {
  time: string; // e.g. "09:00"
  waterConsumedLiters: number;
  temperature: number;
  humidity: number;
  tvoc: number;
}

export function generate45DaySensorData(): DailySensorLog[] {
  const data: DailySensorLog[] = [];
  const now = new Date();
  
  // Base values
  const baseTemp = 23.5; // °C
  const baseHumidity = 52; // %
  const baseTVOC = 250; // ppb
  const baseWater = 105; // Liters daily average

  for (let i = 44; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Format date string as e.g. "Jul 04"
    const dateLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

    // Add some pseudo-random but clean variance
    const daySeed = Math.sin(date.getDate()) * 10;
    const temp = Math.round((baseTemp + daySeed * 0.3) * 10) / 10;
    const humidity = Math.round(baseHumidity + daySeed * 1.5);
    const tvoc = Math.round(baseTVOC + daySeed * 25);
    
    let water = Math.round(baseWater + daySeed * 4);
    let isAnomaly = false;
    let anomalyReason = "";

    // Inject 3 controlled anomalies across 45 days for sustainability demos
    if (i === 5) {
      // 5 days ago: Leaky faucet alert
      water = 192;
      isAnomaly = true;
      anomalyReason = "Faucet left running in bathroom";
    } else if (i === 18) {
      // 18 days ago: Garden hose alert
      water = 245;
      isAnomaly = true;
      anomalyReason = "Garden sprinkler active too long";
    } else if (i === 32) {
      // 32 days ago: Toilet tank leak
      water = 178;
      isAnomaly = true;
      anomalyReason = "Continuous toilet tank flush bypass";
    }

    data.push({
      date: dateLabel,
      waterConsumedLiters: water,
      averageTemperature: temp,
      averageHumidity: humidity,
      averageTVOC: tvoc,
      isAnomaly,
      anomalyReason,
    });
  }

  return data;
}

export function generateHourlySensorData(): HourlySensorLog[] {
  const data: HourlySensorLog[] = [];
  const baseTemp = 22.0;
  const baseHumidity = 55;
  const baseTVOC = 220;

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
    
    // Smooth temperature variance: coldest at 5 AM, warmest at 3 PM
    const tempOffset = Math.sin(((hour - 9) / 24) * 2 * Math.PI) * 4;
    const temp = Math.round((baseTemp + tempOffset) * 10) / 10;

    // Inverse humidity relationship: highest at night, lowest in afternoon
    const humOffset = Math.sin(((hour - 21) / 24) * 2 * Math.PI) * 10;
    const humidity = Math.round(baseHumidity + humOffset);

    // TVOC spikes during cooking hours (8 AM, 1 PM, 7 PM)
    let tvoc = baseTVOC + Math.round(Math.random() * 20);
    if (hour === 8 || hour === 9) tvoc += 140;
    if (hour === 13 || hour === 14) tvoc += 90;
    if (hour === 19 || hour === 20) tvoc += 180;

    // Water flow rates: big morning peak (7-9 AM) and evening peak (6-8 PM)
    let water = 1.2; // base background flow
    if (hour === 7) water = 28.5; // Morning shower/wash
    if (hour === 8) water = 34.2;
    if (hour === 9) water = 12.0;
    if (hour === 12 || hour === 13) water = 8.5; // Lunch
    if (hour === 18) water = 16.4; // Dinner prep/dishes
    if (hour === 19) water = 22.8;
    if (hour === 20) water = 14.5;
    
    // Add minor random noise
    water = Math.round((water + Math.random() * 1.5) * 10) / 10;

    data.push({
      time: timeLabel,
      waterConsumedLiters: water,
      temperature: temp,
      humidity: humidity,
      tvoc,
    });
  }

  return data;
}

export interface TelemetryInsights {
  totalWaterLiters: number;
  averageWaterLiters: number;
  maxWaterLiters: number;
  anomaliesDetected: number;
  currentTVOC: number;
  currentTemp: number;
  currentHumidity: number;
  waterDeviationPercentage: number; // Today vs 3-week average
}

export function calculateTelemetryInsights(data: DailySensorLog[]): TelemetryInsights {
  if (data.length === 0) {
    return {
      totalWaterLiters: 0,
      averageWaterLiters: 0,
      maxWaterLiters: 0,
      anomaliesDetected: 0,
      currentTVOC: 0,
      currentTemp: 0,
      currentHumidity: 0,
      waterDeviationPercentage: 0,
    };
  }

  const totalWater = data.reduce((sum, item) => sum + item.waterConsumedLiters, 0);
  const maxWater = Math.max(...data.map(item => item.waterConsumedLiters));
  const anomaliesCount = data.filter(item => item.isAnomaly).length;

  // Calculate past 3-week average (excluding today)
  const history = data.slice(0, -1);
  const averageWater = history.length > 0
    ? Math.round(history.reduce((sum, item) => sum + item.waterConsumedLiters, 0) / history.length)
    : 105;

  const today = data[data.length - 1]!;
  const deviation = averageWater > 0
    ? Math.round(((today.waterConsumedLiters - averageWater) / averageWater) * 100)
    : 0;

  return {
    totalWaterLiters: totalWater,
    averageWaterLiters: averageWater,
    maxWaterLiters: maxWater,
    anomaliesDetected: anomaliesCount,
    currentTVOC: today.averageTVOC,
    currentTemp: today.averageTemperature,
    currentHumidity: today.averageHumidity,
    waterDeviationPercentage: deviation,
  };
}
