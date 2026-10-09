import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { Summary } from "@/components/summary";
import { Thumb } from "@/components/thumb";
import { lineName } from "@/lib/catalog";
import type { Lang } from "@/lib/lang";
import { messagesFor } from "@/lib/messages";
import { money } from "@/lib/money";
import { lang } from "@/lib/request-lang";
import { readState } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  return { title: messagesFor(await lang()).order.title };
}

/** 시각은 가게가 있는 서울 시각이다. 형식만 방문자의 언어를 따른다. */
const when = (iso: string, l: Lang) =>
  new Date(iso).toLocaleString(messagesFor(l).dateLocale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  });

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [state, l] = await Promise.all([readState(), lang()]);
  const t = messagesFor(l);
  const order = state.orders.find((o) => o.id === id);
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-card border border-line bg-surface p-6 text-center shadow-card sm:p-8">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-ok-soft text-ok">
          <CheckIcon className="size-7" />
        </span>
        <p className="mt-3 text-sm font-medium text-ok">{t.order.placed}</p>
        <h1 className="mt-1 font-mono text-3xl font-bold tracking-tight">{order.number}</h1>
        <p className="mt-1 text-sm text-ink-soft">{when(order.placedAt, l)}</p>
      </div>

      <section
        aria-label={t.order.items}
        className="mt-4 divide-y divide-line rounded-card border border-line bg-surface shadow-card"
      >
        {order.lines.map((line) => (
          <div key={line.productId} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
            <Thumb productId={line.productId} />
            <p className="min-w-0 flex-1">
              <span className="block font-semibold">
                {lineName(line, l)} <span className="font-normal text-ink-faint">{line.unit}</span>
              </span>
              <span className="block text-sm text-ink-soft tabular-nums">
                {money(line.price, l)} × {line.qty}
              </span>
            </p>
            <p className="font-bold tabular-nums">{money(line.price * line.qty, l)}</p>
          </div>
        ))}
      </section>

      <section aria-label={t.order.totals} className="mt-4 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
        <Summary subtotal={order.subtotal} shipping={order.shipping} total={order.total} lang={l} />
        <p className="mt-4 text-xs text-ink-faint">{t.paymentNote}</p>
      </section>

      <p className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <Link
          href="/orders"
          className="inline-flex h-11 items-center rounded-control border border-line bg-surface px-5 font-semibold transition-colors hover:border-brand hover:text-brand"
        >
          {t.order.back}
        </Link>
        <Link
          href="/#products"
          className="inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
        >
          {t.order.more}
        </Link>
      </p>
    </div>
  );
}
