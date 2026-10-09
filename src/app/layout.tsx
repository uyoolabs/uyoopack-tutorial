import type { Metadata, Viewport } from "next";
import { Do_Hyeon } from "next/font/google";
import Link from "next/link";
import { resetShopAction } from "./actions";
import { CartIcon, LogoMark } from "@/components/icons";
import { FREE_SHIPPING_FROM, SHIPPING_FEE, summarize } from "@/lib/cart";
import { messagesFor } from "@/lib/messages";
import { money } from "@/lib/money";
import { lang } from "@/lib/request-lang";
import { readState } from "@/lib/store";
import "./globals.css";

/** 제목과 설명도 방문자의 언어로 쓴다. */
export async function generateMetadata(): Promise<Metadata> {
  const t = messagesFor(await lang());
  return { title: { default: t.meta.title, template: t.meta.template }, description: t.meta.description };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export const dynamic = "force-dynamic";

/**
 * 워드마크의 서체 — 우유랩스 가족 로고의 한글이 도현체다(우유랩스·우유팩·우유노트). **표식 옆 이름에만 쓴다**:
 * 제목과 본문은 Pretendard 하나다. 글자 네 개를 위해 서체를 들이는 이유는 그 네 글자가 가족의 얼굴이기 때문이다.
 */
const wordmark = Do_Hyeon({ weight: "400", subsets: ["latin"], display: "swap", preload: false });

const PRETENDARD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

/**
 * 머리와 바닥은 모든 화면에서 같다(명세 REQ-11). 머리: 배송비 안내 띠(남색) · 가족 문법의 표식과 도현체 이름 · 상품 · 주문 내역 · 장바구니(개수).
 * 바닥: 배송·결제 안내와, 여기가 데모 가게라는 사실. 동작하지 않는 장식(검색·로그인)은 두지 않는다.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [state, l] = await Promise.all([readState(), lang()]);
  const t = messagesFor(l);
  const m = (n: number) => money(n, l);
  const count = summarize(state.cart).count;
  const navLink = "rounded-control px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper hover:text-ink";
  return (
    <html lang={l}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="stylesheet" href={PRETENDARD} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-control focus:bg-surface focus:px-3 focus:py-2 focus:shadow-card"
        >
          {t.skip}
        </a>

        <p className="bg-navy px-4 py-2 text-center text-xs font-medium text-on-brand sm:text-sm">
          {t.banner(m(FREE_SHIPPING_FROM), m(SHIPPING_FEE))}
        </p>

        <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
          <nav aria-label={t.nav.label} className="mx-auto flex h-16 max-w-5xl items-center gap-1 px-4">
            <Link href="/" className="mr-2 flex items-center gap-2 sm:mr-6">
              <LogoMark className="size-9" />
              <span className={`${wordmark.className} text-2xl leading-none text-logo-word`}>{t.shop}</span>
            </Link>
            <Link href="/#products" className={navLink}>
              {t.nav.products}
            </Link>
            <Link href="/orders" className={navLink}>
              {t.nav.orders}
            </Link>
            <Link
              href="/cart"
              aria-label={count > 0 ? t.nav.cartCount(count) : t.nav.cart}
              className="ml-auto flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-2 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              <CartIcon className="size-5" />
              <span className="hidden sm:inline">{t.nav.cart}</span>
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
              <p className="flex items-center gap-2">
                <LogoMark className="size-7" />
                <span className={`${wordmark.className} text-xl leading-none text-logo-word`}>{t.shop}</span>
              </p>
              <p className="mt-2 text-ink-soft">{t.footer.about}</p>
            </div>
            <div>
              <p className="font-semibold">{t.footer.shipping}</p>
              <p className="mt-2 text-ink-soft">{t.footer.shippingBody(m(SHIPPING_FEE), m(FREE_SHIPPING_FROM))}</p>
            </div>
            <div>
              <p className="font-semibold">{t.footer.payment}</p>
              <p className="mt-2 text-ink-soft">{t.paymentNote}</p>
            </div>
          </div>
          <form action={resetShopAction} className="border-t border-line">
            <p className="mx-auto max-w-5xl px-4 py-5 text-xs text-ink-faint">
              {t.footer.demo}{" "}
              <button type="submit" className="font-medium text-ink-soft underline underline-offset-2 hover:text-ink">
                {t.footer.reset}
              </button>
            </p>
          </form>
        </footer>
      </body>
    </html>
  );
}
