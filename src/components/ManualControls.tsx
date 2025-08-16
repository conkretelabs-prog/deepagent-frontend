'use client';

import { useState } from 'react';
import { 
  PlayIcon, 
  ArrowPathIcon, 
  StopIcon,
  WrenchIcon 
} from '@heroicons/react/24/outline';

export default function ManualControls() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedService, setSelectedService] = useState('railway');

  const handleDeploy = async (service: string) => {
    setIsDeploying(true);
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service }),
      });
      
      if (response.ok) {
        // Handle success
        console.log(`Deployment triggered for ${service}`);
      } else {
        // Handle error
        console.error(`Failed to deploy ${service}`);
      }
    } catch (error) {
      console.error('Deployment error:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleRestart = async (service: string) => {
    try {
      const response = await fetch('/api/restart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service }),
      });
      
      if (response.ok) {
        console.log(`Service ${service} restarted`);
      } else {
        console.error(`Failed to restart ${service}`);
      }
    } catch (error) {
      console.error('Restart error:', error);
    }
  };

  const handleHealthCheck = async () => {
    try {
      const response = await fetch('/api/health/check', {
        method: 'POST',
      });
      
      if (response.ok) {
        console.log('Health check initiated');
      } else {
        console.error('Failed to initiate health check');
      }
    } catch (error) {
      console.error('Health check error:', error);
    }
  };

  const services = [
    { id: 'railway', name: 'Railway', color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'vercel', name: 'Vercel', color: 'bg-black hover:bg-gray-800' },
    { id: 'github', name: 'GitHub', color: 'bg-gray-800 hover:bg-gray-900' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Manual Controls</h2>
        <p className="text-sm text-gray-600 mt-1">
          Override autonomous operations when needed
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Service
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDeploy(selectedService)}
            disabled={isDeploying}
            className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              services.find(s => s.id === selectedService)?.color
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isDeploying ? (
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PlayIcon className="h-4 w-4 mr-2" />
            )}
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </button>

          <button
            onClick={() => handleRestart(selectedService)}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Restart
          </button>
        </div>

        {/* System Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">System Actions</h3>
          <div className="space-y-2">
            <button
              onClick={handleHealthCheck}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <WrenchIcon className="h-4 w-4 mr-2" />
              Run Health Check
            </button>
            
            <button
              className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <StopIcon className="h-4 w-4 mr-2" />
              Emergency Stop
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Autonomous Mode:</span>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
