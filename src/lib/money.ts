import type { Lang } from "./lang";

/** 원 단위 정수를 `12,500원` 으로. 소수는 다루지 않는다 — 금액은 언제나 정수다. */
export function won(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/** 영어 화면의 금액 — `₩12,500`. 같은 원 단위 정수이고 표기만 다르다. */
export function wonEn(amount: number): string {
  return `₩${amount.toLocaleString("en-US")}`;
}

/** 방문자의 언어로 쓴 금액. */
export function money(amount: number, lang: Lang): string {
  return lang === "ko" ? won(amount) : wonEn(amount);
}

/** 100ml·100g 의 값. 나눗셈이라 소수가 생길 수 있고, 금액은 원 단위 정수이므로 내림한다(명세 CON-2). */
function per100(price: number, size: { amount: number }): number {
  return Math.floor((price * 100) / size.amount);
}

/**
 * 단위 가격 — `100ml당 250원`. 같은 종류를 용량이 다른 채로 비교하는 값이다.
 * 나눗셈이라 소수가 생길 수 있고, 금액은 원 단위 정수이므로 내림한다(명세 CON-2).
 */
export function unitPrice(price: number, size: { amount: number; per: "ml" | "g" }): string {
  return `100${size.per}당 ${won(per100(price, size))}`;
}

/** 방문자의 언어로 쓴 단위 가격. 영어는 `₩250 per 100ml` 이다. */
export function unitPriceIn(price: number, size: { amount: number; per: "ml" | "g" }, lang: Lang): string {
  return lang === "ko" ? unitPrice(price, size) : `${wonEn(per100(price, size))} per 100${size.per}`;
}
