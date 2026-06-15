import { useState } from 'react';
import { Menu } from 'lucide-react';
import { SellerSidebar } from './SellerSidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { signOut, useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

interface SellerLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function SellerLayout({ children, title }: SellerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SellerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-sm font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
              <span className="hidden text-xs text-muted-foreground sm:block">
                {user.name}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void signOut()}
              className="text-xs"
            >
              Sign out
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
