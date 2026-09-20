import Link from "next/link";
import { notFound } from "next/navigation";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = await readState();
  const order = state.orders.find((o) => o.id === id);
  if (!order) notFound();
  return (
    <>
      <p className="mb-1 text-sm text-stone-500">주문이 접수됐습니다.</p>
      <h1 className="mb-6 text-2xl font-semibold">
        <span className="font-mono">{order.number}</span>
      </h1>
      <table className="w-full text-sm">
        <tbody>
          {order.lines.map((l) => (
            <tr key={l.productId} className="border-t border-stone-200">
              <td className="py-2">
                {l.name} <span className="text-stone-500">{l.unit}</span>
              </td>
              <td className="py-2 tabular-nums">
                {won(l.price)} × {l.qty}
              </td>
              <td className="py-2 text-right tabular-nums">{won(l.price * l.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="mt-6 ml-auto grid w-64 grid-cols-2 gap-y-1 text-sm">
        <dt className="text-stone-500">소계</dt>
        <dd className="text-right tabular-nums">{won(order.subtotal)}</dd>
        <dt className="text-stone-500">배송비</dt>
        <dd className="text-right tabular-nums">{order.shipping === 0 ? "무료" : won(order.shipping)}</dd>
        <dt className="mt-2 border-t border-stone-200 pt-2 font-medium">총액</dt>
        <dd className="mt-2 border-t border-stone-200 pt-2 text-right font-medium tabular-nums">{won(order.total)}</dd>
      </dl>
      <p className="mt-8 text-sm">
        <Link href="/orders" className="underline">
          주문 내역으로
        </Link>
      </p>
    </>
  );
}
