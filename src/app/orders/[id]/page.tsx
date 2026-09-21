import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelOrderAction } from "../../actions";
import { errorOf, Notice } from "../../notice";
import { BoxIcon, CheckIcon } from "@/components/icons";
import { Summary } from "@/components/summary";
import { Thumb } from "@/components/thumb";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

export const metadata: Metadata = { title: "주문 상세" };

const when = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Seoul" });

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const error = await errorOf(searchParams);
  const state = await readState();
  const order = state.orders.find((o) => o.id === id);
  if (!order) notFound();
  const cancelled = order.status === "cancelled";
  return (
    <div className="mx-auto max-w-2xl">
      <Notice message={error} />
      <div className="rounded-card border border-line bg-surface p-6 text-center shadow-card sm:p-8">
        {/* 상태는 색만으로 말하지 않는다(명세 CON-5) — 표식 옆에 낱말이 선다. */}
        {cancelled ? (
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-warn-soft text-warn">
            <BoxIcon className="size-7" />
          </span>
        ) : (
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-ok-soft text-ok">
            <CheckIcon className="size-7" />
          </span>
        )}
        <p className={`mt-3 text-sm font-medium ${cancelled ? "text-warn" : "text-ok"}`}>
          {cancelled ? "취소된 주문입니다." : "주문이 접수됐습니다."}
        </p>
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
        <p className="mt-4 text-xs text-ink-faint">
          {cancelled
            ? "취소된 주문입니다. 재고는 주문 수량만큼 되돌렸습니다."
            : "온라인 결제는 없습니다. 상품을 받을 때 현금이나 계좌 이체로 냅니다."}
        </p>
      </section>

      {/* 이미 취소된 주문에는 취소 버튼이 없다(명세 REQ-9). */}
      {cancelled ? null : (
        <form action={cancelOrderAction} className="mt-4 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
          <input type="hidden" name="orderId" value={order.id} />
          <p className="text-sm text-ink-soft">더 필요하지 않으면 주문을 취소할 수 있습니다. 재고는 그만큼 돌아갑니다.</p>
          <button
            type="submit"
            className="mt-3 inline-flex h-11 items-center rounded-control border border-warn-line bg-warn-soft px-5 font-semibold text-warn transition-colors hover:bg-warn hover:text-on-brand"
          >
            주문 취소
          </button>
        </form>
      )}

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
