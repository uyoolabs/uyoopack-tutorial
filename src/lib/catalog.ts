/**
 * 상품 목록. 가게가 파는 것은 이 여섯 개뿐이고 코드에 고정한다 — 상품 관리 화면은 이 튜토리얼의 범위 밖이다.
 * 가격은 원 단위 정수다. `stock` 은 처음 재고이고, 팔리면서 줄어드는 값은 `store.ts` 가 갖는다.
 */
export type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
};

export const PRODUCTS: readonly Product[] = [
  { id: "milk-1l", name: "흰우유", unit: "1L", price: 2500, stock: 24 },
  { id: "lowfat-1l", name: "저지방 우유", unit: "1L", price: 2700, stock: 20 },
  { id: "choco-500", name: "초코우유", unit: "500ml", price: 1800, stock: 30 },
  { id: "strawberry-500", name: "딸기우유", unit: "500ml", price: 1800, stock: 30 },
  { id: "yogurt-plain", name: "플레인 요거트", unit: "450g", price: 4500, stock: 12 },
  { id: "yogurt-greek", name: "그릭 요거트", unit: "200g", price: 3900, stock: 12 },
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** 처음 재고. 저장소가 비어 있을 때 이 값으로 시작한다. */
export function initialStock(): Record<string, number> {
  return Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));
}
