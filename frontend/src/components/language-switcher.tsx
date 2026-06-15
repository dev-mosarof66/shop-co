import { DropdownMenu } from 'radix-ui';
import { ChevronDown, Check } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { type Locale, localeLabels } from '@/i18n/translations';
import { cn } from '@/lib/utils';

const locales = Object.keys(localeLabels) as Locale[];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const current = localeLabels[locale];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="inline-flex size-5 items-center justify-center rounded border border-border bg-muted text-[10px] font-bold">{current.code}</span>
          <span className="hidden sm:inline">{current.label}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-[140px] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md animate-in fade-in-0 zoom-in-95"
        >
          {locales.map((l) => {
            const { label, code } = localeLabels[l];
            return (
              <DropdownMenu.Item
                key={l}
                onSelect={() => setLocale(l)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm outline-none transition-colors',
                  'hover:bg-muted focus:bg-muted',
                  l === locale && 'font-medium text-foreground',
                  l !== locale && 'text-muted-foreground',
                )}
              >
                <span className="inline-flex size-5 items-center justify-center rounded border border-border bg-muted text-[10px] font-bold">{code}</span>
                <span className="flex-1">{label}</span>
                {l === locale && <Check className="size-3.5" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
