"use client";

import { useRef } from "react";

/**
 * 수량 칸. − + 는 숫자를 고치기만 하고, `submitOnStep` 이면 고친 즉시 폼을 보낸다(장바구니).
 * 자바스크립트가 없어도 숫자 칸과 폼의 버튼으로 같은 일이 된다 — − + 는 거드는 것이다.
 *
 * 상한은 재고다. 브라우저가 먼저 막고, 넘겨 보내도 서버의 규칙(`cart.ts`)이 거절한다(명세 CON-1).
 */
export function QtyField({
  label,
  less,
  more,
  min,
  max,
  defaultValue,
  submitOnStep = false,
}: {
  label: string;
  /** − 버튼의 이름. 화면의 언어로 서버가 지어 넘긴다. */
  less: string;
  /** + 버튼의 이름. */
  more: string;
  min: number;
  max: number;
  defaultValue: number;
  submitOnStep?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const step = (by: number) => {
    const el = ref.current;
    if (!el) return;
    const now = Number(el.value);
    const next = Math.min(max, Math.max(min, (Number.isFinite(now) ? now : min) + by));
    if (next === now) return;
    el.value = String(next);
    if (submitOnStep) el.form?.requestSubmit();
  };

  const button =
    "grid size-9 place-items-center text-lg leading-none text-ink-soft transition-colors hover:bg-paper hover:text-ink";

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-control border border-line bg-surface">
      <button type="button" onClick={() => step(-1)} aria-label={less} className={button}>
        −
      </button>
      <input
        ref={ref}
        type="number"
        name="qty"
        inputMode="numeric"
        min={min}
        max={max}
        defaultValue={defaultValue}
        aria-label={label}
        className="w-11 border-x border-line bg-surface text-center text-sm tabular-nums"
      />
      <button type="button" onClick={() => step(1)} aria-label={more} className={button}>
        +
      </button>
    </div>
  );
}
