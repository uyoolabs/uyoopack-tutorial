import { cookies } from "next/headers";
import { decodeState, encodeState, type State } from "./state";

/**
 * 저장소. **방문자별 쿠키 한 장**이 전부다 — 가게의 재고, 장바구니, 최근 주문.
 *
 * 파일도 데이터베이스도 쓰지 않는 이유는 이 앱이 두 곳에서 설정 없이 돌아야 하기 때문이다: 클론해서 `pnpm dev`,
 * 그리고 서버리스 배포(파일 시스템에 쓸 수 없다). 대가는 방문자마다 자기 가게를 갖는다는 것이다 — 재고도 따로다.
 * 진짜 가게처럼 재고를 함께 보려면 이 파일만 데이터베이스로 바꾸면 된다. 규칙(`cart.ts`·`orders.ts`)과
 * 담는 법(`state.ts`)은 저장소를 모른다.
 */
const COOKIE = "um_state";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** 읽기. 서버 컴포넌트에서도 된다. */
export async function readState(): Promise<State> {
  return decodeState((await cookies()).get(COOKIE)?.value);
}

/** 읽고 → 바꾸고 → 쓴다. **Server Action 에서만** 부른다 — 쿠키는 렌더 중에 쓸 수 없다. */
export async function mutate<T>(fn: (state: State) => { state: State; result: T }): Promise<T> {
  const jar = await cookies();
  const { state, result } = fn(decodeState(jar.get(COOKIE)?.value));
  jar.set(COOKIE, encodeState(state), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
    // 배포된 곳은 https 다. 로컬 http 에서는 Secure 쿠키를 받지 않는 브라우저가 있다.
    secure: Boolean(process.env.VERCEL),
  });
  return result;
}

/** 처음 상태로. 쿠키를 지우면 다음 읽기가 처음 재고로 시작한다. */
export async function resetState(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
