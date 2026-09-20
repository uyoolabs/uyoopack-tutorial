import { describe, expect, it } from "vitest";
import { unitPrice, won } from "./money";

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
