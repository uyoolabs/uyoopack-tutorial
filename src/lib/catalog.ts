import type { Lang } from "./lang";

/**
 * 상품 목록. 가게가 파는 것은 이 여섯 개뿐이고 코드에 고정한다 — 상품 관리 화면은 이 튜토리얼의 범위 밖이다.
 * 가격은 원 단위 정수다. `stock` 은 처음 재고이고, 팔리면서 줄어드는 값은 `store.ts` 가 갖는다.
 * 이름·설명은 한국어(`name`·`blurb`)와 영어(`en`) 두 벌이다. 규칙과 주문 줄은 한국어 이름을 그대로 쓰고,
 * 화면은 `productName`·`productBlurb` 로 방문자의 언어를 고른다.
 *
 * **순서를 바꾸지 않는다.** 쿠키(`state.ts`)가 상품을 이 배열의 번호로 적는다 — 순서가 바뀌면 방문자의 장바구니가
 * 다른 상품이 된다. 새 상품은 끝에 더한다.
 */
export type Category = "milk" | "flavored" | "yogurt";

export const CATEGORIES: readonly { id: Category; label: string; en: string }[] = [
  { id: "milk", label: "우유", en: "Milk" },
  { id: "flavored", label: "가공유", en: "Flavored milk" },
  { id: "yogurt", label: "요거트", en: "Yogurt" },
];

export type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  category: Category;
  /** 카드에 서는 한 줄 설명. */
  blurb: string;
  /** `public/` 아래의 사진. */
  image: string;
  /** 단위 가격의 재료 — 용량(ml 또는 g)과 그 단위. */
  size: { amount: number; per: "ml" | "g" };
  /** 영어 화면의 이름과 설명. */
  en: { name: string; blurb: string };
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "milk-1l",
    name: "흰우유",
    unit: "1L",
    price: 2500,
    stock: 24,
    category: "milk",
    blurb: "아침마다 들어오는 1등급 원유 그대로",
    image: "/products/milk-1l.webp",
    size: { amount: 1000, per: "ml" },
    en: { name: "Whole milk", blurb: "Top-grade milk, delivered every morning" },
  },
  {
    id: "lowfat-1l",
    name: "저지방 우유",
    unit: "1L",
    price: 2700,
    stock: 20,
    category: "milk",
    blurb: "지방은 절반으로, 고소함은 그대로",
    image: "/products/lowfat-1l.webp",
    size: { amount: 1000, per: "ml" },
    en: { name: "Low-fat milk", blurb: "Half the fat, the same rich taste" },
  },
  {
    id: "choco-500",
    name: "초코우유",
    unit: "500ml",
    price: 1800,
    stock: 30,
    category: "flavored",
    blurb: "진한 코코아에 덜 단 맛",
    image: "/products/choco-500.webp",
    size: { amount: 500, per: "ml" },
    en: { name: "Chocolate milk", blurb: "Rich cocoa, not too sweet" },
  },
  {
    id: "strawberry-500",
    name: "딸기우유",
    unit: "500ml",
    price: 1800,
    stock: 30,
    category: "flavored",
    blurb: "딸기 과즙을 넣은 분홍 우유",
    image: "/products/strawberry-500.webp",
    size: { amount: 500, per: "ml" },
    en: { name: "Strawberry milk", blurb: "Pink milk made with strawberry juice" },
  },
  {
    id: "yogurt-plain",
    name: "플레인 요거트",
    unit: "450g",
    price: 4500,
    stock: 12,
    category: "yogurt",
    blurb: "설탕 없이 우유와 유산균만",
    image: "/products/yogurt-plain.webp",
    size: { amount: 450, per: "g" },
    en: { name: "Plain yogurt", blurb: "Just milk and live cultures, no sugar" },
  },
  {
    id: "yogurt-greek",
    name: "그릭 요거트",
    unit: "200g",
    price: 3900,
    stock: 12,
    category: "yogurt",
    blurb: "물기를 빼 되직하고 진한 맛",
    image: "/products/yogurt-greek.webp",
    size: { amount: 200, per: "g" },
    en: { name: "Greek yogurt", blurb: "Strained until thick and rich" },
  },
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function categoryLabel(id: Category, lang: Lang): string {
  const c = CATEGORIES.find((x) => x.id === id);
  if (!c) return id;
  return lang === "ko" ? c.label : c.en;
}

export function productName(p: Pick<Product, "name" | "en">, lang: Lang): string {
  return lang === "ko" ? p.name : p.en.name;
}

export function productBlurb(p: Pick<Product, "blurb" | "en">, lang: Lang): string {
  return lang === "ko" ? p.blurb : p.en.blurb;
}

/**
 * 주문 줄의 이름. 줄에는 주문할 때의 한국어 이름이 남아 있다 — 카탈로그에 있는 상품이면 방문자의 언어로 다시
 * 부르고, 빠진 상품이면 남은 이름을 그대로 쓴다(지난 주문은 그대로 읽혀야 한다).
 */
export function lineName(line: { productId: string; name: string }, lang: Lang): string {
  const p = productById(line.productId);
  return p ? productName(p, lang) : line.name;
}

/** 처음 재고. 저장소가 비어 있을 때 이 값으로 시작한다. */
export function initialStock(): Record<string, number> {
  return Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));
}
