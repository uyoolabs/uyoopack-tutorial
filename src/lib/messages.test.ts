import { describe, expect, it } from "vitest";
import { addLine, CartError, EMPTY_CART, setQty } from "./cart";
import { CATEGORIES, initialStock, PRODUCTS } from "./catalog";
import { errorText, MESSAGES } from "./messages";
import { placeOrder } from "./orders";

/** 키의 경로 전부. 함수와 글은 잎이다. */
function paths(value: unknown, prefix = ""): string[] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [`${prefix}:${Array.isArray(value) ? `list${value.length}` : typeof value}`];
}

/** 글이 든 자리. 함수는 아무 값이나 넣어 불러 본다. */
function texts(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function") return [String(value("X", 2))];
  if (Array.isArray(value)) return value.flatMap(texts);
  if (value && typeof value === "object") return Object.values(value).flatMap(texts);
  return [];
}

/** 규칙이 던진 거절. */
function caught(fn: () => unknown): CartError {
  try {
    fn();
  } catch (err) {
    if (err instanceof CartError) return err;
    throw err;
  }
  throw new Error("거절하지 않았습니다");
}

describe("화면의 글", () => {
  it("영어와 한국어가 같은 키를 갖는다", () => {
    expect(paths(MESSAGES.ko)).toEqual(paths(MESSAGES.en));
  });

  it("영어 글에는 한글이 없다", () => {
    expect(texts(MESSAGES.en).filter((t) => /[가-힣]/.test(t))).toEqual([]);
  });

  it("상품과 종류는 두 언어의 이름을 갖는다", () => {
    for (const p of PRODUCTS) {
      expect(p.en.name).toMatch(/^[A-Z][a-z-]+(?: [a-z]+)*$/);
      expect(p.en.blurb).not.toMatch(/[가-힣]/);
    }
    for (const c of CATEGORIES) expect(c.en).not.toMatch(/[가-힣]/);
  });
});

describe("거절 문장", () => {
  const stock = initialStock();
  const cases = {
    unknown_product: caught(() => addLine(EMPTY_CART, "butter", 1, stock)),
    bad_qty: caught(() => setQty(EMPTY_CART, "milk-1l", -1, stock)),
    stock_limit: caught(() => addLine(EMPTY_CART, "yogurt-greek", 13, stock)),
    empty_cart: caught(() => placeOrder(EMPTY_CART, stock, { seq: 1, now: new Date() })),
    stock_short: caught(() =>
      placeOrder(addLine(EMPTY_CART, "yogurt-greek", 5, stock), { ...stock, "yogurt-greek": 2 }, {
        seq: 1,
        now: new Date(),
      }),
    ),
  };

  it("까닭마다 거절이 하나씩 있다", () => {
    expect(Object.entries(cases).map(([reason, err]) => [reason, err.detail.reason])).toEqual(
      Object.keys(cases).map((reason) => [reason, reason]),
    );
  });

  it("한국어는 규칙이 던진 문장 그대로다", () => {
    for (const err of Object.values(cases)) expect(errorText(err.detail, "ko")).toBe(err.message);
  });

  it("영어는 영어 상품 이름으로 쓴다", () => {
    expect(errorText(cases.stock_limit.detail, "en")).toBe("Greek yogurt has 12 in stock, so you can add up to 12.");
    expect(errorText(cases.stock_short.detail, "en")).toBe("Greek yogurt has only 2 left in stock.");
    expect(errorText(cases.empty_cart.detail, "en")).toBe("Your cart is empty.");
  });
});
