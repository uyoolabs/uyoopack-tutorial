import { addToCartAction } from "./actions";
import { errorOf, Notice } from "./notice";
import { PRODUCTS } from "@/lib/catalog";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [state, error] = await Promise.all([readState(), errorOf(searchParams)]);
  return (
    <>
      <h1 className="mb-1 text-2xl font-semibold">오늘의 상품</h1>
      <p className="mb-6 text-sm text-stone-600">3만 원 이상이면 배송비가 없습니다.</p>
      <Notice message={error} />
      <ul className="grid gap-3 sm:grid-cols-2">
        {PRODUCTS.map((p) => {
          const left = state.stock[p.id] ?? 0;
          return (
            <li key={p.id} className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-medium">
                  {p.name} <span className="text-sm text-stone-500">{p.unit}</span>
                </h2>
                <span className="tabular-nums">{won(p.price)}</span>
              </div>
              <p className="mt-1 text-xs text-stone-500">{left > 0 ? `재고 ${left}개` : "품절"}</p>
              {left > 0 ? (
                <form action={addToCartAction} className="mt-3 flex items-center gap-2">
                  <input type="hidden" name="productId" value={p.id} />
                  <input
                    type="number"
                    name="qty"
                    min={1}
                    max={left}
                    defaultValue={1}
                    aria-label="수량"
                    className="w-16 rounded border border-stone-300 px-2 py-1 text-sm tabular-nums"
                  />
                  <button
                    type="submit"
                    className="rounded bg-stone-900 px-3 py-1 text-sm text-white hover:bg-stone-700"
                  >
                    담기
                  </button>
                </form>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
