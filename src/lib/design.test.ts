import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * 색은 디자인 토큰만 쓴다(명세 CON-3). 화면 코드에 hex 색이나 Tailwind 기본 팔레트가 들어오면 여기서 걸린다 —
 * 새 화면을 더하는 사람(과 에이전트)이 `bg-blue-600` 을 쓰는 순간 브랜드가 두 곳에서 정해지기 시작한다.
 */
const SCREENS = ["src/app", "src/components"];
const PALETTE =
  /\b(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline|shadow|accent|decoration)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;
const HEX = /#[0-9a-fA-F]{3,8}\b/;

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return tsxFiles(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}

describe("디자인 토큰", () => {
  const files = SCREENS.flatMap(tsxFiles);

  it("화면 코드가 있다", () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it.each(files)("%s — hex 색과 기본 팔레트를 쓰지 않는다", (file) => {
    const offending = readFileSync(file, "utf8")
      .split("\n")
      .map((line, i) => ({ line, n: i + 1 }))
      // 주소의 `#products`·`#main` 은 걸리지 않는다 — 16진수 글자만으로 된 낱말이 아니다
      .filter(({ line }) => PALETTE.test(line) || HEX.test(line));
    expect(offending.map((o) => `${o.n}: ${o.line.trim()}`)).toEqual([]);
  });
});
