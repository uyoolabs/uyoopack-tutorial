import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid place-items-center rounded-card border border-line bg-surface px-6 py-16 text-center shadow-card">
      <p className="font-mono text-sm text-ink-faint">404</p>
      <h1 className="mt-2 text-xl font-bold">찾는 화면이 없습니다.</h1>
      <p className="mt-1 text-sm text-ink-soft">주문 번호가 이 브라우저의 것이 아니거나 주소가 바뀌었습니다.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
      >
        첫 화면으로
      </Link>
    </div>
  );
}
