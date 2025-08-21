// src/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ServerIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import useSWR from 'swr';
import { format } from 'date-fns';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'warning';
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
  branch: string;
  commit: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data: services, error: servicesError } = useSWR<ServiceStatus[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services/status`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const { data: deployments, error: deploymentsError } = useSWR<DeploymentStatus[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/deployments/recent`,
    fetcher,
    { refreshInterval: 60000 }
  );

  const { data: metrics, error: metricsError } = useSWR<SystemMetrics>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/metrics/system`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'unhealthy':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'warning':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'unhealthy':
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'warning':
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'running':
        return <CpuChipIcon className="h-5 w-5 animate-spin" />;
      default:
        return <ServerIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CpuChipIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DeepAgent Dashboard</h1>
                <p className="text-sm text-gray-500">Autonomous Deployment Manager</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {format(new Date(), 'HH:mm:ss')}
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CpuChipIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">CPU Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.cpu}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metrics.cpu > 80 ? 'bg-red-500' : metrics.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${metrics.cpu}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CircleStackIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Memory</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.memory}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metrics.memory > 85 ? 'bg-red-500' : metrics.memory > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${metrics.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ServerIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Disk Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.disk}%</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metrics.disk > 90 ? 'bg-red-500' : metrics.disk > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${metrics.disk}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <CloudIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Network</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.network} MB/s</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-indigo-500"
                    style={{ width: `${Math.min(metrics.network * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Service Status</h2>
            </div>
            <div className="p-6">
              {servicesError && (
                <div className="text-red-600 text-sm mb-4">
                  Failed to load service status
                </div>
              )}
              {services ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                          <p className="text-xs text-gray-500">
                            Uptime: {service.uptime}% | Response: {service.responseTime}ms
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(service.lastCheck), 'HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Deployments */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Deployments</h2>
            </div>
            <div className="p-6">
              {deploymentsError && (
                <div className="text-red-600 text-sm mb-4">
                  Failed to load deployment history
                </div>
              )}
              {deployments ? (
                <div className="space-y-4">
                  {deployments.map((deployment) => (
                    <div key={deployment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${getStatusColor(deployment.status)}`}>
                          {getStatusIcon(deployment.status)}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{deployment.service}</h3>
                          <p className="text-xs text-gray-500">
                            {deployment.branch} • {deployment.commit.substring(0, 7)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deployment.status)}`}>
                          {deployment.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(deployment.timestamp), 'MMM dd, HH:mm')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {deployment.duration}s
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}