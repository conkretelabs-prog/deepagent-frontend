'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { ChartBarIcon, CogIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ServiceStatusCard from './ServiceStatusCard';
import DeploymentHistory from './DeploymentHistory';
import HealthMetrics from './HealthMetrics';
import ActivityLog from './ActivityLog';
import ManualControls from './ManualControls';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: systemStatus, error: statusError } = useSWR('/api/system/status', fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  });
  
  const { data: deployments } = useSWR('/api/deployments', fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
  });
  
  const { data: healthMetrics } = useSWR('/api/health/metrics', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });
  
  const { data: activityLog } = useSWR('/api/activity', fetcher, {
    refreshInterval: 15000, // Refresh every 15 seconds
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'deployments', name: 'Deployments', icon: CogIcon },
    { id: 'health', name: 'Health', icon: ExclamationTriangleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">DeepAgent Dashboard</h1>
              <div className="ml-4 flex items-center">
                <div className={`h-3 w-3 rounded-full ${
                  systemStatus?.overall === 'healthy' ? 'bg-green-400' : 
                  systemStatus?.overall === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                }`}></div>
                <span className="ml-2 text-sm text-gray-600">
                  {systemStatus?.overall === 'healthy' ? 'All Systems Operational' :
                   systemStatus?.overall === 'warning' ? 'Some Issues Detected' : 'Critical Issues'}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Service Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceStatusCard
                service="Railway"
                status={systemStatus?.railway?.status || 'unknown'}
                metrics={systemStatus?.railway?.metrics}
                lastDeployment={systemStatus?.railway?.lastDeployment}
              />
              <ServiceStatusCard
                service="GitHub"
                status={systemStatus?.github?.status || 'unknown'}
                metrics={systemStatus?.github?.metrics}
                lastDeployment={systemStatus?.github?.lastDeployment}
              />
              <ServiceStatusCard
                service="Vercel"
                status={systemStatus?.vercel?.status || 'unknown'}
                metrics={systemStatus?.vercel?.metrics}
                lastDeployment={systemStatus?.vercel?.lastDeployment}
              />
            </div>

            {/* Recent Activity and Manual Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ActivityLog activities={activityLog?.recent || []} />
              <ManualControls />
            </div>
          </div>
        )}

        {activeTab === 'deployments' && (
          <DeploymentHistory deployments={deployments || []} />
        )}

        {activeTab === 'health' && (
          <HealthMetrics metrics={healthMetrics || {}} />
        )}
      </main>
    </div>
  );
}
