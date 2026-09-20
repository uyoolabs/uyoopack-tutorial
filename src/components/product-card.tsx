import Image from "next/image";
import { addToCartAction } from "@/app/actions";
import { QtyField } from "@/components/qty-field";
import { categoryLabel, type Product } from "@/lib/catalog";
import { unitPrice, won } from "@/lib/money";

/**
 * 상품 카드(명세 REQ-10). 사진 · 종류 · 이름과 용량 · 한 줄 설명 · 가격과 단위 가격 · 재고 · 담기.
 * 품절은 사진을 흐리게 하되 **`품절` 이라는 낱말이 함께 선다** — 색만으로 말하지 않는다(CON-5).
 */
export function ProductCard({
  product: p,
  left,
  eager,
  cat,
}: {
  product: Product;
  left: number;
  eager: boolean;
  /** 지금 거르는 종류. 담은 뒤에도 그 거름을 유지한다. */
  cat: string | null;
}) {
  const soldOut = left <= 0;
  return (
    <li className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-shadow hover:shadow-lift">
      <div className="relative aspect-square bg-photo">
        <Image
          src={p.image}
          alt={`${p.name} ${p.unit}`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 33vw, 50vw"
          priority={eager}
          className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${soldOut ? "opacity-40 grayscale" : ""}`}
        />
        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center text-sm font-semibold text-on-brand">
            품절
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs font-medium text-brand">{categoryLabel(p.category)}</p>
        <h3 className="mt-0.5 font-semibold leading-snug">
          {p.name} <span className="font-normal text-ink-faint">{p.unit}</span>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.blurb}</p>

        <p className="mt-3 text-lg font-bold tabular-nums">{won(p.price)}</p>
        <p className="text-xs text-ink-faint tabular-nums">{unitPrice(p.price, p.size)}</p>

        <p className="mt-2 text-xs text-ink-soft">{soldOut ? "다시 들어오면 담을 수 있습니다" : `재고 ${left}개`}</p>

        {soldOut ? null : (
          <form action={addToCartAction} className="mt-auto flex flex-wrap items-center gap-2 pt-3">
            <input type="hidden" name="productId" value={p.id} />
            {cat ? <input type="hidden" name="cat" value={cat} /> : null}
            <QtyField label="수량" min={1} max={left} defaultValue={1} />
            <button
              type="submit"
              className="h-9 flex-1 rounded-control bg-brand px-3 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong"
            >
              담기
            </button>
          </form>
        )}
      </div>
    </li>
  );
}
