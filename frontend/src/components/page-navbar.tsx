import { Link } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { CartButton } from '@/components/cart-button';
import { SearchButton } from '@/components/search-button';

export function PageNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeToggle />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
