import { headers } from "next/headers";
import { type Lang, pickLang } from "./lang";

/** 이 요청의 언어. 서버 컴포넌트와 Server Action 에서 부른다 — 브라우저의 `Accept-Language` 를 읽는다. */
export async function lang(): Promise<Lang> {
  return pickLang((await headers()).get("accept-language"));
}
