"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addLine, CartError, EMPTY_CART, removeLine, setQty } from "@/lib/cart";
import { placeOrder } from "@/lib/orders";
import { mutate, resetState } from "@/lib/store";

function qtyOf(form: FormData): number {
  const raw = form.get("qty");
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number.NaN;
}

function idOf(form: FormData): string {
  const id = form.get("productId");
  return typeof id === "string" ? id : "";
}

/**
 * 규칙이 거절하면 그 문장을 주소에 실어 같은 화면으로 돌아간다.
 * `hash` 는 돌아갈 자리다 — 첫 화면은 배너가 커서, 담을 때마다 맨 위로 올라가면 상품을 다시 찾아 내려와야 한다.
 */
async function run(to: string, fn: () => Promise<void>, hash = ""): Promise<never> {
  const [path, query = ""] = to.split("?");
  const url = (extra: string) => {
    const q = [query, extra].filter(Boolean).join("&");
    return `${path}${q ? `?${q}` : ""}${hash}`;
  };
  try {
    await fn();
  } catch (err) {
    if (err instanceof CartError) {
      redirect(url(`error=${encodeURIComponent(err.message)}`));
    }
    throw err;
  }
  revalidatePath("/", "layout");
  redirect(url(""));
}

/** 거르던 종류를 그대로 둔다. 모르는 값은 버린다 — 주소에 실리는 값이다. */
function catOf(form: FormData): string {
  const cat = form.get("cat");
  return typeof cat === "string" && /^[a-z]+$/.test(cat) ? `?cat=${cat}` : "";
}

export async function addToCartAction(form: FormData) {
  const productId = idOf(form);
  const qty = qtyOf(form);
  await run(
    `/${catOf(form)}`,
    async () => {
      await mutate((s) => ({ state: { ...s, cart: addLine(s.cart, productId, qty, s.stock) }, result: undefined }));
    },
    "#products",
  );
}

export async function changeQtyAction(form: FormData) {
  const productId = idOf(form);
  const qty = qtyOf(form);
  await run("/cart", async () => {
    await mutate((s) => ({ state: { ...s, cart: setQty(s.cart, productId, qty, s.stock) }, result: undefined }));
  });
}

export async function removeFromCartAction(form: FormData) {
  const productId = idOf(form);
  await run("/cart", async () => {
    await mutate((s) => ({ state: { ...s, cart: removeLine(s.cart, productId) }, result: undefined }));
  });
}

export async function placeOrderAction() {
  let orderId = "";
  await run("/cart", async () => {
    orderId = await mutate((s) => {
      const { order, stock } = placeOrder(s.cart, s.stock, { seq: s.nextSeq, now: new Date() });
      return {
        state: { ...s, stock, cart: EMPTY_CART, orders: [order, ...s.orders], nextSeq: s.nextSeq + 1 },
        result: order.id,
      };
    });
    revalidatePath("/", "layout");
    redirect(`/orders/${orderId}`);
  });
}

/** 처음 상태로 — 재고·장바구니·주문을 전부 되돌린다. 데모에서 재고를 다 쓴 사람이 다시 시작하는 길이다. */
export async function resetShopAction() {
  await resetState();
  revalidatePath("/", "layout");
  redirect("/");
}
