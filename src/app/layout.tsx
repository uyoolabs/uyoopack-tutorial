import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { resetShopAction } from "./actions";
import { CartIcon, DropMark } from "@/components/icons";
import { FREE_SHIPPING_FROM, SHIPPING_FEE, summarize } from "@/lib/cart";
import { won } from "@/lib/money";
import { readState } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "우유마켓 — 동네 우유 가게", template: "%s · 우유마켓" },
  description: "우유·가공유·요거트를 재고를 보고 고르는 동네 우유 가게의 온라인 주문",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export const dynamic = "force-dynamic";

const PRETENDARD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

/**
 * 머리와 바닥은 모든 화면에서 같다(명세 REQ-11). 머리: 배송비 안내 띠 · 표식 · 상품 · 주문 내역 · 장바구니(개수).
 * 바닥: 배송·결제 안내와, 여기가 데모 가게라는 사실. 동작하지 않는 장식(검색·로그인)은 두지 않는다.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const state = await readState();
  const count = summarize(state.cart).count;
  const navLink = "rounded-control px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink";
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="stylesheet" href={PRETENDARD} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-control focus:bg-surface focus:px-3 focus:py-2 focus:shadow-card"
        >
          본문으로 건너뛰기
        </a>

        <p className="bg-brand px-4 py-2 text-center text-xs font-medium text-on-brand sm:text-sm">
          {won(FREE_SHIPPING_FROM)} 이상 주문하면 배송비가 없습니다 · 그 아래는 {won(SHIPPING_FEE)}
        </p>

        <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
          <nav aria-label="주 메뉴" className="mx-auto flex h-16 max-w-5xl items-center gap-1 px-4">
            <Link href="/" className="mr-2 flex items-center gap-2 sm:mr-6">
              <DropMark className="size-7 text-brand" />
              <span className="text-lg font-extrabold tracking-tight">우유마켓</span>
            </Link>
            <Link href="/#products" className={navLink}>
              상품
            </Link>
            <Link href="/orders" className={navLink}>
              주문 내역
            </Link>
            <Link
              href="/cart"
              aria-label={count > 0 ? `장바구니 ${count}` : "장바구니"}
              className="ml-auto flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-2 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              <CartIcon className="size-5" />
              <span className="hidden sm:inline">장바구니</span>
              {count > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold text-on-brand tabular-nums">
                  {count}
                </span>
              ) : null}
            </Link>
          </nav>
        </header>

        <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">
          {children}
        </main>

        <footer className="mt-10 border-t border-line bg-surface">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-2 font-extrabold">
                <DropMark className="size-5 text-brand" />
                우유마켓
              </p>
              <p className="mt-2 text-ink-soft">전화 대신 웹으로 주문받는 동네 우유 가게입니다.</p>
            </div>
            <div>
              <p className="font-semibold">배송</p>
              <p className="mt-2 text-ink-soft">
                배송비는 {won(SHIPPING_FEE)}이고 {won(FREE_SHIPPING_FROM)} 이상 주문하면 없습니다.
              </p>
            </div>
            <div>
              <p className="font-semibold">결제</p>
              <p className="mt-2 text-ink-soft">온라인 결제는 없습니다. 상품을 받을 때 현금이나 계좌 이체로 냅니다.</p>
            </div>
          </div>
          <form action={resetShopAction} className="border-t border-line">
            <p className="mx-auto max-w-5xl px-4 py-5 text-xs text-ink-faint">
              우유마켓은 우유팩 튜토리얼을 위한 데모 가게입니다. 실제로 주문·배송되지 않습니다. 재고·장바구니·주문은 이
              브라우저에만 있습니다.{" "}
              <button type="submit" className="font-medium text-ink-soft underline underline-offset-2 hover:text-ink">
                처음 상태로
              </button>
            </p>
          </form>
        </footer>
      </body>
    </html>
  );
}
