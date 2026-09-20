/** 원 단위 정수를 `12,500원` 으로. 소수는 다루지 않는다 — 금액은 언제나 정수다. */
export function won(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}
