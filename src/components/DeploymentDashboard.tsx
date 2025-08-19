'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  ServerIcon,
  DatabaseIcon,
  CpuChipIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'warning' | 'unknown';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  url?: string;
}

interface DeploymentStatus {
  id: string;
  service: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  timestamp: string;
  duration: number;
  commit?: string;
  branch?: string;
}

interface SystemMetrics {
  timestamp: string;
  cpu: number;
  memory: number;
  responseTime: number;
  requests: number;
}

const DeploymentDashboard: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Django Web Service',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 245,
      lastCheck: '2 minutes ago',
      url: 'https://deepagent-production.railway.app'
    },
    {
      name: 'PostgreSQL Database',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 12,
      lastCheck: '1 minute ago'
    },
    {
      name: 'Redis Cache',
      status: 'healthy',
      uptime: 99.7,
      responseTime: 8,
      lastCheck: '1 minute ago'
    },
    {
      name: 'Celery Worker',
      status: 'warning',
      uptime: 98.5,
      responseTime: 156,
      lastCheck: '3 minutes ago'
    }
  ]);

  const [deployments, setDeployments] = useState<DeploymentStatus[]>([
    {
      id: 'dep-001',
      service: 'Django Web',
      status: 'success',
      timestamp: '2025-08-19T18:30:00Z',
      duration: 180,
      commit: 'a1b2c3d',
      branch: 'main'
    },
    {
      id: 'dep-002',
      service: 'Celery Worker',
      status: 'success',
      timestamp: '2025-08-19T18:25:00Z',
      duration: 120,
      commit: 'a1b2c3d',
      branch: 'main'
    },
    {
      id: 'dep-003',
      service: 'Frontend',
      status: 'running',
      timestamp: '2025-08-19T18:45:00Z',
      duration: 45,
      commit: 'e4f5g6h',
      branch: 'main'
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetrics[]>([
    { timestamp: '18:30', cpu: 45, memory: 62, responseTime: 245, requests: 1250 },
    { timestamp: '18:35', cpu: 52, memory: 58, responseTime: 289, requests: 1180 },
    { timestamp: '18:40', cpu: 38, memory: 65, responseTime: 198, requests: 1420 },
    { timestamp: '18:45', cpu: 41, memory: 61, responseTime: 234, requests: 1350 }
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setServices(prev => prev.map(service => ({
          ...service,
          responseTime: service.responseTime + Math.random() * 20 - 10,
          lastCheck: 'Just now'
        })));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'unhealthy':
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'unhealthy':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤖 DeepAgent Dashboard</h1>
              <p className="text-gray-600 mt-2">Autonomous Deployment Manager - Real-time Monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                Auto-refresh
              </label>
              <div className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {service.name.includes('Database') ? (
                    <DatabaseIcon className="h-8 w-8 text-blue-500 mr-3" />
                  ) : service.name.includes('Redis') ? (
                    <ServerIcon className="h-8 w-8 text-red-500 mr-3" />
                  ) : (
                    <CpuChipIcon className="h-8 w-8 text-green-500 mr-3" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.lastCheck}</p>
                  </div>
                </div>
                {getStatusIcon(service.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Uptime</span>
                  <span className="text-sm font-medium">{service.uptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium">{Math.round(service.responseTime)}ms</span>
                </div>
                <div className="mt-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Response Time Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Response Time Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* System Resources Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CpuChipIcon className="h-5 w-5 mr-2" />
              System Resources
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cpu" fill="#10B981" name="CPU %" />
                <Bar dataKey="memory" fill="#F59E0B" name="Memory %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Deployments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Deployments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deployments.map((deployment) => (
                  <tr key={deployment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {deployment.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(deployment.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deployment.status)}`}>
                          {deployment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deployment.duration}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {deployment.commit}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(deployment.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentDashboard;