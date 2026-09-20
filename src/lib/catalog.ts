/**
 * 상품 목록. 가게가 파는 것은 이 여섯 개뿐이고 코드에 고정한다 — 상품 관리 화면은 이 튜토리얼의 범위 밖이다.
 * 가격은 원 단위 정수다. `stock` 은 처음 재고이고, 팔리면서 줄어드는 값은 `store.ts` 가 갖는다.
 *
 * **순서를 바꾸지 않는다.** 쿠키(`state.ts`)가 상품을 이 배열의 번호로 적는다 — 순서가 바뀌면 방문자의 장바구니가
 * 다른 상품이 된다. 새 상품은 끝에 더한다.
 */
export type Category = "milk" | "flavored" | "yogurt";

export const CATEGORIES: readonly { id: Category; label: string }[] = [
  { id: "milk", label: "우유" },
  { id: "flavored", label: "가공유" },
  { id: "yogurt", label: "요거트" },
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
  },
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function categoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** 처음 재고. 저장소가 비어 있을 때 이 값으로 시작한다. */
export function initialStock(): Record<string, number> {
  return Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));
}
