import { describe, expect, it } from "vitest";
import { addLine, CartError, EMPTY_CART } from "./cart";
import { initialStock } from "./catalog";
import { orderNumber, placeOrder } from "./orders";

const now = new Date("2026-09-20T09:00:00+09:00");

describe("주문", () => {
  it("주문하면 재고가 그만큼 줄고 주문 줄에 그때의 가격이 남는다", () => {
    const stock = initialStock();
    const cart = addLine(EMPTY_CART, "milk-1l", 3, stock);
    const { order, stock: after } = placeOrder(cart, stock, { seq: 1, now });
    expect(after["milk-1l"]).toBe(stock["milk-1l"] - 3);
    expect(stock["milk-1l"]).toBe(24);
    expect(order.lines).toEqual([{ productId: "milk-1l", name: "흰우유", unit: "1L", price: 2500, qty: 3 }]);
    expect(order.number).toBe("UM-0001");
    expect(order.status).toBe("placed");
  });

  it("빈 장바구니는 주문할 수 없다", () => {
    expect(() => placeOrder(EMPTY_CART, initialStock(), { seq: 1, now })).toThrow(CartError);
  });

  it("담은 뒤 재고가 줄어 모자라면 거절한다", () => {
    const stock = initialStock();
    const cart = addLine(EMPTY_CART, "yogurt-greek", 5, stock);
    expect(() => placeOrder(cart, { ...stock, "yogurt-greek": 2 }, { seq: 1, now })).toThrow(/재고가 2개뿐/);
  });

  it("주문 번호는 네 자리로 채운다", () => {
    expect(orderNumber(7)).toBe("UM-0007");
    expect(orderNumber(12345)).toBe("UM-12345");
  });
});
