import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { type Cart, EMPTY_CART, type Stock } from "./cart";
import { initialStock } from "./catalog";
import type { Order } from "./orders";

/**
 * 저장소. `data/store.json` 파일 하나가 전부다 — 가게 하나, 장바구니 하나, 주문 목록.
 * 데이터베이스로 바꾸고 싶으면 이 파일만 바꾸면 된다. 규칙(`cart.ts`·`orders.ts`)은 저장소를 모른다.
 */
export type State = {
  stock: Stock;
  cart: Cart;
  orders: Order[];
  nextSeq: number;
};

const FILE = path.join(process.cwd(), "data", "store.json");

function freshState(): State {
  return { stock: initialStock(), cart: EMPTY_CART, orders: [], nextSeq: 1 };
}

export async function readState(): Promise<State> {
  try {
    const raw = await readFile(FILE, "utf8");
    return JSON.parse(raw) as State;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return freshState();
    throw err;
  }
}

async function writeState(state: State): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(state, null, 2), "utf8");
  await rename(tmp, FILE);
}

let chain: Promise<unknown> = Promise.resolve();

/** 읽고 → 바꾸고 → 쓴다. 같은 프로세스 안에서는 한 번에 하나씩만 지나간다. */
export function mutate<T>(fn: (state: State) => { state: State; result: T }): Promise<T> {
  const run = chain.then(async () => {
    const before = await readState();
    const { state, result } = fn(before);
    await writeState(state);
    return result;
  });
  chain = run.catch(() => undefined);
  return run;
}
