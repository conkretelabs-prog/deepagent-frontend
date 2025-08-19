import DeploymentDashboard from '@/components/DeploymentDashboard';

export default function Home() {
  return (
    <main>
      <DeploymentDashboard />
    </main>
  );
}

export const metadata = {
  title: 'DeepAgent - Autonomous Deployment Manager',
  description: 'Real-time monitoring dashboard for autonomous deployment management',
};