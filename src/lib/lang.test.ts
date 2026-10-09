import { describe, expect, it } from "vitest";
import { pickLang } from "./lang";

describe("화면의 언어", () => {
  it("한국어를 영어보다 앞에 둔 브라우저는 한국어다", () => {
    expect(pickLang("ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7")).toBe("ko");
    expect(pickLang("ko")).toBe("ko");
    expect(pickLang("KO-kr")).toBe("ko");
    // 적힌 순서보다 q 값이 먼저다.
    expect(pickLang("en;q=0.5,ko;q=0.8")).toBe("ko");
    // 영어가 없어도 한국어가 있으면 한국어다.
    expect(pickLang("fr-FR,fr;q=0.9,ko;q=0.5")).toBe("ko");
  });

  it("그 밖에는 영어다", () => {
    expect(pickLang("en-US,en;q=0.9,ko;q=0.8")).toBe("en");
    expect(pickLang("ja-JP,ja;q=0.9")).toBe("en");
    expect(pickLang("*")).toBe("en");
    expect(pickLang("")).toBe("en");
    expect(pickLang(null)).toBe("en");
    expect(pickLang(undefined)).toBe("en");
  });

  it("q=0 은 원하지 않는다는 뜻이라 고르지 않는다", () => {
    expect(pickLang("ko;q=0,en")).toBe("en");
    expect(pickLang("ko;q=0")).toBe("en");
  });
});
