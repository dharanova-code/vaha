export interface DailySensorLog {
  date: string; // e.g. "Jul 01"
  waterConsumedLiters: number;
  averageTemperature: number;
  averageHumidity: number;
  averageTVOC: number;
  isAnomaly: boolean;
  anomalyReason: string;
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
