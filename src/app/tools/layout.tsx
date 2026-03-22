import Navbar from '@/components/layout/navbar';
import ToolsSidebar from '@/components/layout/tools-sidebar';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ToolsSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
