import type { Metadata } from 'next';
import { DashboardPageContent } from './content';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your saved files, team workspace, and account settings.',
};

export default function DashboardPage() {
  return <DashboardPageContent />;
}
