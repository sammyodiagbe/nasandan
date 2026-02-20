'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout';
import { LoadingPage } from '@/components/shared';
import { useAdminAuth } from '@/lib/context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && !admin && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isLoading, admin, router, pathname]);

  // Login page doesn't need the sidebar layout
  if (pathname === '/admin/login') {
    return children;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingPage />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
