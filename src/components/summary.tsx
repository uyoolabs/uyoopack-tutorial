import type { Lang } from "@/lib/lang";
import { messagesFor } from "@/lib/messages";
import { money } from "@/lib/money";

/** 소계 · 배송비 · 총액(명세 REQ-4). 장바구니와 주문 상세가 같은 조각을 쓴다 — 두 곳의 합계가 다르게 보이면 안 된다. */
export function Summary({
  subtotal,
  shipping,
  total,
  lang,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  lang: Lang;
}) {
  const t = messagesFor(lang).summary;
  return (
    <dl className="grid grid-cols-2 gap-y-2 text-sm">
      <dt className="text-ink-soft">{t.subtotal}</dt>
      <dd className="text-right tabular-nums">{money(subtotal, lang)}</dd>
      <dt className="text-ink-soft">{t.shipping}</dt>
      <dd className="text-right tabular-nums">{shipping === 0 ? t.free : money(shipping, lang)}</dd>
      <dt className="mt-2 border-t border-line pt-3 text-base font-semibold">{t.total}</dt>
      <dd className="mt-2 border-t border-line pt-3 text-right text-xl font-bold tabular-nums">{money(total, lang)}</dd>
    </dl>
  );
}
