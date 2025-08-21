// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as the main interface
    router.push('/dashboard');
  }, [router]);

  // Show dashboard while redirecting
  return <Dashboard />;
}