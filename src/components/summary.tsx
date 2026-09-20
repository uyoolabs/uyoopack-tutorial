import { won } from "@/lib/money";

/** 소계 · 배송비 · 총액(명세 REQ-4). 장바구니와 주문 상세가 같은 조각을 쓴다 — 두 곳의 합계가 다르게 보이면 안 된다. */
export function Summary({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  return (
    <dl className="grid grid-cols-2 gap-y-2 text-sm">
      <dt className="text-ink-soft">소계</dt>
      <dd className="text-right tabular-nums">{won(subtotal)}</dd>
      <dt className="text-ink-soft">배송비</dt>
      <dd className="text-right tabular-nums">{shipping === 0 ? "무료" : won(shipping)}</dd>
      <dt className="mt-2 border-t border-line pt-3 text-base font-semibold">총액</dt>
      <dd className="mt-2 border-t border-line pt-3 text-right text-xl font-bold tabular-nums">{won(total)}</dd>
    </dl>
  );
}
