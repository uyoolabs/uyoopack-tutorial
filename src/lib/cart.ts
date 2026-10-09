import { type Product, productById } from "./catalog";

/**
 * 장바구니의 규칙. 저장소를 모르는 순수 함수다 — 재고는 인자로 받는다.
 */
export type CartLine = { productId: string; qty: number };
export type Cart = { lines: CartLine[] };
export type Stock = Record<string, number>;

export const EMPTY_CART: Cart = { lines: [] };

/** 이 금액부터 배송비가 없다. */
export const FREE_SHIPPING_FROM = 30_000;
export const SHIPPING_FEE = 3_000;
/** 장바구니 한 줄에 담을 수 있는 최대 수량. */
export const MAX_LINE_QTY = 99;

export type CartErrorCode = "unknown_product" | "bad_qty" | "out_of_stock";

/**
 * 거절의 까닭과 그 문장에 들어가는 값. `message` 는 한국어 문장이고, 화면은 이 값으로 방문자의 언어에 맞춰
 * 다시 쓴다(`messages.ts` 의 `errorText`).
 */
export type CartErrorDetail =
  | { reason: "unknown_product" }
  | { reason: "bad_qty" }
  | { reason: "empty_cart" }
  | { reason: "stock_limit"; productId: string; left: number }
  | { reason: "stock_short"; productId: string; left: number };

export class CartError extends Error {
  constructor(
    readonly code: CartErrorCode,
    message: string,
    readonly detail: CartErrorDetail,
  ) {
    super(message);
    this.name = "CartError";
  }
}

function requireProduct(productId: string): Product {
  const product = productById(productId);
  if (!product) throw new CartError("unknown_product", "없는 상품입니다.", { reason: "unknown_product" });
  return product;
}

function requireQty(qty: number): void {
  if (!Number.isInteger(qty) || qty < 0) {
    throw new CartError("bad_qty", "수량은 0 이상의 정수여야 합니다.", { reason: "bad_qty" });
  }
}

function requireStock(product: Product, qty: number, stock: Stock): void {
  const left = stock[product.id] ?? 0;
  if (qty > left) {
    throw new CartError("out_of_stock", `${product.name}의 재고가 ${left}개라 ${left}개까지 담을 수 있습니다.`, {
      reason: "stock_limit",
      productId: product.id,
      left,
    });
  }
}

/** 담는다. 이미 있는 상품이면 수량을 더한다. 재고를 넘기면 거절한다. */
export function addLine(cart: Cart, productId: string, qty: number, stock: Stock): Cart {
  const product = requireProduct(productId);
  requireQty(qty);
  if (qty === 0) return cart;
  const current = cart.lines.find((l) => l.productId === productId)?.qty ?? 0;
  const next = current + qty;
  requireStock(product, next, stock);
  const lines = current
    ? cart.lines.map((l) => (l.productId === productId ? { ...l, qty: next } : l))
    : [...cart.lines, { productId, qty: next }];
  return { lines };
}

/** 수량을 바꾼다. 0 이면 뺀다. */
export function setQty(cart: Cart, productId: string, qty: number, _stock: Stock): Cart {
  requireProduct(productId);
  requireQty(qty);
  if (qty === 0) return removeLine(cart, productId);
  const exists = cart.lines.some((l) => l.productId === productId);
  const lines = exists
    ? cart.lines.map((l) => (l.productId === productId ? { ...l, qty } : l))
    : [...cart.lines, { productId, qty }];
  return { lines };
}

export function removeLine(cart: Cart, productId: string): Cart {
  return { lines: cart.lines.filter((l) => l.productId !== productId) };
}

export function shippingFor(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
}

export type SummaryLine = {
  product: Product;
  qty: number;
  lineTotal: number;
};

export type Summary = {
  lines: SummaryLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
};

/** 소계 = 각 줄의 가격 × 수량의 합. 총액 = 소계 + 배송비. */
export function summarize(cart: Cart): Summary {
  const lines = cart.lines.map((l) => {
    const product = requireProduct(l.productId);
    return { product, qty: l.qty, lineTotal: product.price * l.qty };
  });
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping = shippingFor(subtotal);
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}
