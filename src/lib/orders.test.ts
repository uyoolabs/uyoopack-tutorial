import { describe, expect, it } from "vitest";
import { addLine, CartError, EMPTY_CART } from "./cart";
import { initialStock } from "./catalog";
import { cancelOrder, orderNumber, placeOrder } from "./orders";

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

describe("주문 취소", () => {
  /** 흰우유 3개, 그릭요거트 2개를 주문한 뒤의 주문과 재고. */
  function placed() {
    const stock = initialStock();
    const cart = addLine(addLine(EMPTY_CART, "milk-1l", 3, stock), "yogurt-greek", 2, stock);
    return placeOrder(cart, stock, { seq: 1, now });
  }

  it("취소하면 재고가 주문 수량만큼 돌아온다", () => {
    const before = initialStock();
    const { order, stock: afterOrder } = placed();
    const { stock: afterCancel } = cancelOrder(order, afterOrder);
    expect(afterCancel["milk-1l"]).toBe(before["milk-1l"]);
    expect(afterCancel["yogurt-greek"]).toBe(before["yogurt-greek"]);
  });

  it("취소한 주문은 지우지 않고 취소됨으로 남는다", () => {
    const { order, stock } = placed();
    const { order: cancelled } = cancelOrder(order, stock);
    expect(cancelled.status).toBe("cancelled");
    expect(cancelled.number).toBe(order.number);
    expect(cancelled.lines).toEqual(order.lines);
    expect(cancelled.total).toBe(order.total);
    // 입력은 바꾸지 않는다.
    expect(order.status).toBe("placed");
  });

  it("두 번 취소할 수 없다", () => {
    const { order, stock } = placed();
    const { order: cancelled, stock: afterCancel } = cancelOrder(order, stock);
    expect(() => cancelOrder(cancelled, afterCancel)).toThrow(CartError);
    expect(() => cancelOrder(cancelled, afterCancel)).toThrow(/이미 취소된 주문/);
  });
});
