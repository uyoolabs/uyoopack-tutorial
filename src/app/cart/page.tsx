import type { Metadata } from "next";
import Link from "next/link";
import { changeQtyAction, placeOrderAction, removeFromCartAction } from "../actions";
import { errorOf, Notice } from "../notice";
import { CartIcon, CheckIcon, TruckIcon } from "@/components/icons";
import { QtyField } from "@/components/qty-field";
import { Summary } from "@/components/summary";
import { Thumb } from "@/components/thumb";
import { FREE_SHIPPING_FROM, MAX_LINE_QTY, summarize } from "@/lib/cart";
import { productName } from "@/lib/catalog";
import type { Lang } from "@/lib/lang";
import { messagesFor } from "@/lib/messages";
import { money } from "@/lib/money";
import { lang } from "@/lib/request-lang";
import { readState } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  return { title: messagesFor(await lang()).cart.title };
}

/**
 * 무료 배송까지 남은 금액(명세 REQ-12). 막대는 **소계**로 그린다 — 배송비를 정하는 규칙(`cart.ts`)과 따로 계산하므로,
 * 둘이 어긋나면 이 화면에서 그대로 보인다.
 */
function ShippingProgress({ subtotal, lang }: { subtotal: number; lang: Lang }) {
  const t = messagesFor(lang).cart;
  const left = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));
  return (
    <div className="rounded-control bg-brand-soft p-3">
      <p className="flex items-center gap-2 text-sm font-medium">
        {left > 0 ? <TruckIcon className="size-5 text-brand" /> : <CheckIcon className="size-5 text-brand" />}
        {left > 0 ? (
          <span>
            {t.leftBefore}
            <strong className="font-bold text-brand tabular-nums">{money(left, lang)}</strong>
            {t.leftAfter}
          </span>
        ) : (
          <span>{t.reached}</span>
        )}
      </p>
      <div
        role="progressbar"
        aria-label={t.progress}
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
  const [state, error, l] = await Promise.all([readState(), errorOf(searchParams), lang()]);
  const t = messagesFor(l);
  const s = summarize(state.cart);
  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight">
        {t.cart.title} {s.count > 0 ? <span className="text-brand tabular-nums">{s.count}</span> : null}
      </h1>
      <Notice message={error} />
      {s.lines.length === 0 ? (
        <div className="grid place-items-center rounded-card border border-line bg-surface px-6 py-16 text-center shadow-card">
          <CartIcon className="size-12 text-ink-faint" />
          <p className="mt-4 text-lg font-semibold">{t.cart.empty}</p>
          <p className="mt-1 text-sm text-ink-soft">{t.cart.emptyNote}</p>
          <Link
            href="/#products"
            className="mt-6 inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
          >
            {t.cart.browse}
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
            {s.lines.map((line) => {
              const name = productName(line.product, l);
              const qtyLabel = t.cart.qtyLabel(name);
              return (
                <div key={line.product.id} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                  <Thumb productId={line.product.id} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold leading-snug">
                        {name} <span className="font-normal text-ink-faint">{line.product.unit}</span>
                        <span className="block text-sm font-normal text-ink-soft tabular-nums">
                          {money(line.product.price, l)}
                        </span>
                      </p>
                      <form action={removeFromCartAction}>
                        <input type="hidden" name="productId" value={line.product.id} />
                        <button
                          type="submit"
                          aria-label={t.cart.removeLabel(name)}
                          className="rounded-control px-2 py-1 text-sm text-ink-faint underline underline-offset-2 hover:text-ink"
                        >
                          {t.cart.remove}
                        </button>
                      </form>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <form action={changeQtyAction} className="flex items-center gap-2">
                        <input type="hidden" name="productId" value={line.product.id} />
                        <QtyField
                          label={qtyLabel}
                          less={t.qty.less(qtyLabel)}
                          more={t.qty.more(qtyLabel)}
                          min={0}
                          max={MAX_LINE_QTY}
                          defaultValue={line.qty}
                          submitOnStep
                        />
                        <button
                          type="submit"
                          className="h-9 rounded-control border border-line px-3 text-sm text-ink-soft transition-colors hover:border-brand hover:text-brand"
                        >
                          {t.cart.update}
                        </button>
                      </form>
                      <p className="ml-auto text-lg font-bold tabular-nums">{money(line.lineTotal, l)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside
            aria-label={t.cart.summary}
            className="space-y-4 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5 lg:sticky lg:top-24"
          >
            <ShippingProgress subtotal={s.subtotal} lang={l} />
            <Summary subtotal={s.subtotal} shipping={s.shipping} total={s.total} lang={l} />
            <form action={placeOrderAction}>
              <button
                type="submit"
                className="h-12 w-full rounded-control bg-brand text-base font-bold text-on-brand transition-colors hover:bg-brand-strong"
              >
                {t.cart.order}
              </button>
            </form>
            <p className="text-xs text-ink-faint">{t.paymentNote}</p>
            <p className="text-center text-sm">
              <Link href="/#products" className="text-ink-soft underline underline-offset-2 hover:text-ink">
                {t.cart.more}
              </Link>
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
