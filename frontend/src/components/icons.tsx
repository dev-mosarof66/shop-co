import { type ElementType } from 'react';
import {
  Headphones, Wallet, Watch, Monitor, Volume2, Shirt,
  Coffee, Lamp, Leaf, Dumbbell, FlaskConical, BookOpen,
  Sparkles, Bike, Keyboard, Zap, BatteryFull, ShoppingBag,
  Sun, Droplets, Wind, Flame, Plug,
} from 'lucide-react';

export function SneakerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 17V13C3 11.5 4 10.2 5.5 9.8L8 9V7C8 6.4 8.4 6 9 6h3l4 7h3.5C21 13 22 14 22 15.5V17" />
      <path d="M2 17h20v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2z" />
      <path d="M10 12h3" />
      <path d="M10 14.5h3" />
    </svg>
  );
}

export function BottleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 2h6v3l2 3v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8l2-3V2z" />
      <path d="M9 2h6" />
      <path d="M7 11h10" />
    </svg>
  );
}

export const productIcons: Record<string, ElementType> = {
  headphones: Headphones,
  wallet:     Wallet,
  sneaker:    SneakerIcon,
  watch:      Watch,
  monitor:    Monitor,
  speaker:    Volume2,
  shirt:      Shirt,
  coffee:     Coffee,
  lamp:       Lamp,
  leaf:       Leaf,
  dumbbell:   Dumbbell,
  bottle:     BottleIcon,
  bike:       Bike,
  book:       BookOpen,
  sparkles:   Sparkles,
  flask:      FlaskConical,
  keyboard:   Keyboard,
  zap:        Zap,
  battery:    BatteryFull,
  bag:        ShoppingBag,
  sun:        Sun,
  droplets:   Droplets,
  wind:       Wind,
  flame:      Flame,
  plug:       Plug,
};
