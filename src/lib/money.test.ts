import { describe, expect, it } from "vitest";
import { money, unitPrice, unitPriceIn, won } from "./money";

describe("금액", () => {
  it("천 단위 구분과 원을 붙인다", () => {
    expect(won(12500)).toBe("12,500원");
  });

  it("단위 가격은 100ml·100g 기준이고 원 단위로 내림한다", () => {
    expect(unitPrice(2500, { amount: 1000, per: "ml" })).toBe("100ml당 250원");
    expect(unitPrice(3900, { amount: 200, per: "g" })).toBe("100g당 1,950원");
    expect(unitPrice(1000, { amount: 300, per: "g" })).toBe("100g당 333원");
  });
});

describe("영어 화면의 금액", () => {
  it("₩ 를 앞에 붙이고 천 단위를 쉼표로 나눈다", () => {
    expect(money(12500, "en")).toBe("₩12,500");
    expect(money(30000, "en")).toBe("₩30,000");
    expect(money(12500, "ko")).toBe(won(12500));
  });

  it("단위 가격은 같은 값을 내림해 영어로 쓴다", () => {
    expect(unitPriceIn(2500, { amount: 1000, per: "ml" }, "en")).toBe("₩250 per 100ml");
    expect(unitPriceIn(1000, { amount: 300, per: "g" }, "en")).toBe("₩333 per 100g");
    expect(unitPriceIn(3900, { amount: 200, per: "g" }, "ko")).toBe(unitPrice(3900, { amount: 200, per: "g" }));
  });
});
