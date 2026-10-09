import type { CartErrorDetail } from "./cart";
import { productById, productName } from "./catalog";
import type { Lang } from "./lang";

/**
 * 화면의 글. 영어(`en`)와 한국어(`ko`)가 같은 키를 갖는다(`messages.test.ts` 가 맞춰 본다). 값이 들어가는 글은
 * 함수이고, 금액은 부르는 쪽이 `money()` 로 그 언어의 표기를 만들어 넘긴다.
 *
 * 한국어 글은 이 파일로 옮기기 전과 한 글자도 다르지 않다. 거절 문장의 한국어는 규칙(`cart.ts`·`orders.ts`)이
 * 던지는 `message` 와 같다.
 */
const en = {
  meta: {
    title: "UyooMarket · Neighborhood milk shop",
    template: "%s · UyooMarket",
    description:
      "Online orders for a neighborhood milk shop. Choose milk, flavored milk and yogurt with the stock in view.",
  },
  shop: "UyooMarket",
  skip: "Skip to content",
  banner: (from: string, fee: string) => `Free shipping on orders of ${from} or more · ${fee} below that`,
  nav: {
    label: "Main",
    products: "Products",
    orders: "Orders",
    cart: "Cart",
    cartCount: (n: number) => (n === 1 ? "Cart, 1 item" : `Cart, ${n} items`),
  },
  paymentNote: "There is no online payment. You pay in cash or by bank transfer when your order arrives.",
  footer: {
    about: "A neighborhood milk shop that takes orders on the web instead of by phone.",
    shipping: "Shipping",
    shippingBody: (fee: string, from: string) => `Shipping is ${fee}, and free on orders of ${from} or more.`,
    payment: "Payment",
    demo: "UyooMarket is a demo shop for the UyooPack tutorial. Nothing is actually ordered or delivered. Stock, cart and orders live only in this browser.",
    reset: "Start over",
  },
  home: {
    eyebrow: "Neighborhood milk shop · UyooMarket",
    headline: ["Today's milk is in.", "Check the stock and order."],
    lead: "Six products: milk, flavored milk and yogurt. Add them to your cart, check the total and place your order.",
    browse: "Browse products",
    heroAlt: "A bottle and a glass of milk with a bowl of yogurt on a wooden table",
    free: (from: string) => `Free shipping from ${from}`,
    freeNote: "The cart shows how much is left",
    stock: "Order with the stock in view",
    stockNote: "You can add only what is in stock",
    pay: "Pay on delivery",
    payNote: "Cash or bank transfer",
    products: "Today's products",
    categories: "Category",
    all: "All",
  },
  card: {
    soldOut: "Sold out",
    backSoon: "You can add it when it is back in stock",
    inStock: (n: number) => `${n} in stock`,
    qty: "Quantity",
    add: "Add to cart",
  },
  qty: {
    less: (label: string) => `${label}: one less`,
    more: (label: string) => `${label}: one more`,
  },
  cart: {
    title: "Cart",
    leftBefore: "Add ",
    leftAfter: " more for free shipping",
    reached: "You qualify for free shipping",
    progress: "Progress to free shipping",
    empty: "Your cart is empty.",
    emptyNote: "Start with today's milk.",
    browse: "Browse products",
    remove: "Remove",
    removeLabel: (name: string) => `Remove ${name}`,
    qtyLabel: (name: string) => `Quantity of ${name}`,
    update: "Update",
    summary: "Order summary",
    order: "Place order",
    more: "Keep shopping",
  },
  summary: { subtotal: "Subtotal", shipping: "Shipping", free: "Free", total: "Total" },
  orders: {
    title: "Orders",
    empty: "No orders yet.",
    emptyNote: "Orders you place show up here with their numbers.",
    browse: "Browse products",
    gist: (first: string, more: number) => `${first} and ${more} more`,
  },
  order: {
    title: "Order details",
    placed: "Order received.",
    items: "Items ordered",
    totals: "Totals",
    back: "Back to orders",
    more: "Keep shopping",
  },
  notFound: {
    title: "This page does not exist.",
    body: "The order number may belong to another browser, or the address has changed.",
    home: "Go to the shop",
  },
  errors: {
    unknownProduct: "That product is not in the shop.",
    badQty: "The quantity must be a whole number, 0 or more.",
    emptyCart: "Your cart is empty.",
    stockLimit: (name: string, left: number) => `${name} has ${left} in stock, so you can add up to ${left}.`,
    stockShort: (name: string, left: number) => `${name} has only ${left} left in stock.`,
  },
  /** 날짜를 쓰는 지역 형식. 시각은 언제나 가게가 있는 서울 시각이다. */
  dateLocale: "en-US",
};

export type Messages = typeof en;

const ko: Messages = {
  meta: {
    title: "우유마켓 — 동네 우유 가게",
    template: "%s · 우유마켓",
    description: "우유·가공유·요거트를 재고를 보고 고르는 동네 우유 가게의 온라인 주문",
  },
  shop: "우유마켓",
  skip: "본문으로 건너뛰기",
  banner: (from, fee) => `${from} 이상 주문하면 배송비가 없습니다 · 그 아래는 ${fee}`,
  nav: {
    label: "주 메뉴",
    products: "상품",
    orders: "주문 내역",
    cart: "장바구니",
    cartCount: (n) => `장바구니 ${n}`,
  },
  paymentNote: "온라인 결제는 없습니다. 상품을 받을 때 현금이나 계좌 이체로 냅니다.",
  footer: {
    about: "전화 대신 웹으로 주문받는 동네 우유 가게입니다.",
    shipping: "배송",
    shippingBody: (fee, from) => `배송비는 ${fee}이고 ${from} 이상 주문하면 없습니다.`,
    payment: "결제",
    demo: "우유마켓은 우유팩 튜토리얼을 위한 데모 가게입니다. 실제로 주문·배송되지 않습니다. 재고·장바구니·주문은 이 브라우저에만 있습니다.",
    reset: "처음 상태로",
  },
  home: {
    eyebrow: "동네 우유 가게 · 우유마켓",
    headline: ["오늘 들어온 우유를", "재고 보고 주문하세요"],
    lead: "우유·가공유·요거트 여섯 가지. 담고, 확인하고, 주문하면 끝입니다.",
    browse: "상품 보러 가기",
    heroAlt: "나무 식탁 위의 우유 한 병과 한 잔, 요거트 한 그릇",
    free: (from) => `${from} 이상 무료 배송`,
    freeNote: "장바구니에서 남은 금액을 알려 드립니다",
    stock: "재고를 보고 주문",
    stockNote: "남은 수량만큼만 담깁니다",
    pay: "결제는 받을 때",
    payNote: "현금이나 계좌 이체로 냅니다",
    products: "오늘의 상품",
    categories: "종류",
    all: "전체",
  },
  card: {
    soldOut: "품절",
    backSoon: "다시 들어오면 담을 수 있습니다",
    inStock: (n) => `재고 ${n}개`,
    qty: "수량",
    add: "담기",
  },
  qty: {
    less: (label) => `${label} 하나 줄이기`,
    more: (label) => `${label} 하나 늘리기`,
  },
  cart: {
    title: "장바구니",
    leftBefore: "",
    leftAfter: " 더 담으면 무료 배송입니다",
    reached: "무료 배송 기준을 채웠습니다",
    progress: "무료 배송까지",
    empty: "담은 상품이 없습니다.",
    emptyNote: "오늘 들어온 우유부터 둘러보세요.",
    browse: "상품 보러 가기",
    remove: "빼기",
    removeLabel: (name) => `${name} 빼기`,
    qtyLabel: (name) => `${name} 수량`,
    update: "바꾸기",
    summary: "주문 요약",
    order: "주문하기",
    more: "더 담으러 가기",
  },
  summary: { subtotal: "소계", shipping: "배송비", free: "무료", total: "총액" },
  orders: {
    title: "주문 내역",
    empty: "주문이 없습니다.",
    emptyNote: "주문하면 여기에 번호와 함께 남습니다.",
    browse: "상품 보러 가기",
    gist: (first, more) => `${first} 외 ${more}종`,
  },
  order: {
    title: "주문 상세",
    placed: "주문이 접수됐습니다.",
    items: "주문한 상품",
    totals: "합계",
    back: "주문 내역으로",
    more: "계속 둘러보기",
  },
  notFound: {
    title: "찾는 화면이 없습니다.",
    body: "주문 번호가 이 브라우저의 것이 아니거나 주소가 바뀌었습니다.",
    home: "첫 화면으로",
  },
  errors: {
    unknownProduct: "없는 상품입니다.",
    badQty: "수량은 0 이상의 정수여야 합니다.",
    emptyCart: "장바구니가 비어 있습니다.",
    stockLimit: (name, left) => `${name}의 재고가 ${left}개라 ${left}개까지 담을 수 있습니다.`,
    stockShort: (name, left) => `${name}의 재고가 ${left}개뿐입니다.`,
  },
  dateLocale: "ko-KR",
};

export const MESSAGES: Record<Lang, Messages> = { en, ko };

export function messagesFor(lang: Lang): Messages {
  return MESSAGES[lang];
}

/** 규칙이 거절한 까닭을 방문자의 언어로. 상품 이름도 그 언어로 부른다. */
export function errorText(detail: CartErrorDetail, lang: Lang): string {
  const t = MESSAGES[lang].errors;
  switch (detail.reason) {
    case "unknown_product":
      return t.unknownProduct;
    case "bad_qty":
      return t.badQty;
    case "empty_cart":
      return t.emptyCart;
    case "stock_limit":
    case "stock_short": {
      const p = productById(detail.productId);
      const name = p ? productName(p, lang) : detail.productId;
      return detail.reason === "stock_limit" ? t.stockLimit(name, detail.left) : t.stockShort(name, detail.left);
    }
  }
}
