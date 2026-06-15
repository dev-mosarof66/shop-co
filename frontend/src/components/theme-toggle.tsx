import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';

const cycle = { light: 'dark', dark: 'system', system: 'light' } as const;

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

const labels = {
  light: 'Switch to dark mode',
  dark: 'Switch to system theme',
  system: 'Switch to light mode',
} as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const Icon = icons[theme];

  return (
    <Button
      variant="outline"
      size="icon"
      className={className}
      aria-label={labels[theme]}
      onClick={() => setTheme(cycle[theme])}
    >
      <Icon className="size-4" />
    </Button>
  );
}
