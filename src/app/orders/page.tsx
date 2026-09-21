import type { Metadata } from "next";
import Link from "next/link";
import { BoxIcon, ChevronIcon } from "@/components/icons";
import { Thumb } from "@/components/thumb";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

export const metadata: Metadata = { title: "주문 내역" };

const when = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Seoul" });

/** `흰우유 외 2종` — 목록의 한 줄이 무엇을 산 주문인지 말한다. */
const gist = (lines: { name: string }[]) =>
  lines.length <= 1 ? (lines[0]?.name ?? "") : `${lines[0]?.name} 외 ${lines.length - 1}종`;

export default async function OrdersPage() {
  const state = await readState();
  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight">주문 내역</h1>
      {state.orders.length === 0 ? (
        <div className="grid place-items-center rounded-card border border-line bg-surface px-6 py-16 text-center shadow-card">
          <BoxIcon className="size-12 text-ink-faint" />
          <p className="mt-4 text-lg font-semibold">주문이 없습니다.</p>
          <p className="mt-1 text-sm text-ink-soft">주문하면 여기에 번호와 함께 남습니다.</p>
          <Link
            href="/#products"
            className="mt-6 inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
          >
            상품 보러 가기
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {state.orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/orders/${o.id}`}
                className="flex items-center gap-3 rounded-card border border-line bg-surface p-3 shadow-card transition-shadow hover:shadow-lift sm:gap-4 sm:p-4"
              >
                <Thumb productId={o.lines[0]?.productId ?? ""} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-ink-faint">{when(o.placedAt)}</span>
                  <span className="block truncate font-semibold">{gist(o.lines)}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-ink-soft">{o.number}</span>
                    {/* 상태는 낱말로 선다(명세 CON-5). 확정된 주문에는 아무 표식이 없다. */}
                    {o.status === "cancelled" ? (
                      <span className="rounded-control bg-warn-soft px-1.5 py-0.5 text-xs font-semibold text-warn">취소됨</span>
                    ) : null}
                  </span>
                </span>
                <span className="text-lg font-bold tabular-nums">{won(o.total)}</span>
                <ChevronIcon className="size-5 shrink-0 text-ink-faint" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
