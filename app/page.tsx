'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to command center on load
    router.push('/command-center');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">KitchenOS</h1>
        <p className="text-gray-600 mt-2">Redirecting to Command Center...</p>
      </div>
    </div>
  );
}
