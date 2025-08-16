import { NextResponse } from 'next/server';

function generateTimeSeriesData(hours: number, baseValue: number, variance: number) {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const value = baseValue + (Math.random() - 0.5) * variance;
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.max(0, value),
    });
  }
  
  return data;
}

export async function GET() {
  const mockMetrics = {
    responseTime: generateTimeSeriesData(24, 250, 100),
    errorRate: generateTimeSeriesData(24, 0.5, 1),
    uptime: generateTimeSeriesData(24, 99.8, 0.4),
    memoryUsage: generateTimeSeriesData(24, 65, 20),
    cpuUsage: generateTimeSeriesData(24, 45, 30),
  };
  
  return NextResponse.json(mockMetrics);
}
