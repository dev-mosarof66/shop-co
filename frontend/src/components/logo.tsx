import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'default';
  iconOnly?: boolean;
  className?: string;
}

export function Logo({ size = 'default', iconOnly = false, className }: LogoProps) {
  const px = size === 'sm' ? 16 : 20;

  return (
    <span className={cn('flex items-center gap-1.5 font-semibold', className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width={px}
        height={px}
        aria-hidden="true"
      >
        <rect width="24" height="24" rx="5.5" fill="#18181b" />
        <path
          d="M8 11V9a4 4 0 0 1 8 0v2"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="5.5" y="11" width="13" height="8.5" rx="2" fill="white" />
        <path
          d="M10 16a2 2 0 0 0 4 0"
          stroke="#18181b"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      {!iconOnly && 'ShopCo'}
    </span>
  );
}
