import { describe, expect, it } from "vitest";
import { addLine, EMPTY_CART } from "./cart";
import { initialStock, PRODUCTS } from "./catalog";
import { cancelOrder, placeOrder } from "./orders";
import { decodeState, encodeState, freshState, MAX_ORDERS, type State } from "./state";

const now = new Date("2026-09-20T09:00:00+09:00");

/** 여섯 상품을 전부 담은 주문을 n 번 낸 상태. 재고는 넉넉하게 준다. */
function stateWithOrders(n: number): State {
  let state: State = {
    ...freshState(),
    stock: Object.fromEntries(PRODUCTS.map((p) => [p.id, 999])),
  };
  for (let k = 0; k < n; k++) {
    let cart = EMPTY_CART;
    for (const p of PRODUCTS) cart = addLine(cart, p.id, 9, state.stock);
    const { order, stock } = placeOrder(cart, state.stock, { seq: state.nextSeq, now });
    state = { ...state, stock, orders: [order, ...state.orders], nextSeq: state.nextSeq + 1 };
  }
  return state;
}

describe("쿠키에 담기", () => {
  it("담았다 꺼내면 같은 상태다", () => {
    const stock = initialStock();
    const cart = addLine(addLine(EMPTY_CART, "milk-1l", 3, stock), "yogurt-greek", 1, stock);
    const placed = placeOrder(cart, stock, { seq: 1, now });
    const state: State = {
      stock: placed.stock,
      cart: addLine(EMPTY_CART, "choco-500", 2, placed.stock),
      orders: [placed.order],
      nextSeq: 2,
    };
    const back = decodeState(encodeState(state));
    expect(back.stock).toEqual(state.stock);
    expect(back.cart).toEqual(state.cart);
    expect(back.nextSeq).toBe(2);
    expect(back.orders[0]).toMatchObject({
      id: "UM-0001",
      number: "UM-0001",
      lines: placed.order.lines,
      subtotal: placed.order.subtotal,
      shipping: placed.order.shipping,
      total: placed.order.total,
    });
  });

  it("가장 많이 찬 상태도 쿠키 한 장에 들어간다", () => {
    const full = stateWithOrders(MAX_ORDERS);
    let cart = EMPTY_CART;
    for (const p of PRODUCTS) cart = addLine(cart, p.id, 99, full.stock);
    // 쿠키의 벽은 이름·속성까지 4,096바이트다. 값은 3,500 아래로 둔다.
    expect(encodeState({ ...full, cart }).length).toBeLessThan(3500);
  });

  it(`주문은 최근 ${MAX_ORDERS}건까지만 남는다`, () => {
    const back = decodeState(encodeState(stateWithOrders(MAX_ORDERS + 3)));
    expect(back.orders).toHaveLength(MAX_ORDERS);
    expect(back.orders[0]?.number).toBe("UM-0013");
    expect(back.orders.at(-1)?.number).toBe("UM-0004");
    // 번호는 이어진다 — 빠진 주문의 번호를 다시 쓰지 않는다.
    expect(back.nextSeq).toBe(14);
  });

  it("취소된 주문은 취소됨으로 꺼내진다", () => {
    const stock = initialStock();
    const cart = addLine(EMPTY_CART, "milk-1l", 2, stock);
    const placed = placeOrder(cart, stock, { seq: 1, now });
    const cancelled = cancelOrder(placed.order, placed.stock);
    const back = decodeState(
      encodeState({ stock: cancelled.stock, cart: EMPTY_CART, orders: [cancelled.order], nextSeq: 2 }),
    );
    expect(back.orders[0]?.status).toBe("cancelled");
    expect(back.stock["milk-1l"]).toBe(stock["milk-1l"]);
  });

  it("취소를 담아도 쿠키 한 장에 들어간다", () => {
    const full = stateWithOrders(MAX_ORDERS);
    const allCancelled = { ...full, orders: full.orders.map((o) => ({ ...o, status: "cancelled" as const })) };
    expect(encodeState(allCancelled).length).toBeLessThan(3500);
  });

  it("없거나 깨진 값은 처음 상태다", () => {
    expect(decodeState(undefined)).toEqual(freshState());
    expect(decodeState("not-base64-json")).toEqual(freshState());
    expect(decodeState(Buffer.from('{"v":2}').toString("base64url"))).toEqual(freshState());
    expect(
      decodeState(Buffer.from('{"v":1,"s":[1],"c":[],"o":[],"n":1}').toString("base64url")),
    ).toEqual(freshState());
  });
});
