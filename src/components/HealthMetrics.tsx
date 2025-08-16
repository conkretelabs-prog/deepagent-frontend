'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface HealthMetricsProps {
  metrics: {
    responseTime?: Array<{ timestamp: string; value: number }>;
    errorRate?: Array<{ timestamp: string; value: number }>;
    uptime?: Array<{ timestamp: string; value: number }>;
    memoryUsage?: Array<{ timestamp: string; value: number }>;
    cpuUsage?: Array<{ timestamp: string; value: number }>;
  };
}

export default function HealthMetrics({ metrics }: HealthMetricsProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const MetricCard = ({ title, data, color, unit = '', threshold }: {
    title: string;
    data: Array<{ timestamp: string; value: number }>;
    color: string;
    unit?: string;
    threshold?: number;
  }) => {
    const latestValue = data[data.length - 1]?.value || 0;
    const isAboveThreshold = threshold && latestValue > threshold;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className={`text-2xl font-bold ${
            isAboveThreshold ? 'text-red-600' : 'text-gray-900'
          }`}>
            {latestValue.toFixed(1)}{unit}
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => formatTimestamp(value as string)}
                formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {threshold && (
          <div className="mt-2 text-xs text-gray-500">
            Threshold: {threshold}{unit}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Health Metrics</h2>
        <div className="text-sm text-gray-500">
          Real-time system performance monitoring
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics.responseTime && (
          <MetricCard
            title="Response Time"
            data={metrics.responseTime}
            color="#3b82f6"
            unit="ms"
            threshold={5000}
          />
        )}
        
        {metrics.errorRate && (
          <MetricCard
            title="Error Rate"
            data={metrics.errorRate}
            color="#ef4444"
            unit="%"
            threshold={5}
          />
        )}
        
        {metrics.memoryUsage && (
          <MetricCard
            title="Memory Usage"
            data={metrics.memoryUsage}
            color="#10b981"
            unit="%"
            threshold={85}
          />
        )}
        
        {metrics.cpuUsage && (
          <MetricCard
            title="CPU Usage"
            data={metrics.cpuUsage}
            color="#f59e0b"
            unit="%"
            threshold={80}
          />
        )}
      </div>
      
      {metrics.uptime && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Uptime</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.uptime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  domain={[95, 100]} 
                  stroke="#6b7280" 
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  labelFormatter={(value) => formatTimestamp(value as string)}
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Uptime']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
