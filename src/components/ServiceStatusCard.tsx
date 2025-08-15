'use client';

import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface ServiceStatusCardProps {
  service: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  metrics?: {
    uptime?: number;
    responseTime?: number;
    errorRate?: number;
  };
  lastDeployment?: {
    timestamp: string;
    version: string;
    status: string;
  };
}

export default function ServiceStatusCard({ service, status, metrics, lastDeployment }: ServiceStatusCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg border-2 p-6 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{service}</h3>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className="font-medium capitalize">{status}</span>
        </div>
        
        {metrics && (
          <>
            {metrics.uptime !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium">{(metrics.uptime * 100).toFixed(2)}%</span>
              </div>
            )}
            
            {metrics.responseTime !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Response Time:</span>
                <span className="font-medium">{metrics.responseTime}ms</span>
              </div>
            )}
            
            {metrics.errorRate !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Error Rate:</span>
                <span className="font-medium">{(metrics.errorRate * 100).toFixed(2)}%</span>
              </div>
            )}
          </>
        )}
        
        {lastDeployment && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Last Deployment</div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">{lastDeployment.version}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">When:</span>
              <span className="font-medium">
                {formatDistanceToNow(new Date(lastDeployment.timestamp), { addSuffix: true })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
