# UyooMarket

[한국어](#우유마켓)

A small online ordering app for a neighborhood milk shop: six products, a cart, orders and an order history.
It is the **tutorial project** for [UyooPack](https://uyoopack.com), made so you can see for yourself how a plan becomes
working code. It is small, it really works, you can change it, and you can put it back to the start at any time.

**Demo**: https://uyoopack-tutorial.vercel.app (no repository or account needed)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fuyoolabs%2Fuyoopack-tutorial&project-name=uyoomarket&repository-name=uyoomarket)

The button **copies this repository into your GitHub account and deploys it right away.** After that, every branch and PR
gets a preview address, so you can check a coding agent's change from a link without pulling and running it yourself.

```bash
pnpm install
pnpm dev        # http://localhost:3100
pnpm test       # unit tests for the rules (cart and orders) and the stored state
```

Next.js 16 · React 19 · Tailwind 4. There is no database. Stock, the cart and the 10 most recent orders live in
**one cookie per visitor**, so the app runs without setup whether you clone it or deploy it. The tradeoff is that every
visitor has their own shop, with their own stock. "Start over" at the bottom of the app resets the shop in that browser.

The app speaks English and Korean. A browser that prefers Korean over English sees Korean, and every other browser sees
English. Amounts are whole won in both: `₩3,500` in English and `3,500원` in Korean.

## Where things are

| File | What it does |
|---|---|
| `src/lib/catalog.ts` | The six products: category, description, photo, starting stock, and names in both languages |
| `src/lib/cart.ts` | Cart rules: add, change quantity, remove, and subtotal, shipping and total |
| `src/lib/orders.ts` | Order rules: confirm an order and take it out of stock |
| `src/lib/money.ts` | How amounts are written: `₩12,500` and `12,500원` |
| `src/lib/state.ts` | How the shop's state fits into one cookie |
| `src/lib/store.ts` | Storage (the cookie). This is where a database would go |
| `src/lib/lang.ts` · `src/lib/messages.ts` | Picking the language from the browser, and the English and Korean text |
| `src/app/` | Three screens: products, cart and orders |
| `src/app/globals.css` | Design tokens: colors, type, corners and shadows |
| `src/components/` | Product card, quantity field, totals and icons |
| `public/` | Product photos and the banner |

The rules are pure functions and know nothing about the screens or storage. The tests cover the rules, the stored state
and the text in both languages.

## Design

The screens need to look like a real shop, enough that a first-time customer trusts it and orders. Those rules are in the
UyooPack spec too.

- **Tokens only.** Colors, type, corners and shadows come from `@theme` in `src/app/globals.css`. Screen code has no hex
  colors and no default Tailwind palette classes (`stone-`, `blue-` and so on). That block is the one place to change
  the brand.
- **UyooMarket belongs to the Uyoolabs family.** The mark (a milk carton in a shopping cart) follows the family's logo
  style: a thick navy outline, two tones of sky blue and a milk carton. The name is set in Do Hyeon, the typeface of the
  family logos, and nothing else uses it. Colors, corners, shadows and the pale sky blue background come from the
  Uyoolabs design system. **Only what is needed came over.** There are no glass surfaces, no dark mode and no motion
  system.
- **One accent color, sky blue, and one text typeface, Pretendard.** The product photos already carry color, so more
  colors on screen would compete with them.
- **Status is never shown by color alone.** A sold-out product's photo fades and the words "Sold out" appear with it,
  and a rejection is a sentence. Photos have alt text.
- **Ordering works at 360px wide without horizontal scrolling.**
- **No decoration that does nothing.** There is no search, sign-in or wish list. This shop does not have them.

The product photos and the banner were made with an image model (they are not real products). The artwork and lettering
on the packages were generated with the photos, so **the mark is drawn to resemble the Uyoolabs logo, and it is not the
logo file itself**. Compositing the logo file onto the photos did not match their lighting and paper texture, and it
looked like a sticker. **All four milk cartons come from one photo.** One reference photo stays the same and only the
band color and the lettering change, which keeps the mark and the band at the same height in every photo (making each
one separately gave different results). The tradeoff is that the 500ml carton has the same shape as the 1L one. The
lettering on the package and the card tell the size.

When you add a product, keep four things: the same background and lighting, **cartons at an angle and tubs and bottles
from the front** (a cylinder turned sideways breaks the lettering on its label), printing that follows the angle of the
package face, and **a small mark** (under a fifth of the package width) with the product name as the largest text.

## The UyooPack tutorial

1. **Create the tutorial project in UyooPack.** "Create tutorial project" on your organization home makes a project
   with this app's spec. A few requirements already have completion reports (this code is what they report),
   and two are not in the code yet, so they show up as open tasks. The guide at the top of the spec shows the steps
   below and copies the commands you need.
2. **Make this repository yours and deploy it.** Press "Create your repository and deploy with Vercel" in the guide (the
   same as the button above). If you only need the repository and no deployment, use "Use this template" on this page.
   Clone the new repository to your computer.
3. **Connect Claude Code to UyooPack.** Open `claude` in the repository, run the `claude mcp add …` line the guide
   copies for you, and ask "Install the UyooPack adapter". Claude Code writes the files it needs with `get_setup_plan`.
4. **Hand over a task.** Paste the text the guide copies into Claude Code. It reads the coupon code requirement (and
   relays the `Tell the user` line), builds it and sends a completion report. When the PR is up, **try a coupon yourself
   at the preview address.** Where the spec says it is built changes too.
5. **Add a plan.** Write something like "Show 'Almost gone' on product cards with 3 or fewer left" in the input at the
   bottom of the spec. A planning chat opens, and as you answer, a draft requirement fills in on the spec. Accept it and
   a task is created.
6. **Report a bug.** Add one Greek yogurt (12 in stock) to the cart, then change its quantity to 20 in the cart. The
   cart takes it, and the order is rejected only when you place it. The spec says stock is checked when you add, when
   you change a quantity and when you order. Write "The cart let me set 20 Greek yogurts, but checkout says there are
   only 12" in the input to open the bug flow.
7. **Start over.** For the repository, run `scripts/reset.sh`. For the UyooPack project, use "Recreate tutorial" in its
   settings.

## When you deploy with Vercel

- The free (Hobby) plan is for **personal, non-commercial use**. A repository in a personal GitHub account deploys for
  free.
- **Private repositories owned by a GitHub organization** cannot be deployed on the free plan. To keep it in an
  organization, you need a paid Vercel team.
- On the free plan, **the committer must own the Vercel account** for a deployment to run. Claude Code commits with your
  GitHub identity, so this is not a problem.
- **By default, only you can open preview addresses, while signed in to Vercel** (the production address is public). To
  show a teammate, make a share link with "Share" on the deployment, or turn off "Deployment Protection" in the project
  settings.

## Starting over

```bash
scripts/reset.sh
```

It force-resets `main` to the template's `main`, closes open PRs and deletes every branch other than `main`. Your clone
goes back to `main` too. The data inside the app (stock and orders) lives in the browser, not the repository, so reset it
with "Start over" at the bottom of the app. Reset the UyooPack project with "Recreate tutorial" in its settings. The
address and repository links stay the same, so you do not need to connect the repository again.

## Out of scope

There are no payment, account or product management screens. Orders stop at confirmation, and canceling is not there
yet (that is one of the open tasks).

---

# 우유마켓

[English](#uyoomarket)

동네 우유 가게의 작은 온라인 주문 앱입니다. 상품 여섯 개, 장바구니, 주문, 주문 내역이 전부입니다.
[우유팩](https://uyoopack.com)에서 기획과 개발이 어떻게 이어지는지 직접 해 보기 위한 **튜토리얼용 프로젝트**입니다 —
작지만 진짜 돌아가고, 고쳐도 되고, 언제든 처음으로 되돌릴 수 있습니다.

**데모**: https://uyoopack-tutorial.vercel.app — 저장소도 계정도 없이 바로 눌러 볼 수 있습니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fuyoolabs%2Fuyoopack-tutorial&project-name=uyoomarket&repository-name=uyoomarket)

버튼을 누르면 이 저장소가 **내 GitHub 계정에 복제되고 곧바로 배포됩니다.** 그 뒤로는 브랜치와 PR 마다 미리보기 주소가 붙어서,
코딩 에이전트가 올린 변경을 받아서 띄우지 않고도 링크로 확인할 수 있습니다.

```bash
pnpm install
pnpm dev        # http://localhost:3100
pnpm test       # 규칙(장바구니·주문)과 상태 담기의 단위 테스트
```

Next.js 16 · React 19 · Tailwind 4. 데이터베이스가 없습니다 — 재고·장바구니·최근 주문 10건이 **방문자별 쿠키 한 장**에 담깁니다.
그래서 클론해도, 배포해도 설정 없이 돕니다. 대가는 방문자마다 자기 가게를 갖는다는 것입니다(재고도 따로). 바닥의 `처음 상태로` 가
그 브라우저의 가게를 되돌립니다.

앱은 영어와 한국어로 보입니다. 브라우저가 영어보다 한국어를 앞에 두면 한국어로, 그 밖에는 영어로 보입니다. 금액은 둘 다 원 단위
정수이고 영어는 `₩3,500`, 한국어는 `3,500원` 으로 씁니다.

## 어디에 무엇이 있나

| 파일 | 하는 일 |
|---|---|
| `src/lib/catalog.ts` | 상품 여섯 개 — 종류·설명·사진·처음 재고, 두 언어의 이름 |
| `src/lib/cart.ts` | 장바구니 규칙 — 담기·수량·빼기, 소계·배송비·총액 |
| `src/lib/orders.ts` | 주문 규칙 — 주문 확정과 재고 차감 |
| `src/lib/money.ts` | 금액 표기 — `₩12,500` 과 `12,500원` |
| `src/lib/state.ts` | 가게의 상태를 쿠키 한 장에 담는 법 |
| `src/lib/store.ts` | 저장소(쿠키). 데이터베이스로 바꾸는 자리 |
| `src/lib/lang.ts` · `src/lib/messages.ts` | 브라우저로 언어 고르기, 영어와 한국어 글 |
| `src/app/` | 화면 셋 — 상품 · 장바구니 · 주문 내역 |
| `src/app/globals.css` | 디자인 토큰 — 색·서체·모서리·그림자 |
| `src/components/` | 상품 카드 · 수량 칸 · 합계 · 아이콘 |
| `public/` | 상품 사진과 배너 |

규칙은 순수 함수이고 화면과 저장소를 모릅니다. 테스트는 규칙과 상태 담기, 두 언어의 글에 걸려 있습니다.

## 디자인

화면은 실제 가게처럼 보여야 합니다 — 처음 온 손님이 믿고 주문할 만큼. 그 규칙도 우유팩의 명세에 있습니다.

- **토큰만 씁니다.** 색·서체·모서리·그림자는 `src/app/globals.css` 의 `@theme` 에서 옵니다. 화면 코드에는 hex 색도 Tailwind 기본 팔레트(`stone-`·`blue-` …)도 쓰지 않습니다. 브랜드를 바꾸는 자리는 그 블록 하나입니다.
- **우유마켓은 우유랩스 가족입니다.** 표식(장바구니에 든 우유갑)은 가족 로고의 문법을 따릅니다 — 굵은 남색 외곽선, 하늘색 두 톤, 우유갑. 이름은 가족 로고와 같은 도현체이고 그 네 글자에만 씁니다. 색·모서리·그림자·옅은 하늘빛 배경은 우유랩스의 디자인 시스템에서 가져왔습니다. **필요한 만큼만 옮겼습니다** — 유리 재질·다크 모드·움직임 체계는 없습니다.
- **강조색은 하늘색 하나, 본문 서체는 Pretendard 하나입니다.** 상품 사진이 색을 갖고 있어서 화면의 색이 여럿이면 사진과 다툽니다.
- **상태는 색만으로 말하지 않습니다.** 품절은 사진이 흐려지면서 `품절` 이라는 낱말이 함께 서고, 거절은 문장으로 말합니다. 사진에는 대체 글이 있습니다.
- **360px 폭에서도 가로 스크롤 없이 주문이 끝납니다.**
- **동작하지 않는 장식은 두지 않습니다.** 검색·로그인·찜은 없습니다 — 이 가게에 없는 기능입니다.

상품 사진과 배너는 이미지 모델로 만든 것입니다(실제 상품이 아닙니다). 포장의 그림과 글자도 사진과 함께 생성한 것이라 **표식은 우유랩스 로고를 닮게 그린 것이지 로고 파일 그대로가 아닙니다** — 로고 파일을 사진 위에 합성해 보았더니 조명과 종이 결이 맞지 않아 스티커처럼 떠 보였습니다. **우유갑 넉 장은 한 장에서 나왔습니다** — 기준 사진 하나를 두고 띠 색과 글자만 바꿉니다. 그래야 표식과 띠의 높이가 사진마다 어긋나지 않습니다(각자 만들었더니 제각각이었습니다). 대신 500ml 도 1L 과 같은 갑 모양입니다 — 용량은 포장의 글자와 카드가 말합니다.

새 상품을 더할 때 지킬 것은 넷입니다: 같은 배경과 조명, **우유갑은 비스듬히·통과 병은 정면으로**(원통은 돌리면 라벨의 글자가 깨집니다), 인쇄가 포장 면의 각도를 따라갈 것, **표식은 작게**(포장 너비의 5분의 1 안쪽) 두고 제품명을 가장 크게 둘 것.

## 우유팩 튜토리얼

1. **우유팩에서 튜토리얼 프로젝트를 만듭니다.** 조직 표지의 `튜토리얼 프로젝트 만들기` 를 누르면 이 앱의 명세가 든 프로젝트가 생깁니다.
   요구사항 몇 개는 이미 완료 보고가 있고(이 코드가 그것입니다), 둘은 아직 코드에 없어 열린 작업으로 보입니다.
   문서 머리의 안내가 아래 순서를 그대로 보여 주고, 필요한 명령을 복사해 줍니다.
2. **이 저장소를 내 것으로 만들고 배포합니다.** 안내의 `Vercel 로 내 저장소 만들고 배포하기`(위의 버튼과 같습니다)를 누릅니다.
   배포 없이 저장소만 필요하면 이 페이지의 `Use this template` 을 씁니다. 만든 저장소를 내 컴퓨터로 클론합니다.
3. **Claude Code 를 우유팩에 연결합니다.** 저장소 안에서 `claude` 를 열고, 안내가 복사해 주는 `claude mcp add …` 한 줄을 실행한 뒤
   "우유팩 어댑터를 설치해 줘" 라고 말하면 Claude Code 가 `get_setup_plan` 으로 필요한 파일을 씁니다.
4. **작업을 맡깁니다.** 안내가 복사해 주는 말을 Claude Code 에 붙여 넣으면 `쿠폰 코드` 요구사항을 읽고(`Tell the user` 줄을 옮깁니다),
   구현하고, 완료 보고를 올립니다. PR 이 올라오면 **미리보기 주소에서 쿠폰을 직접 넣어 봅니다.** 문서의 `구현 위치` 도 바뀝니다.
5. **기획을 하나 더합니다.** 문서 바닥의 입력 칸에 "재고가 3개 이하면 상품 카드에 '곧 품절' 을 보여 주고 싶다" 처럼 쓰면 기획 대화가
   열리고, 답해 가면 요구사항 초안이 문서에 찹니다. 확정하면 작업이 생깁니다.
6. **버그를 신고합니다.** 그릭 요거트(재고 12개)를 하나 담은 뒤 장바구니에서 수량을 20으로 바꿔 보세요. 장바구니는 받아 주고
   주문할 때서야 거절됩니다. 명세는 담을 때·수량을 바꿀 때·주문할 때 세 번 모두 재고를 확인한다고 말합니다.
   입력 칸에 "장바구니에는 그릭 요거트 20개가 담겼는데 주문하니 12개뿐이래요" 라고 쓰면 버그 흐름이 열립니다.
7. **처음으로 되돌립니다.** 저장소는 `scripts/reset.sh`, 우유팩 프로젝트는 설정의 `튜토리얼 다시 만들기` 입니다.

## Vercel 로 배포할 때 알아 둘 것

- 무료(Hobby) 플랜은 **개인용·비상업용**입니다. 개인 GitHub 계정의 저장소면 무료로 됩니다.
- **GitHub 조직 소유의 비공개 저장소**는 무료 플랜으로 배포할 수 없습니다. 조직에 두려면 Vercel 유료 팀이 필요합니다.
- 무료 플랜에서는 **커밋한 사람이 그 Vercel 계정의 주인**이어야 배포됩니다. Claude Code 는 내 GitHub 신원으로 커밋하므로 걸리지 않습니다.
- **미리보기 주소는 기본적으로 Vercel 에 로그인한 본인만** 열립니다(운영 주소는 공개). 동료에게 보이려면 배포 화면의 `Share` 로
  공유 링크를 만들거나, 프로젝트 설정의 `Deployment Protection` 을 끕니다.

## 되돌리기

```bash
scripts/reset.sh
```

템플릿의 `main` 으로 강제로 맞추고, 열린 PR 을 닫고, `main` 밖의 브랜치를 전부 지웁니다. 이 클론도 `main` 으로 돌아갑니다.
앱 안의 데이터(재고·주문)는 저장소가 아니라 브라우저에 있으므로 앱 바닥의 `처음 상태로` 로 되돌립니다. 우유팩 프로젝트는 설정의
`튜토리얼 다시 만들기` 로 되돌리고, 다시 만들어도 주소와 저장소 연결이 그대로라 저장소를 다시 붙이지 않아도 됩니다.

## 범위 밖

결제·회원·상품 관리 화면은 없습니다. 주문은 확정까지만이고 취소는 아직 없습니다(그것이 열린 작업 중 하나입니다).
