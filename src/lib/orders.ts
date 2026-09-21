import { type Cart, CartError, type Stock, summarize } from "./cart";

/**
 * 주문의 규칙. 결제는 붙이지 않는다 — 주문을 확정하고 재고를 줄이는 데서 끝난다.
 * 주문 줄은 그때의 가격을 그대로 적어 둔다. 나중에 가격이 바뀌어도 지난 주문은 그대로여야 한다.
 * 취소한 주문은 지우지 않고 취소됨으로 남긴다 — 지난 주문은 사라지지 않는다.
 */
export type OrderLine = {
  productId: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
};

export type Order = {
  /** 주문 번호와 같다(`UM-0001`). 주소(`/orders/UM-0001`)에 그대로 쓴다. */
  id: string;
  number: string;
  placedAt: string;
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
};

/** 확정된 주문(`placed`)은 취소할 수 있고, 취소한 주문(`cancelled`)은 그대로 남는다. */
export type OrderStatus = "placed" | "cancelled";

export function orderNumber(seq: number): string {
  return `UM-${String(seq).padStart(4, "0")}`;
}

/**
 * 장바구니로 주문을 만든다. 빈 장바구니와 재고 부족은 거절한다.
 * 돌려주는 `stock` 은 주문만큼 줄어든 새 재고다(입력은 바꾸지 않는다).
 */
export function placeOrder(
  cart: Cart,
  stock: Stock,
  opts: { seq: number; now: Date },
): { order: Order; stock: Stock } {
  if (cart.lines.length === 0) throw new CartError("bad_qty", "장바구니가 비어 있습니다.");
  const summary = summarize(cart);
  const next: Stock = { ...stock };
  for (const line of summary.lines) {
    const left = next[line.product.id] ?? 0;
    if (line.qty > left) {
      throw new CartError("out_of_stock", `${line.product.name}의 재고가 ${left}개뿐입니다.`);
    }
    next[line.product.id] = left - line.qty;
  }
  const order: Order = {
    id: orderNumber(opts.seq),
    number: orderNumber(opts.seq),
    placedAt: opts.now.toISOString(),
    lines: summary.lines.map((l) => ({
      productId: l.product.id,
      name: l.product.name,
      unit: l.product.unit,
      price: l.product.price,
      qty: l.qty,
    })),
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: summary.total,
    status: "placed",
  };
  return { order, stock: next };
}

/**
 * 확정된 주문을 취소한다. 주문은 지우지 않고 취소됨으로 남고, 재고는 주문 수량만큼 돌아온다.
 * 이미 취소된 주문은 거절한다 — 두 번 취소하면 재고가 두 번 늘어난다.
 * 돌려주는 값은 새 주문과 새 재고다(입력은 바꾸지 않는다).
 */
export function cancelOrder(order: Order, stock: Stock): { order: Order; stock: Stock } {
  if (order.status === "cancelled") {
    throw new CartError("already_cancelled", `${order.number}은 이미 취소된 주문입니다.`);
  }
  const next: Stock = { ...stock };
  for (const line of order.lines) {
    next[line.productId] = (next[line.productId] ?? 0) + line.qty;
  }
  return { order: { ...order, status: "cancelled" }, stock: next };
}
