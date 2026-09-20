import { describe, expect, it } from "vitest";
import { addLine, CartError, EMPTY_CART, removeLine, setQty, SHIPPING_FEE, shippingFor, summarize } from "./cart";
import { initialStock } from "./catalog";

const stock = initialStock();

describe("담기", () => {
  it("같은 상품을 다시 담으면 수량이 더해진다", () => {
    const cart = addLine(addLine(EMPTY_CART, "milk-1l", 2, stock), "milk-1l", 3, stock);
    expect(cart.lines).toEqual([{ productId: "milk-1l", qty: 5 }]);
  });

  it("재고를 넘기면 거절한다", () => {
    expect(() => addLine(EMPTY_CART, "yogurt-greek", 13, stock)).toThrowError(CartError);
    expect(() => addLine(EMPTY_CART, "yogurt-greek", 13, stock)).toThrow(/12개까지/);
  });

  it("없는 상품은 거절한다", () => {
    expect(() => addLine(EMPTY_CART, "butter", 1, stock)).toThrow(CartError);
  });
});

describe("수량 바꾸기", () => {
  it("0 으로 바꾸면 줄이 빠진다", () => {
    const cart = addLine(EMPTY_CART, "milk-1l", 2, stock);
    expect(setQty(cart, "milk-1l", 0, stock).lines).toEqual([]);
  });

  it("음수와 소수는 거절한다", () => {
    const cart = addLine(EMPTY_CART, "milk-1l", 2, stock);
    expect(() => setQty(cart, "milk-1l", -1, stock)).toThrow(/0 이상의 정수/);
    expect(() => setQty(cart, "milk-1l", 1.5, stock)).toThrow(/0 이상의 정수/);
  });

  it("빼면 그 줄만 사라진다", () => {
    const cart = addLine(addLine(EMPTY_CART, "milk-1l", 1, stock), "choco-500", 1, stock);
    expect(removeLine(cart, "milk-1l").lines).toEqual([{ productId: "choco-500", qty: 1 }]);
  });
});

describe("합계", () => {
  it("소계는 가격 × 수량의 합이고 총액은 소계 + 배송비다", () => {
    const cart = addLine(addLine(EMPTY_CART, "milk-1l", 2, stock), "yogurt-plain", 1, stock);
    const s = summarize(cart);
    expect(s.subtotal).toBe(2500 * 2 + 4500);
    expect(s.shipping).toBe(SHIPPING_FEE);
    expect(s.total).toBe(s.subtotal + SHIPPING_FEE);
    expect(s.count).toBe(3);
  });

  it("빈 장바구니는 배송비도 0 이다", () => {
    expect(summarize(EMPTY_CART)).toMatchObject({ subtotal: 0, shipping: 0, total: 0, count: 0 });
  });

  it("3만 원 미만은 배송비가 붙고 3만 원을 넘으면 없다", () => {
    expect(shippingFor(29_999)).toBe(SHIPPING_FEE);
    expect(shippingFor(30_001)).toBe(0);
  });
});
