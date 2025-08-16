'use client';

import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface Deployment {
  id: string;
  service: string;
  version: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  duration?: number;
  author: string;
  commitMessage?: string;
}

interface DeploymentHistoryProps {
  deployments: Deployment[];
}

export default function DeploymentHistory({ deployments }: DeploymentHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-800';
      case 'failed':
        return 'bg-red-50 text-red-800';
      case 'pending':
        return 'bg-yellow-50 text-yellow-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Deployment History</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {deployments.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No deployments found
          </div>
        ) : (
          deployments.map((deployment) => (
            <div key={deployment.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{deployment.service}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getStatusColor(deployment.status)
                      }`}>
                        {deployment.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Version {deployment.version} by {deployment.author}
                    </div>
                    {deployment.commitMessage && (
                      <div className="text-sm text-gray-500 mt-1">
                        {deployment.commitMessage}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <div>{formatDistanceToNow(new Date(deployment.timestamp), { addSuffix: true })}</div>
                  {deployment.duration && (
                    <div className="text-xs">{deployment.duration}s duration</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
