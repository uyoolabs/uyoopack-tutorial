/** 원 단위 정수를 `12,500원` 으로. 소수는 다루지 않는다 — 금액은 언제나 정수다. */
export function won(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/**
 * 단위 가격 — `100ml당 250원`. 같은 종류를 용량이 다른 채로 비교하는 값이다.
 * 나눗셈이라 소수가 생길 수 있고, 금액은 원 단위 정수이므로 내림한다(명세 CON-2).
 */
export function unitPrice(price: number, size: { amount: number; per: "ml" | "g" }): string {
  return `100${size.per}당 ${won(Math.floor((price * 100) / size.amount))}`;
}
