import Image from "next/image";
import { productById } from "@/lib/catalog";

/** 장바구니·주문 줄의 작은 사진. 카탈로그에서 빠진 상품이면 빈 면만 남긴다(지난 주문은 그대로 읽혀야 한다).
 * 이름이 바로 옆에 있으므로 대체 글은 비운다 — 같은 말을 두 번 읽히지 않는다. */
export function Thumb({ productId }: { productId: string }) {
  const p = productById(productId);
  return (
    <span className="relative block size-16 shrink-0 overflow-hidden rounded-control bg-photo sm:size-20">
      {p ? <Image src={p.image} alt="" fill sizes="80px" className="object-cover" /> : null}
    </span>
  );
}
