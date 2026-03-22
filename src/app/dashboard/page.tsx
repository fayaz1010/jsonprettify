import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardPageContent } from './content';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your saved files, team workspace, and account settings.',
};

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardPageContent />
    </Suspense>
  );
}
