import Link from "next/link";
import { changeQtyAction, placeOrderAction, removeFromCartAction } from "../actions";
import { errorOf, Notice } from "../notice";
import { FREE_SHIPPING_FROM, summarize } from "@/lib/cart";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

export default async function CartPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [state, error] = await Promise.all([readState(), errorOf(searchParams)]);
  const s = summarize(state.cart);
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">장바구니</h1>
      <Notice message={error} />
      {s.lines.length === 0 ? (
        <p className="text-stone-600">
          담은 상품이 없습니다.{" "}
          <Link href="/" className="underline">
            상품 보기
          </Link>
        </p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead className="text-left text-stone-500">
              <tr>
                <th className="py-2 font-normal">상품</th>
                <th className="py-2 font-normal">가격</th>
                <th className="py-2 font-normal">수량</th>
                <th className="py-2 text-right font-normal">금액</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {s.lines.map((l) => (
                <tr key={l.product.id} className="border-t border-stone-200">
                  <td className="py-2">
                    {l.product.name} <span className="text-stone-500">{l.product.unit}</span>
                  </td>
                  <td className="py-2 tabular-nums">{won(l.product.price)}</td>
                  <td className="py-2">
                    <form action={changeQtyAction} className="flex items-center gap-1">
                      <input type="hidden" name="productId" value={l.product.id} />
                      <input
                        type="number"
                        name="qty"
                        min={0}
                        max={state.stock[l.product.id] ?? 0}
                        defaultValue={l.qty}
                        aria-label={`${l.product.name} 수량`}
                        className="w-16 rounded border border-stone-300 px-2 py-1 tabular-nums"
                      />
                      <button type="submit" className="rounded border border-stone-300 px-2 py-1 hover:bg-stone-100">
                        바꾸기
                      </button>
                    </form>
                  </td>
                  <td className="py-2 text-right tabular-nums">{won(l.lineTotal)}</td>
                  <td className="py-2 text-right">
                    <form action={removeFromCartAction}>
                      <input type="hidden" name="productId" value={l.product.id} />
                      <button type="submit" className="text-stone-500 underline hover:text-stone-900">
                        빼기
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <dl className="mt-6 ml-auto grid w-64 grid-cols-2 gap-y-1 text-sm">
            <dt className="text-stone-500">소계</dt>
            <dd className="text-right tabular-nums">{won(s.subtotal)}</dd>
            <dt className="text-stone-500">배송비</dt>
            <dd className="text-right tabular-nums">{s.shipping === 0 ? "무료" : won(s.shipping)}</dd>
            <dt className="mt-2 border-t border-stone-200 pt-2 font-medium">총액</dt>
            <dd className="mt-2 border-t border-stone-200 pt-2 text-right font-medium tabular-nums">{won(s.total)}</dd>
          </dl>
          {s.shipping > 0 ? (
            <p className="mt-2 text-right text-xs text-stone-500">
              {won(FREE_SHIPPING_FROM - s.subtotal)} 더 담으면 배송비가 없습니다.
            </p>
          ) : null}

          <form action={placeOrderAction} className="mt-6 text-right">
            <button type="submit" className="rounded bg-stone-900 px-4 py-2 text-white hover:bg-stone-700">
              주문하기
            </button>
          </form>
        </>
      )}
    </>
  );
}
