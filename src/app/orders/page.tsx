import Link from "next/link";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

const when = (iso: string) =>
  new Date(iso).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Seoul" });

export default async function OrdersPage() {
  const state = await readState();
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">주문 내역</h1>
      {state.orders.length === 0 ? (
        <p className="text-stone-600">주문이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
          {state.orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50">
                <span>
                  <span className="font-mono text-sm">{o.number}</span>
                  <span className="ml-3 text-sm text-stone-500">{when(o.placedAt)}</span>
                </span>
                <span className="tabular-nums">{won(o.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
