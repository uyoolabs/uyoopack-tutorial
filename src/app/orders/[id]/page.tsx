import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { Summary } from "@/components/summary";
import { Thumb } from "@/components/thumb";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

export const metadata: Metadata = { title: "주문 상세" };

const when = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Seoul" });

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = await readState();
  const order = state.orders.find((o) => o.id === id);
  if (!order) notFound();
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-card border border-line bg-surface p-6 text-center shadow-card sm:p-8">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-ok-soft text-ok">
          <CheckIcon className="size-7" />
        </span>
        <p className="mt-3 text-sm font-medium text-ok">주문이 접수됐습니다.</p>
        <h1 className="mt-1 font-mono text-3xl font-bold tracking-tight">{order.number}</h1>
        <p className="mt-1 text-sm text-ink-soft">{when(order.placedAt)}</p>
      </div>

      <section aria-label="주문한 상품" className="mt-4 divide-y divide-line rounded-card border border-line bg-surface shadow-card">
        {order.lines.map((l) => (
          <div key={l.productId} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
            <Thumb productId={l.productId} />
            <p className="min-w-0 flex-1">
              <span className="block font-semibold">
                {l.name} <span className="font-normal text-ink-faint">{l.unit}</span>
              </span>
              <span className="block text-sm text-ink-soft tabular-nums">
                {won(l.price)} × {l.qty}
              </span>
            </p>
            <p className="font-bold tabular-nums">{won(l.price * l.qty)}</p>
          </div>
        ))}
      </section>

      <section aria-label="합계" className="mt-4 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
        <Summary subtotal={order.subtotal} shipping={order.shipping} total={order.total} />
        <p className="mt-4 text-xs text-ink-faint">온라인 결제는 없습니다. 상품을 받을 때 현금이나 계좌 이체로 냅니다.</p>
      </section>

      <p className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <Link
          href="/orders"
          className="inline-flex h-11 items-center rounded-control border border-line bg-surface px-5 font-semibold transition-colors hover:border-brand hover:text-brand"
        >
          주문 내역으로
        </Link>
        <Link
          href="/#products"
          className="inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
        >
          계속 둘러보기
        </Link>
      </p>
    </div>
  );
}
