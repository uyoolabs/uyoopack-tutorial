/** 아이콘은 장식이다 — 뜻은 옆의 낱말이 말한다. 그래서 전부 `aria-hidden` 이다. */
type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function CartIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.2L20 7.5H6.2" />
      <circle cx="9.5" cy="19.5" r="1.2" />
      <circle cx="17" cy="19.5" r="1.2" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 6.5h10.5v9.5H3zM13.5 10h3.8l3.2 3.2V16h-7" />
      <circle cx="7.5" cy="17.5" r="1.6" />
      <circle cx="16.5" cy="17.5" r="1.6" />
    </svg>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5z" />
      <path d="M16 13.5h.01" />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" />
      <path d="M4 8l8 4.5L20 8M12 12.5v8" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={2.2} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

/** 우유 한 방울. 머리의 표식과 파비콘(`app/icon.svg`)이 같은 모양이다. */
export function DropMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        d="M12 2.5c3.4 4.2 6.5 7.7 6.5 11.4a6.5 6.5 0 0 1-13 0C5.5 10.2 8.6 6.7 12 2.5z"
      />
      <path
        fill="none"
        stroke="var(--color-on-brand)"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M9 14.2a3.2 3.2 0 0 0 2.6 3"
      />
    </svg>
  );
}
