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

/**
 * 우유마켓의 표식 — 장바구니에 든 우유갑. **우유랩스 가족 로고의 문법**을 따른다(명세 DEC-3): 굵은 남색 외곽선,
 * 하늘색 두 톤의 면, 둥근 이음매, 그리고 우유갑. 우유노트가 공책 + 우유갑인 것처럼 여기는 장바구니 + 우유갑이다.
 * 파비콘(`app/icon.svg`)이 같은 그림이다 — 고치면 둘 다 고친다.
 */
export function LogoMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      className={className}
      fill="none"
      stroke="var(--color-logo-line)"
      strokeWidth={4}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <rect x="23" y="4" width="20" height="8" rx="1.5" fill="var(--color-logo-light)" />
      <path d="M23 12h20l7 10v20H38V22z" fill="var(--color-logo-deep)" />
      <path d="M23 12h20l-5 10H16z" fill="var(--color-logo-light)" />
      <path d="M16 22h22v20H16z" fill="var(--color-logo-light)" />
      <path d="M11 42h42l-3.6 16a3 3 0 0 1-3 2.4H17.6a3 3 0 0 1-3-2.4z" fill="var(--color-logo-deep)" />
      <rect x="6" y="36" width="52" height="9" rx="4.5" fill="var(--color-logo-light)" />
      <path d="M24 50v5M32 50v5M40 50v5" strokeWidth={3.2} />
    </svg>
  );
}
