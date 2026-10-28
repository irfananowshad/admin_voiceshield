'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ResearchAnalyticsDashboard } from '@/components/analytics/ResearchAnalyticsDashboard';
import { ToastMessage } from '@/components/common/Toast';

export default function HomePage() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (title: string, message?: string, type: 'success' | 'info' = 'success') => {
    setToast({
      id: Date.now().toString(),
      title,
      message,
      type
    });
  };

  return (
    <AdminLayout>
      <ResearchAnalyticsDashboard onShowToast={showToast} />
    </AdminLayout>
  );
}
