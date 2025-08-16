'use client';

import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'deployment' | 'fix' | 'monitoring' | 'error';
  message: string;
  timestamp: string;
  service?: string;
  details?: string;
}

interface ActivityLogProps {
  activities: Activity[];
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deployment':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'fix':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'monitoring':
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'deployment':
        return 'bg-blue-50 border-blue-200';
      case 'fix':
        return 'bg-green-50 border-green-200';
      case 'monitoring':
        return 'bg-gray-50 border-gray-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No recent activity
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    
                    {activity.service && (
                      <p className="text-xs text-gray-600 mt-1">
                        Service: {activity.service}
                      </p>
                    )}
                    
                    {activity.details && (
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
