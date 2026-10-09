import type { Metadata } from "next";
import Link from "next/link";
import { BoxIcon, ChevronIcon } from "@/components/icons";
import { Thumb } from "@/components/thumb";
import { lineName } from "@/lib/catalog";
import type { Lang } from "@/lib/lang";
import { messagesFor } from "@/lib/messages";
import { money } from "@/lib/money";
import { lang } from "@/lib/request-lang";
import { readState } from "@/lib/store";

export async function generateMetadata(): Promise<Metadata> {
  return { title: messagesFor(await lang()).orders.title };
}

/** 시각은 가게가 있는 서울 시각이다. 형식만 방문자의 언어를 따른다. */
const when = (iso: string, l: Lang) =>
  new Date(iso).toLocaleString(messagesFor(l).dateLocale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  });

/** `흰우유 외 2종` — 목록의 한 줄이 무엇을 산 주문인지 말한다. */
const gist = (lines: { productId: string; name: string }[], l: Lang) => {
  const first = lines[0] ? lineName(lines[0], l) : "";
  return lines.length <= 1 ? first : messagesFor(l).orders.gist(first, lines.length - 1);
};

export default async function OrdersPage() {
  const [state, l] = await Promise.all([readState(), lang()]);
  const t = messagesFor(l).orders;
  return (
    <>
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight">{t.title}</h1>
      {state.orders.length === 0 ? (
        <div className="grid place-items-center rounded-card border border-line bg-surface px-6 py-16 text-center shadow-card">
          <BoxIcon className="size-12 text-ink-faint" />
          <p className="mt-4 text-lg font-semibold">{t.empty}</p>
          <p className="mt-1 text-sm text-ink-soft">{t.emptyNote}</p>
          <Link
            href="/#products"
            className="mt-6 inline-flex h-11 items-center rounded-control bg-brand px-5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
          >
            {t.browse}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {state.orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/orders/${o.id}`}
                className="flex items-center gap-3 rounded-card border border-line bg-surface p-3 shadow-card transition-shadow hover:shadow-lift sm:gap-4 sm:p-4"
              >
                <Thumb productId={o.lines[0]?.productId ?? ""} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-ink-faint">{when(o.placedAt, l)}</span>
                  <span className="block truncate font-semibold">{gist(o.lines, l)}</span>
                  <span className="block font-mono text-xs text-ink-soft">{o.number}</span>
                </span>
                <span className="text-lg font-bold tabular-nums">{money(o.total, l)}</span>
                <ChevronIcon className="size-5 shrink-0 text-ink-faint" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
