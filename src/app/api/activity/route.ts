import { NextResponse } from 'next/server';

export async function GET() {
  const mockActivities = {
    recent: [
      {
        id: '1',
        type: 'deployment',
        message: 'Successfully deployed Railway backend v1.2.4',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        service: 'Railway',
        details: 'Fixed database connection pooling issue',
      },
      {
        id: '2',
        type: 'fix',
        message: 'Automatically resolved Redis connection timeout',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        service: 'Redis',
        details: 'Increased connection timeout and retry attempts',
      },
      {
        id: '3',
        type: 'monitoring',
        message: 'Health check completed - all services operational',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        details: 'Response times within acceptable thresholds',
      },
      {
        id: '4',
        type: 'deployment',
        message: 'Deployed Vercel frontend v1.2.4',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        service: 'Vercel',
        details: 'Updated dashboard interface with new monitoring features',
      },
      {
        id: '5',
        type: 'fix',
        message: 'Scaled up Celery workers due to high queue length',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        service: 'Celery',
        details: 'Increased worker count from 2 to 4 instances',
      },
      {
        id: '6',
        type: 'error',
        message: 'Database migration failed - rolled back to previous version',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        service: 'PostgreSQL',
        details: 'Constraint violation detected, automatic rollback initiated',
      },
    ],
  };
  
  return NextResponse.json(mockActivities);
}
