/**
 * 화면의 언어. 영어와 한국어 둘이고, 방문자의 브라우저가 고른다 — 언어를 고르는 버튼은 두지 않는다.
 * 순수 모듈이다. 요청의 헤더를 읽는 쪽은 `request-lang.ts` 다.
 */
export type Lang = "en" | "ko";

export const LANGS: readonly Lang[] = ["en", "ko"];

/**
 * `Accept-Language` 에서 한국어가 영어보다 앞서면 한국어, 그 밖에는 영어다(둘 다 없어도 영어).
 * q 값이 큰 것이 앞이고 같으면 적힌 순서를 따른다. `q=0` 은 "원하지 않음" 이라 뺀다.
 */
export function pickLang(acceptLanguage: string | null | undefined): Lang {
  if (!acceptLanguage) return "en";
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.split(";").map((s) => s.trim());
      const q = params.find((p) => p.startsWith("q="));
      const weight = q ? Number(q.slice(2)) : 1;
      return { lang: tag.toLowerCase().split("-")[0], weight: Number.isFinite(weight) ? weight : 0, index };
    })
    .filter((x) => x.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  return ranked.find((x) => x.lang === "ko" || x.lang === "en")?.lang === "ko" ? "ko" : "en";
}
