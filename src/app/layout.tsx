import type { Metadata } from "next";
import Link from "next/link";
import { resetShopAction } from "./actions";
import { summarize } from "@/lib/cart";
import { readState } from "@/lib/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "우유마켓",
  description: "동네 우유 가게의 작은 온라인 주문",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const state = await readState();
  const count = summarize(state.cart).count;
  return (
    <html lang="ko">
      <body>
        <header className="border-b border-stone-200 bg-white">
          <nav className="mx-auto flex max-w-3xl items-center gap-6 px-4 py-3">
            <Link href="/" className="font-semibold">
              우유마켓
            </Link>
            <Link href="/" className="text-sm text-stone-600 hover:text-stone-900">
              상품
            </Link>
            <Link href="/cart" className="text-sm text-stone-600 hover:text-stone-900">
              장바구니{count > 0 ? ` ${count}` : ""}
            </Link>
            <Link href="/orders" className="text-sm text-stone-600 hover:text-stone-900">
              주문 내역
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 pb-10 text-xs text-stone-500">
          <form action={resetShopAction} className="border-t border-stone-200 pt-4">
            재고·장바구니·주문은 이 브라우저에만 있습니다.{" "}
            <button type="submit" className="underline hover:text-stone-900">
              처음 상태로
            </button>
          </form>
        </footer>
      </body>
    </html>
  );
}
