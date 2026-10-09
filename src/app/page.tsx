import Image from "next/image";
import Link from "next/link";
import { errorOf, Notice } from "./notice";
import { BoxIcon, TruckIcon, WalletIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { CATEGORIES, type Category, categoryLabel, PRODUCTS } from "@/lib/catalog";
import { messagesFor } from "@/lib/messages";
import { money } from "@/lib/money";
import { lang } from "@/lib/request-lang";
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
  const [state, error, { cat }, l] = await Promise.all([readState(), errorOf(searchParams), searchParams, lang()]);
  const t = messagesFor(l).home;
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
          <p className="text-sm font-semibold text-brand">{t.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {t.headline[0]}
            <br />
            {t.headline[1]}
          </h1>
          <p className="mt-3 text-ink-soft">{t.lead}</p>
          <p className="mt-6">
            <Link
              href="#products"
              className="inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
            >
              {t.browse}
            </Link>
          </p>
        </div>
        <div className="relative min-h-48 bg-photo sm:min-h-80">
          <Image
            src="/hero.webp"
            alt={t.heroAlt}
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
            <span className="block font-semibold">{t.free(money(FREE_SHIPPING_FROM, l))}</span>
            <span className="text-ink-soft">{t.freeNote}</span>
          </span>
        </p>
        <p className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <BoxIcon className="size-6 shrink-0 text-brand" />
          <span>
            <span className="block font-semibold">{t.stock}</span>
            <span className="text-ink-soft">{t.stockNote}</span>
          </span>
        </p>
        <p className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3">
          <WalletIcon className="size-6 shrink-0 text-brand" />
          <span>
            <span className="block font-semibold">{t.pay}</span>
            <span className="text-ink-soft">{t.payNote}</span>
          </span>
        </p>
      </div>

      <section id="products" aria-labelledby="products-title" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="products-title" className="text-2xl font-extrabold tracking-tight">
            {t.products}
          </h2>
          <nav aria-label={t.categories} className="flex flex-wrap gap-2">
            <Link href="/#products" aria-current={active ? undefined : "true"} className={chip(!active)}>
              {t.all}
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/?cat=${c.id}#products`}
                aria-current={active === c.id ? "true" : undefined}
                className={chip(active === c.id)}
              >
                {categoryLabel(c.id, l)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-4">
          <Notice message={error} />
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} left={state.stock[p.id] ?? 0} eager={i < 3} cat={active} lang={l} />
          ))}
        </ul>
      </section>
    </>
  );
}
