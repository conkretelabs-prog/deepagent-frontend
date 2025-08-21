// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens (if needed)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Types
export interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy' | 'warning';
  uptime: number;
  responseTime: number;
  lastCheck: string;
  url?: string;
  version?: string;
  environment?: string;
}

export interface DeploymentStatus {
  id: string;
  service: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  timestamp: string;
  duration: number;
  branch: string;
  commit: string;
  author?: string;
  message?: string;
  logs?: string[];
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: string[];
  created_at: string;
  updated_at: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AutoFixResult {
  id: string;
  type: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  details?: string;
}

// API Service Class
class ApiService {
  // Health and Status
  async getSystemHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/api/health/');
    return response.data;
  }

  async getServiceStatus(): Promise<ServiceStatus[]> {
    const response = await api.get('/api/services/status/');
    return response.data;
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await api.get('/api/metrics/system/');
    return response.data;
  }

  // Deployments
  async getRecentDeployments(limit: number = 10): Promise<DeploymentStatus[]> {
    const response = await api.get(`/api/deployments/recent/?limit=${limit}`);
    return response.data;
  }

  async getDeploymentById(id: string): Promise<DeploymentStatus> {
    const response = await api.get(`/api/deployments/${id}/`);
    return response.data;
  }

  async triggerDeployment(service: string, branch: string = 'main'): Promise<{ deployment_id: string }> {
    const response = await api.post('/api/deployments/trigger/', {
      service,
      branch,
    });
    return response.data;
  }

  async rollbackDeployment(service: string, version?: string): Promise<{ deployment_id: string }> {
    const response = await api.post('/api/deployments/rollback/', {
      service,
      version,
    });
    return response.data;
  }

  // GitHub Integration
  async getGitHubIssues(state: 'open' | 'closed' | 'all' = 'open'): Promise<GitHubIssue[]> {
    const response = await api.get(`/api/github/issues/?state=${state}`);
    return response.data;
  }

  async createGitHubIssue(title: string, body: string, labels?: string[]): Promise<GitHubIssue> {
    const response = await api.post('/api/github/issues/', {
      title,
      body,
      labels,
    });
    return response.data;
  }

  async updateGitHubIssue(issueNumber: number, updates: Partial<GitHubIssue>): Promise<GitHubIssue> {
    const response = await api.patch(`/api/github/issues/${issueNumber}/`, updates);
    return response.data;
  }

  // Auto-Fix System
  async getAutoFixHistory(): Promise<AutoFixResult[]> {
    const response = await api.get('/api/autofix/history/');
    return response.data;
  }

  async triggerAutoFix(type: string, target?: string): Promise<AutoFixResult> {
    const response = await api.post('/api/autofix/trigger/', {
      type,
      target,
    });
    return response.data;
  }

  // Railway Integration
  async getRailwayServices(): Promise<any[]> {
    const response = await api.get('/api/railway/services/');
    return response.data;
  }

  async getRailwayDeployments(): Promise<any[]> {
    const response = await api.get('/api/railway/deployments/');
    return response.data;
  }

  async restartRailwayService(serviceId: string): Promise<{ success: boolean }> {
    const response = await api.post(`/api/railway/services/${serviceId}/restart/`);
    return response.data;
  }

  // Vercel Integration
  async getVercelDeployments(): Promise<any[]> {
    const response = await api.get('/api/vercel/deployments/');
    return response.data;
  }

  async triggerVercelDeployment(project: string): Promise<{ deployment_id: string }> {
    const response = await api.post('/api/vercel/deploy/', { project });
    return response.data;
  }

  // Monitoring and Alerts
  async getAlerts(): Promise<any[]> {
    const response = await api.get('/api/alerts/');
    return response.data;
  }

  async acknowledgeAlert(alertId: string): Promise<{ success: boolean }> {
    const response = await api.post(`/api/alerts/${alertId}/acknowledge/`);
    return response.data;
  }

  // Configuration
  async getConfiguration(): Promise<any> {
    const response = await api.get('/api/config/');
    return response.data;
  }

  async updateConfiguration(config: any): Promise<any> {
    const response = await api.patch('/api/config/', config);
    return response.data;
  }

  // Logs
  async getLogs(service?: string, level?: string, limit: number = 100): Promise<any[]> {
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (level) params.append('level', level);
    params.append('limit', limit.toString());

    const response = await api.get(`/api/logs/?${params.toString()}`);
    return response.data;
  }

  // WebSocket connection for real-time updates
  createWebSocketConnection(endpoint: string): WebSocket | null {
    if (typeof window === 'undefined') return null;

    const wsUrl = API_BASE_URL.replace('http', 'ws') + endpoint;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected:', endpoint);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected:', endpoint);
    };

    return ws;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

// Utility functions for error handling
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// SWR fetcher function
export const swrFetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};