import { type Cart, EMPTY_CART, type Stock } from "./cart";
import { initialStock, PRODUCTS } from "./catalog";
import { type Order, orderNumber } from "./orders";

/**
 * 가게의 상태와, 그것을 쿠키 한 장에 담는 법. 저장소(`store.ts`)를 모르는 순수 모듈이다.
 *
 * 쿠키는 4,096바이트가 벽이고 넘으면 브라우저가 조용히 버린다. 그래서 **압축한 모양**만 넣는다 —
 * 상품은 카탈로그의 순번으로, 이름·단위는 넣지 않고 코드에 고정된 카탈로그에서 되살린다(한글은 인코딩으로
 * 세 배가 된다). 주문은 최근 `MAX_ORDERS` 건까지다.
 */
export type State = {
  stock: Stock;
  cart: Cart;
  /** 최근 주문이 앞이다. */
  orders: Order[];
  nextSeq: number;
};

export const MAX_ORDERS = 10;

export function freshState(): State {
  return { stock: initialStock(), cart: EMPTY_CART, orders: [], nextSeq: 1 };
}

/** [상품 순번, 수량, 그때의 가격] */
type PackedLine = [number, number, number];
/** [일련번호, 주문 시각(초), 줄, 배송비, 취소됨(취소된 주문만 `1`)] */
type PackedOrder = [number, number, PackedLine[], number, 1?];
type Packed = {
  v: 1;
  /** 카탈로그 순서의 남은 재고. */
  s: number[];
  /** [상품 순번, 수량] */
  c: [number, number][];
  o: PackedOrder[];
  n: number;
};

const indexOf = (productId: string): number => {
  const i = PRODUCTS.findIndex((p) => p.id === productId);
  if (i < 0) throw new Error(`unknown product ${productId}`);
  return i;
};

const productAt = (i: number) => {
  const p = PRODUCTS[i];
  if (!p) throw new Error(`unknown product index ${i}`);
  return p;
};

export function encodeState(state: State): string {
  const packed: Packed = {
    v: 1,
    s: PRODUCTS.map((p) => state.stock[p.id] ?? 0),
    c: state.cart.lines.map((l) => [indexOf(l.productId), l.qty]),
    o: state.orders.slice(0, MAX_ORDERS).map((o): PackedOrder => {
      const seq = Number(o.number.replace(/^UM-/, ""));
      const at = Math.floor(Date.parse(o.placedAt) / 1000);
      const lines = o.lines.map((l): PackedLine => [indexOf(l.productId), l.qty, l.price]);
      // 확정된 주문에는 아무것도 붙이지 않는다 — 쿠키는 한 글자도 아깝다.
      return o.status === "cancelled"
        ? [seq, at, lines, o.shipping, 1]
        : [seq, at, lines, o.shipping];
    }),
    n: state.nextSeq,
  };
  return Buffer.from(JSON.stringify(packed), "utf8").toString("base64url");
}

/** 없거나 깨진 값은 처음 상태다 — 쿠키는 사람이 지우고 고칠 수 있는 자리다. */
export function decodeState(raw: string | undefined | null): State {
  if (!raw) return freshState();
  try {
    const packed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Packed;
    if (packed.v !== 1 || packed.s.length !== PRODUCTS.length) return freshState();
    return {
      stock: Object.fromEntries(PRODUCTS.map((p, i) => [p.id, nonNegative(packed.s[i])])),
      cart: {
        lines: packed.c.map(([i, qty]) => ({ productId: productAt(i).id, qty: nonNegative(qty) })),
      },
      orders: packed.o.slice(0, MAX_ORDERS).map(([seq, at, lines, shipping, cancelled]): Order => {
        const orderLines = lines.map(([i, qty, price]) => {
          const p = productAt(i);
          return { productId: p.id, name: p.name, unit: p.unit, price, qty };
        });
        const subtotal = orderLines.reduce((sum, l) => sum + l.price * l.qty, 0);
        return {
          id: orderNumber(seq),
          number: orderNumber(seq),
          placedAt: new Date(at * 1000).toISOString(),
          lines: orderLines,
          subtotal,
          shipping,
          total: subtotal + shipping,
          status: cancelled === 1 ? "cancelled" : "placed",
        };
      }),
      nextSeq: Math.max(1, Math.floor(packed.n)),
    };
  } catch {
    return freshState();
  }
}

function nonNegative(n: unknown): number {
  return typeof n === "number" && Number.isInteger(n) && n >= 0 ? n : 0;
}
