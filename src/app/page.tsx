import Image from "next/image";
import Link from "next/link";
import { errorOf, Notice } from "./notice";
import { BoxIcon, TruckIcon, WalletIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { CATEGORIES, type Category, PRODUCTS } from "@/lib/catalog";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";

const isCategory = (v: string | undefined): v is Category => CATEGORIES.some((c) => c.id === v);

/**
 * 첫 화면 — 상품 전부가 여기 있다(명세 REQ-1). 종류 칩은 거르기만 하고 기본은 전체다.
 * 상세 화면은 없다: 손님은 상품·장바구니·주문 세 화면 안에서 끝낸다(INT-1).
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; cat?: string }>;
}) {
  const [state, error, { cat }] = await Promise.all([readState(), errorOf(searchParams), searchParams]);
  const active = isCategory(cat) ? cat : null;
  const shown = active ? PRODUCTS.filter((p) => p.category === active) : PRODUCTS;

  const chip = (on: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      on ? "border-brand bg-brand text-on-brand" : "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand"
    }`;

  return (
    <>
      <section className="grid overflow-hidden rounded-card border border-line bg-surface shadow-card sm:grid-cols-2">
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="text-sm font-semibold text-brand">동네 우유 가게 · 우유마켓</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            오늘 들어온 우유를
            <br />
            재고 보고 주문하세요
          </h1>
          <p className="mt-3 text-ink-soft">우유·가공유·요거트 여섯 가지. 담고, 확인하고, 주문하면 끝입니다.</p>
          <p className="mt-6">
            <Link
              href="#products"
              className="inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
            >
              상품 보러 가기
            </Link>
          </p>
        </div>
        <div className="relative min-h-48 bg-photo sm:min-h-80">
          <Image
            src="/hero.webp"
            alt="나무 식탁 위의 우유 한 병과 한 잔, 요거트 한 그릇"
            fill
            priority
            sizes="(min-width: 640px) 512px, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <p className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <TruckIcon className="size-6 shrink-0 text-brand" />
          <span>
            <span className="block font-semibold">{won(FREE_SHIPPING_FROM)} 이상 무료 배송</span>
            <span className="text-ink-soft">장바구니에서 남은 금액을 알려 드립니다</span>
          </span>
        </p>
        <p className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <BoxIcon className="size-6 shrink-0 text-brand" />
          <span>
            <span className="block font-semibold">재고를 보고 주문</span>
            <span className="text-ink-soft">남은 수량만큼만 담깁니다</span>
          </span>
        </p>
        <p className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <WalletIcon className="size-6 shrink-0 text-brand" />
          <span>
            <span className="block font-semibold">결제는 받을 때</span>
            <span className="text-ink-soft">현금이나 계좌 이체로 냅니다</span>
          </span>
        </p>
      </div>

      <section id="products" aria-labelledby="products-title" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="products-title" className="text-2xl font-extrabold tracking-tight">
            오늘의 상품
          </h2>
          <nav aria-label="종류" className="flex flex-wrap gap-2">
            <Link href="/#products" aria-current={active ? undefined : "true"} className={chip(!active)}>
              전체
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/?cat=${c.id}#products`}
                aria-current={active === c.id ? "true" : undefined}
                className={chip(active === c.id)}
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-4">
          <Notice message={error} />
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} left={state.stock[p.id] ?? 0} eager={i < 3} cat={active} />
          ))}
        </ul>
      </section>
    </>
  );
}
