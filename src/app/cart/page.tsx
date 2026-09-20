import type { Metadata } from "next";
import Link from "next/link";
import { changeQtyAction, placeOrderAction, removeFromCartAction } from "../actions";
import { errorOf, Notice } from "../notice";
import { CartIcon, CheckIcon, TruckIcon } from "@/components/icons";
import { QtyField } from "@/components/qty-field";
import { Summary } from "@/components/summary";
import { Thumb } from "@/components/thumb";
import { FREE_SHIPPING_FROM, summarize } from "@/lib/cart";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

export const metadata: Metadata = { title: "장바구니" };

/**
 * 무료 배송까지 남은 금액(명세 REQ-12). 막대는 **소계**로 그린다 — 배송비를 정하는 규칙(`cart.ts`)과 따로 계산하므로,
 * 둘이 어긋나면 이 화면에서 그대로 보인다.
 */
function ShippingProgress({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));
  return (
    <div className="rounded-control bg-brand-soft p-3">
      <p className="flex items-center gap-2 text-sm font-medium">
        {left > 0 ? <TruckIcon className="size-5 text-brand" /> : <CheckIcon className="size-5 text-brand" />}
        {left > 0 ? (
          <span>
            <strong className="font-bold text-brand tabular-nums">{won(left)}</strong> 더 담으면 무료 배송입니다
          </span>
        ) : (
          <span>무료 배송 기준을 채웠습니다</span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="무료 배송까지"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="mt-2 h-2 overflow-hidden rounded-full bg-surface"
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function CartPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [state, error] = await Promise.all([readState(), errorOf(searchParams)]);
  const s = summarize(state.cart);
  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight">
        장바구니 {s.count > 0 ? <span className="text-brand tabular-nums">{s.count}</span> : null}
      </h1>
      <Notice message={error} />
      {s.lines.length === 0 ? (
        <div className="grid place-items-center rounded-card border border-line bg-surface px-6 py-16 text-center shadow-card">
          <CartIcon className="size-12 text-ink-faint" />
          <p className="mt-4 text-lg font-semibold">담은 상품이 없습니다.</p>
          <p className="mt-1 text-sm text-ink-soft">오늘 들어온 우유부터 둘러보세요.</p>
          <Link
            href="/#products"
            className="mt-6 inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
          >
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
            {s.lines.map((l) => (
              <div key={l.product.id} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <Thumb productId={l.product.id} />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold leading-snug">
                      {l.product.name} <span className="font-normal text-ink-faint">{l.product.unit}</span>
                      <span className="block text-sm font-normal text-ink-soft tabular-nums">{won(l.product.price)}</span>
                    </p>
                    <form action={removeFromCartAction}>
                      <input type="hidden" name="productId" value={l.product.id} />
                      <button
                        type="submit"
                        aria-label={`${l.product.name} 빼기`}
                        className="rounded-control px-2 py-1 text-sm text-ink-faint underline underline-offset-2 hover:text-ink"
                      >
                        빼기
                      </button>
                    </form>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <form action={changeQtyAction} className="flex items-center gap-2">
                      <input type="hidden" name="productId" value={l.product.id} />
                      <QtyField
                        label={`${l.product.name} 수량`}
                        min={0}
                        max={state.stock[l.product.id] ?? 0}
                        defaultValue={l.qty}
                        submitOnStep
                      />
                      <button
                        type="submit"
                        className="h-9 rounded-control border border-line px-3 text-sm text-ink-soft transition-colors hover:border-brand hover:text-brand"
                      >
                        바꾸기
                      </button>
                    </form>
                    <p className="ml-auto text-lg font-bold tabular-nums">{won(l.lineTotal)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside
            aria-label="주문 요약"
            className="space-y-4 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5 lg:sticky lg:top-24"
          >
            <ShippingProgress subtotal={s.subtotal} />
            <Summary subtotal={s.subtotal} shipping={s.shipping} total={s.total} />
            <form action={placeOrderAction}>
              <button
                type="submit"
                className="h-12 w-full rounded-control bg-brand text-base font-bold text-on-brand transition-colors hover:bg-brand-strong"
              >
                주문하기
              </button>
            </form>
            <p className="text-xs text-ink-faint">온라인 결제는 없습니다. 상품을 받을 때 현금이나 계좌 이체로 냅니다.</p>
            <p className="text-center text-sm">
              <Link href="/#products" className="text-ink-soft underline underline-offset-2 hover:text-ink">
                더 담으러 가기
              </Link>
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
