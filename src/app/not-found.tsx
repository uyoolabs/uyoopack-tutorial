import Link from "next/link";
import { messagesFor } from "@/lib/messages";
import { lang } from "@/lib/request-lang";

export default async function NotFound() {
  const t = messagesFor(await lang()).notFound;
  return (
    <div className="grid place-items-center rounded-card border border-line bg-surface px-6 py-16 text-center shadow-card">
      <p className="font-mono text-sm text-ink-faint">404</p>
      <h1 className="mt-2 text-xl font-bold">{t.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{t.body}</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
      >
        {t.home}
      </Link>
    </div>
  );
}
