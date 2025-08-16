import { NextResponse } from 'next/server';

// Mock data - in a real implementation, this would fetch from actual services
export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const mockStatus = {
    overall: 'healthy',
    railway: {
      status: 'healthy',
      metrics: {
        uptime: 0.9998,
        responseTime: 245,
        errorRate: 0.001,
      },
      lastDeployment: {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        version: 'v1.2.3',
        status: 'success',
      },
    },
    github: {
      status: 'healthy',
      metrics: {
        uptime: 1.0,
        responseTime: 156,
        errorRate: 0.0,
      },
      lastDeployment: {
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        version: 'v1.2.4',
        status: 'success',
      },
    },
    vercel: {
      status: 'healthy',
      metrics: {
        uptime: 0.9995,
        responseTime: 89,
        errorRate: 0.002,
      },
      lastDeployment: {
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        version: 'v1.2.4',
        status: 'success',
      },
    },
  };
  
  return NextResponse.json(mockStatus);
}
