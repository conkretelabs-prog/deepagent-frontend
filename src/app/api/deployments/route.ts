import { NextResponse } from 'next/server';

export async function GET() {
  // Mock deployment data
  const mockDeployments = [
    {
      id: '1',
      service: 'Railway Backend',
      version: 'v1.2.4',
      status: 'success',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      duration: 45,
      author: 'DeepAgent',
      commitMessage: 'Fix database connection pooling issue',
    },
    {
      id: '2',
      service: 'Vercel Frontend',
      version: 'v1.2.4',
      status: 'success',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      duration: 32,
      author: 'DeepAgent',
      commitMessage: 'Update dashboard interface with new monitoring features',
    },
    {
      id: '3',
      service: 'Railway Worker',
      version: 'v1.2.3',
      status: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      duration: 28,
      author: 'DeepAgent',
      commitMessage: 'Optimize Celery worker performance',
    },
    {
      id: '4',
      service: 'Railway Database',
      version: 'v1.2.2',
      status: 'failed',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      duration: 15,
      author: 'DeepAgent',
      commitMessage: 'Database migration rollback due to constraint violation',
    },
    {
      id: '5',
      service: 'Vercel Frontend',
      version: 'v1.2.3',
      status: 'success',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      duration: 41,
      author: 'DeepAgent',
      commitMessage: 'Add real-time notifications for deployment status',
    },
  ];
  
  return NextResponse.json(mockDeployments);
}
