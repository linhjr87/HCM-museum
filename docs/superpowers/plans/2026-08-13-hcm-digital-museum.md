# Hồ Chí Minh Digital Museum — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng website bảo tàng số gồm sảnh cuộn và 4 phòng trưng bày tương tác về Tư tưởng Hồ Chí Minh, deploy công khai trên Vercel trong 6 ngày.

**Architecture:** SPA tĩnh. Sảnh là trang cuộn, mỗi phòng là một route riêng để thao tác trong phòng không tranh chấp với cuộn trang. Nội dung nằm hoàn toàn trong các file dữ liệu TypeScript, component phòng chỉ là bộ hiển thị — sửa câu chữ không đụng code layout. Logic thuần (điều hướng bước, tính điểm đoàn kết, toán toạ độ cung tròn) tách khỏi component để test được bằng Vitest.

**Tech Stack:** Vite 5, React 18, TypeScript 5 (strict), React Router 6, Framer Motion 11, `@dnd-kit/core` 6, Vitest + @testing-library/react, CSS thuần với custom properties. Không Three.js, không Tailwind, không backend.

**Spec:** `docs/superpowers/specs/2026-08-13-hcm-digital-museum-design.md`

## Global Constraints

- TypeScript `strict: true`. `tsc --noEmit` phải sạch trước mọi lần commit kết thúc task.
- Không dùng ảnh chụp thật. Mọi hình ảnh là SVG viết tay hoặc typography.
- Không Three.js, không WebGL, không thư viện bản đồ, không GeoJSON, không backend, không localStorage.
- Bảng màu chỉ dùng token trong `src/styles/tokens.css`. Không viết mã màu trực tiếp trong component.
- Token màu, giá trị nguyên văn từ spec: `--ink: #0E0D0B`, `--ink-soft: #1A1815`, `--paper: #EDE6D8`, `--paper-dim: #A8A092`, `--accent: #B3271E`, `--accent-soft: #C9A227`, `--line: rgba(237,230,216,.14)`.
- Font: tiêu đề `Playfair Display`, thân bài `Be Vietnam Pro`, nạp qua Google Fonts với `display=swap`.
- Chuyển động phản hồi thao tác (hover, nghiêng thẻ, đổi panel, chuyển mốc): 250–400ms, ease-out, không bounce, xoay tối đa 8 độ.
- Chuyển động nền lặp vô hạn là ngoại lệ có trần riêng: 2–10 giây mỗi chu kỳ, biên độ nhỏ. Chỉ gồm mũi tên gợi ý cuộn ở sảnh và chấm sáng vòng tuần hoàn ở phòng 3.
- Mọi animation, cả hai nhóm, phải tắt khi `prefers-reduced-motion: reduce`.
- Mọi mục nội dung bắt buộc có trường `source` trỏ về chương và session. `source` **không hiển thị trên giao diện**.
- Ngôn ngữ giao diện: chỉ tiếng Việt.
- Route: `/`, `/phong-1`, `/phong-2`, `/phong-3`, `/phong-4`, `*`.
- Mọi tương tác phải dùng được bằng chuột, ngón tay, và bàn phím.

---

### Task 1: Dựng khung dự án và deploy bản rỗng

Đây là task quan trọng nhất về mặt rủi ro: nó đẩy mọi bất ngờ về cấu hình và deploy về ngày đầu tiên.

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `vercel.json`
- Create: `src/main.tsx`, `src/App.tsx`, `src/styles/tokens.css`, `src/styles/base.css`
- Create: `src/vite-env.d.ts`

**Interfaces:**
- Consumes: không.
- Produces: `src/styles/tokens.css` định nghĩa toàn bộ CSS custom property mà mọi task sau dùng. `App` là component gốc, task 4 thay bằng router.

- [ ] **Step 1: Khởi tạo dự án Vite**

Chạy trong `E:\01-STUDY\AI-FPT\9.HCM202\HCM-museum`:

```bash
npm create vite@latest . -- --template react-ts
```

Nếu công cụ hỏi vì thư mục không rỗng, chọn giữ lại các file hiện có (`.git`, `.gitignore`, `docs/`).

- [ ] **Step 2: Cài phụ thuộc**

```bash
npm install react-router-dom framer-motion @dnd-kit/core
```

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom adm-zip
```

- [ ] **Step 3: Bật strict mode và cấu hình test**

Trong `tsconfig.json`, phần `compilerOptions` phải có:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

Thay toàn bộ `vite.config.ts`:

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

Thêm script vào `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 4: Viết token màu và nền**

Tạo `src/styles/tokens.css`:

```css
:root {
  --ink: #0E0D0B;
  --ink-soft: #1A1815;
  --paper: #EDE6D8;
  --paper-dim: #A8A092;
  --accent: #B3271E;
  --accent-soft: #C9A227;
  --line: rgba(237, 230, 216, .14);

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Be Vietnam Pro', system-ui, sans-serif;

  --dur-fast: 250ms;
  --dur-slow: 400ms;
  --ease: cubic-bezier(.22, .61, .36, 1);

  --space: clamp(1rem, 4vw, 3rem);
  --measure: 62ch;
}
```

Tạo `src/styles/base.css`:

```css
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-body);
  font-size: clamp(1rem, .4vw + .95rem, 1.125rem);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -.02em;
  line-height: 1.1;
  margin: 0;
}

a { color: inherit; }

:focus-visible {
  outline: 2px solid var(--accent-soft);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

- [ ] **Step 5: Nạp font và đặt tiêu đề trang**

Thay `index.html`:

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hồ Chí Minh Digital Museum</title>
    <meta name="description" content="Bảo tàng số tương tác về Tư tưởng Hồ Chí Minh" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Be+Vietnam+Pro:wght@400;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Viết App tạm và main**

Thay `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/base.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Thay `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main style={{ padding: 'var(--space)' }}>
      <h1>Hồ Chí Minh Digital Museum</h1>
      <p style={{ color: 'var(--paper-dim)' }}>Đang xây dựng.</p>
    </main>
  );
}
```

Xoá `src/App.css` và `src/index.css` nếu template Vite sinh ra.

- [ ] **Step 7: Cấu hình Vercel cho SPA**

Tạo `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Không có file này, refresh tại `/phong-2` trên production sẽ ra 404.

- [ ] **Step 8: Kiểm tra build cục bộ**

```bash
npm run build
```

Kỳ vọng: `tsc --noEmit` sạch, `vite build` sinh thư mục `dist/`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: dựng khung Vite + React + TS, token màu, cấu hình Vercel"
git push
```

- [ ] **Step 10: Deploy bản rỗng lên Vercel** *(bước thủ công, người dùng thực hiện)*

Vào https://vercel.com/new, import kho `linhjr87/HCM-museum`, framework preset chọn **Vite**, build command `npm run build`, output directory `dist`. Bấm Deploy.

Kỳ vọng: link production mở ra thấy dòng chữ "Hồ Chí Minh Digital Museum / Đang xây dựng." Ghi lại link để dùng khi nộp bài.

---

### Task 2: Hook điều hướng bước `useStepIndex`

Logic dùng chung cho timeline phòng 1 và bản đồ phòng 2. Đây là logic thuần nên viết test trước.

**Files:**
- Create: `src/hooks/useStepIndex.ts`
- Test: `src/hooks/useStepIndex.test.ts`

**Interfaces:**
- Consumes: không.
- Produces:

```ts
export type StepIndex = {
  index: number;              // bước đang chọn, 0-based
  visited: number[];          // các bước đã xem, tăng dần, không trùng
  allVisited: boolean;        // đã xem đủ total bước chưa
  go: (next: number) => void; // nhảy tới bước, tự chặn biên
  next: () => void;
  prev: () => void;
};
export function useStepIndex(total: number): StepIndex;
```

- [ ] **Step 1: Viết test thất bại**

Tạo `src/hooks/useStepIndex.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useStepIndex } from './useStepIndex';

describe('useStepIndex', () => {
  it('bắt đầu ở bước 0 và đã xem bước 0', () => {
    const { result } = renderHook(() => useStepIndex(6));
    expect(result.current.index).toBe(0);
    expect(result.current.visited).toEqual([0]);
    expect(result.current.allVisited).toBe(false);
  });

  it('chặn biên ở bước đầu, không quay vòng', () => {
    const { result } = renderHook(() => useStepIndex(6));
    act(() => result.current.prev());
    expect(result.current.index).toBe(0);
  });

  it('chặn biên ở bước cuối, không quay vòng', () => {
    const { result } = renderHook(() => useStepIndex(3));
    act(() => result.current.go(2));
    act(() => result.current.next());
    expect(result.current.index).toBe(2);
  });

  it('go() kẹp giá trị ngoài khoảng về trong khoảng', () => {
    const { result } = renderHook(() => useStepIndex(3));
    act(() => result.current.go(99));
    expect(result.current.index).toBe(2);
    act(() => result.current.go(-5));
    expect(result.current.index).toBe(0);
  });

  it('visited cộng dồn, không trùng, và tăng dần', () => {
    const { result } = renderHook(() => useStepIndex(4));
    act(() => result.current.go(2));
    act(() => result.current.go(1));
    act(() => result.current.go(2));
    expect(result.current.visited).toEqual([0, 1, 2]);
  });

  it('allVisited bật khi đã xem đủ mọi bước', () => {
    const { result } = renderHook(() => useStepIndex(3));
    act(() => result.current.go(1));
    act(() => result.current.go(2));
    expect(result.current.allVisited).toBe(true);
  });
});
```

- [ ] **Step 2: Chạy test để chắc chắn nó thất bại**

```bash
npx vitest run src/hooks/useStepIndex.test.ts
```

Kỳ vọng: FAIL với lỗi không tìm thấy module `./useStepIndex`.

- [ ] **Step 3: Viết cài đặt tối thiểu**

Tạo `src/hooks/useStepIndex.ts`:

```ts
import { useCallback, useMemo, useState } from 'react';

export type StepIndex = {
  index: number;
  visited: number[];
  allVisited: boolean;
  go: (next: number) => void;
  next: () => void;
  prev: () => void;
};

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);
const remember = (list: number[], target: number) =>
  list.includes(target) ? list : [...list, target].sort((a, b) => a - b);

export function useStepIndex(total: number): StepIndex {
  const last = Math.max(total - 1, 0);
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);

  const go = useCallback(
    (next: number) => {
      const target = clamp(next, last);
      setIndex(target);
      setVisited((list) => remember(list, target));
    },
    [last],
  );

  const shift = useCallback(
    (delta: number) => {
      setIndex((current) => {
        const target = clamp(current + delta, last);
        setVisited((list) => remember(list, target));
        return target;
      });
    },
    [last],
  );

  const next = useCallback(() => shift(1), [shift]);
  const prev = useCallback(() => shift(-1), [shift]);

  const allVisited = useMemo(() => visited.length >= total, [visited, total]);

  return { index, visited, allVisited, go, next, prev };
}
```

- [ ] **Step 4: Chạy test để chắc chắn nó qua**

```bash
npx vitest run src/hooks/useStepIndex.test.ts
```

Kỳ vọng: PASS, 6 test.

- [ ] **Step 5: Commit**

```bash
git add src/hooks
git commit -m "feat: hook useStepIndex chặn biên và ghi nhớ bước đã xem"
```

---

### Task 3: Kiểu dữ liệu, script trích slides, và 5 file nội dung

**Files:**
- Create: `src/content/types.ts`, `src/content/hall.ts`, `src/content/room1.ts`, `src/content/room2.ts`, `src/content/room3.ts`, `src/content/room4.ts`
- Create: `scripts/extract-slides.mjs`

**Interfaces:**
- Consumes: không.
- Produces: các kiểu `RoomMeta`, `Milestone`, `MapStop`, `PeopleFacet`, `UnityGroup`, và các mảng dữ liệu `rooms`, `hallIntro`, `milestones`, `stops`, `closingQuote`, `facets`, `cycle`, `cycleNote`, `groups`, `completionQuote` mà task 5–9 nhập vào.

- [ ] **Step 1: Viết script trích chữ từ PPTX**

Tạo `scripts/extract-slides.mjs`:

```js
// Trích chữ từ các file PPTX của môn học ra markdown thô.
// Chạy tay khi cần đối chiếu nội dung: node scripts/extract-slides.mjs
import AdmZip from 'adm-zip';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SLIDES_DIR = 'E:/01-STUDY/AI-FPT/9.HCM202/slides';
const OUT_DIR = 'docs/content-raw';

const CHAPTERS = {
  'chuong-2': [4, 5, 6],
  'chuong-3': [7, 8, 9, 10, 11, 12],
  'chuong-4': [13, 14, 15, 16, 17],
  'chuong-5': [19, 20, 21, 22, 23, 24],
};

function readDeck(sessionNumber) {
  const zip = new AdmZip(join(SLIDES_DIR, `Session ${sessionNumber}.pptx`));
  const slides = zip
    .getEntries()
    .filter((entry) => /^ppt\/slides\/slide\d+\.xml$/.test(entry.entryName))
    .sort(
      (a, b) =>
        Number(a.entryName.match(/\d+/)[0]) - Number(b.entryName.match(/\d+/)[0]),
    );

  return slides.map((entry, i) => {
    const xml = entry.getData().toString('utf8');
    const text = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)]
      .map((match) => match[1])
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    return `### Session ${sessionNumber} — slide ${i + 1}\n\n${text}\n`;
  });
}

mkdirSync(OUT_DIR, { recursive: true });

for (const [chapter, sessions] of Object.entries(CHAPTERS)) {
  const body = sessions.flatMap(readDeck).join('\n');
  writeFileSync(join(OUT_DIR, `${chapter}.md`), `# ${chapter}\n\n${body}`, 'utf8');
  console.log(`đã ghi ${OUT_DIR}/${chapter}.md`);
}
```

- [ ] **Step 2: Chạy script và kiểm tra đầu ra**

```bash
node scripts/extract-slides.mjs
```

Kỳ vọng: in ra 4 dòng "đã ghi", sinh `docs/content-raw/chuong-2.md` đến `chuong-5.md`. Mở `chuong-2.md` và xác nhận thấy chữ tiếng Việt có dấu đúng, không phải ký tự lỗi. Thư mục này đã nằm trong `.gitignore` nên không commit.

- [ ] **Step 3: Viết kiểu dữ liệu**

Tạo `src/content/types.ts`:

```ts
export type RoomMeta = {
  number: '01' | '02' | '03' | '04';
  path: string;
  title: string;
  tagline: string;
};

export type Milestone = {
  year: string;
  place: string;
  event: string;
  meaning: string;
  source: string;
};

export type MapStop = {
  id: string;
  label: string;
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
  event: string;
  link: string;
  source: string;
};

export type PeopleFacet = {
  id: 'cua-dan' | 'do-dan' | 'vi-dan';
  title: string;
  short: string;
  detail: string;
  source: string;
};

export type UnityGroup = {
  id: string;
  name: string;
  message: string;
  source: string;
};
```

`labelDx` và `labelDy` là phần mở rộng so với spec: nhãn của Pác Bó và Quảng Châu nằm rất gần nhau trên bản đồ nên cần dịch thủ công để chữ không chồng lên nhau.

- [ ] **Step 4: Viết nội dung sảnh và danh mục phòng**

Tạo `src/content/hall.ts`:

```ts
import type { RoomMeta } from './types';

export const hallIntro = {
  title: 'HỒ CHÍ MINH DIGITAL MUSEUM',
  subtitle: 'Hành trình khám phá Tư tưởng Hồ Chí Minh',
  lead:
    'Tư tưởng Hồ Chí Minh là hệ thống quan điểm toàn diện và sâu sắc về những vấn đề cơ bản của cách mạng Việt Nam, kết quả của sự vận dụng và phát triển sáng tạo chủ nghĩa Mác – Lênin vào điều kiện cụ thể của nước ta. Bốn phòng dưới đây lần lượt kể lại: tư tưởng ấy hình thành thế nào, độc lập – tự do nghĩa là gì, nhà nước thuộc về ai, và sức mạnh dân tộc đến từ đâu.',
  source: 'Chương 1 — Session 2, 3',
};

export const rooms: RoomMeta[] = [
  {
    number: '01',
    path: '/phong-1',
    title: 'Hành trình hình thành tư tưởng',
    tagline: 'Từ làng Sen đến Pác Bó, một con đường được tìm thấy.',
  },
  {
    number: '02',
    path: '/phong-2',
    title: 'Độc lập – Tự do',
    tagline: 'Quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc.',
  },
  {
    number: '03',
    path: '/phong-3',
    title: 'Dân là gốc',
    tagline: 'Nhà nước của nhân dân, do nhân dân, vì nhân dân.',
  },
  {
    number: '04',
    path: '/phong-4',
    title: 'Đại đoàn kết',
    tagline: 'Đoàn kết là một chiến lược, không phải một khẩu hiệu.',
  },
];
```

- [ ] **Step 5: Viết nội dung phòng 1**

Tạo `src/content/room1.ts`:

```ts
import type { Milestone } from './types';

export const milestones: Milestone[] = [
  {
    year: '1890',
    place: 'Làng Sen, Nam Đàn, Nghệ An',
    event:
      'Nguyễn Sinh Cung sinh ra trong một gia đình nhà nho yêu nước, giữa vùng đất giàu truyền thống khoa bảng và đấu tranh.',
    meaning:
      'Giai đoạn trước năm 1911 hình thành nền tảng nhân cách và lòng yêu nước — cơ sở đầu tiên của tư tưởng Hồ Chí Minh.',
    source: 'Chương 2 — Session 4',
  },
  {
    year: '1911',
    place: 'Bến Nhà Rồng, Sài Gòn',
    event:
      'Ngày 5-6-1911, người thanh niên Nguyễn Tất Thành rời Tổ quốc trên con tàu Amiral Latouche-Tréville, bắt đầu hành trình tìm đường cứu nước.',
    meaning:
      'Chọn hướng đi khác các bậc tiền bối: sang phương Tây để xem chính nơi sinh ra khẩu hiệu tự do, bình đẳng, bác ái đang làm gì.',
    source: 'Chương 2 — Session 4',
  },
  {
    year: '1920',
    place: 'Paris, Pháp',
    event:
      'Đọc Sơ thảo lần thứ nhất Luận cương về vấn đề dân tộc và thuộc địa của Lênin; bỏ phiếu tán thành Quốc tế III và tham gia sáng lập Đảng Cộng sản Pháp.',
    meaning:
      'Bước ngoặt quyết định: tìm thấy con đường giải phóng dân tộc theo cách mạng vô sản, chuyển từ chủ nghĩa yêu nước sang chủ nghĩa Mác – Lênin.',
    source: 'Chương 2 — Session 5',
  },
  {
    year: '1930',
    place: 'Hương Cảng',
    event:
      'Chủ trì Hội nghị hợp nhất các tổ chức cộng sản, thành lập Đảng Cộng sản Việt Nam và thông qua Cương lĩnh chính trị đầu tiên.',
    meaning:
      'Tư tưởng Hồ Chí Minh về con đường cách mạng Việt Nam đã hình thành về cơ bản và trở thành đường lối của một chính đảng.',
    source: 'Chương 2 — Session 5',
  },
  {
    year: '1941',
    place: 'Pác Bó, Cao Bằng',
    event:
      'Sau 30 năm, Người về nước, chủ trì Hội nghị Trung ương lần thứ tám, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và lập Mặt trận Việt Minh.',
    meaning:
      'Tư tưởng được kiểm nghiệm và bổ sung bằng thực tiễn, trực tiếp dẫn tới thắng lợi Cách mạng Tháng Tám năm 1945.',
    source: 'Chương 2 — Session 6',
  },
  {
    year: '1969',
    place: 'Hà Nội',
    event:
      'Người để lại bản Di chúc, căn dặn về đoàn kết trong Đảng, về chăm lo đời sống nhân dân và về sự nghiệp kháng chiến còn dang dở.',
    meaning:
      'Tư tưởng Hồ Chí Minh tiếp tục soi đường cho cách mạng Việt Nam sau khi Người đi xa.',
    source: 'Chương 2 — Session 6',
  },
];
```

- [ ] **Step 6: Viết nội dung phòng 2**

Tạo `src/content/room2.ts`:

```ts
import type { MapStop } from './types';

// Toạ độ theo phép chiếu equirectangular trong viewBox 1000 x 500:
// x = (kinh độ + 180) / 360 * 1000, y = (90 - vĩ độ) / 180 * 500
export const stops: MapStop[] = [
  {
    id: 'ben-nha-rong',
    label: 'Bến Nhà Rồng',
    x: 794,
    y: 222,
    labelDx: 0,
    labelDy: 34,
    event:
      'Năm 1911, Nguyễn Tất Thành xuống tàu rời Sài Gòn với hai bàn tay trắng và một câu hỏi: vì sao dân tộc mình mất nước.',
    link:
      'Điểm khởi đầu đặt ra vấn đề trung tâm của cả hệ tư tưởng: độc lập dân tộc phải giành lại bằng con đường nào.',
    source: 'Chương 3 — Session 7',
  },
  {
    id: 'paris',
    label: 'Paris',
    x: 505,
    y: 117,
    labelDx: -14,
    labelDy: -18,
    event:
      'Năm 1919, thay mặt những người Việt Nam yêu nước, Người gửi Bản yêu sách của nhân dân An Nam tới Hội nghị Versailles. Năm 1920, Người đến với chủ nghĩa Lênin.',
    link:
      'Độc lập dân tộc trước hết là quyền tự quyết, phải được nêu thành yêu sách chính trị công khai trước thế giới.',
    source: 'Chương 3 — Session 8',
  },
  {
    id: 'moscow',
    label: 'Moscow',
    x: 603,
    y: 97,
    labelDx: 14,
    labelDy: -18,
    event:
      'Những năm 1923–1924, Người hoạt động trong Quốc tế Cộng sản, nghiên cứu lý luận và kinh nghiệm cách mạng vô sản.',
    link:
      'Độc lập dân tộc gắn liền với chủ nghĩa xã hội: giành được nước rồi còn phải giữ nước và làm cho dân được ấm no.',
    source: 'Chương 3 — Session 9',
  },
  {
    id: 'quang-chau',
    label: 'Quảng Châu',
    x: 828,
    y: 176,
    labelDx: 18,
    labelDy: -14,
    event:
      'Năm 1925, Người sáng lập Hội Việt Nam Cách mạng Thanh niên, mở lớp huấn luyện chính trị và biên soạn tác phẩm Đường Kách mệnh.',
    link:
      'Muốn giành độc lập phải có tổ chức và phải có lý luận dẫn đường — độc lập không đến từ lòng yêu nước đơn thuần.',
    source: 'Chương 3 — Session 10',
  },
  {
    id: 'pac-bo',
    label: 'Pác Bó — Hà Nội',
    x: 786,
    y: 192,
    labelDx: -22,
    labelDy: 30,
    event:
      'Năm 1941 Người về nước và lập Mặt trận Việt Minh. Ngày 2-9-1945, tại Quảng trường Ba Đình, Người đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hoà.',
    link:
      'Tư tưởng độc lập – tự do trở thành hiện thực nhà nước, và được khẳng định là quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc.',
    source: 'Chương 3 — Session 11, 12',
  },
];

export const closingQuote = 'Không có gì quý hơn độc lập, tự do.';
```

- [ ] **Step 7: Viết nội dung phòng 3**

Tạo `src/content/room3.ts`:

```ts
import type { PeopleFacet } from './types';

export const facets: PeopleFacet[] = [
  {
    id: 'cua-dan',
    title: 'CỦA DÂN',
    short: 'Nhân dân là chủ thể của mọi quyền lực.',
    detail:
      'Mọi quyền lực trong nhà nước đều thuộc về nhân dân. Nhân dân là người chủ, cán bộ nhà nước là công bộc của dân chứ không phải quan cách mạng. Nhân dân có quyền kiểm soát, phê bình và bãi miễn những đại biểu không còn xứng đáng.',
    source: 'Chương 4 — Session 14',
  },
  {
    id: 'do-dan',
    title: 'DO DÂN',
    short: 'Nhà nước do nhân dân xây dựng, lựa chọn và tham gia.',
    detail:
      'Nhà nước do nhân dân lập nên thông qua tổng tuyển cử phổ thông đầu phiếu, do nhân dân ủng hộ và đóng góp mà tồn tại. Dân bầu ra chính quyền thì dân cũng có trách nhiệm tham gia quản lý, giám sát và giúp chính quyền làm tròn nhiệm vụ.',
    source: 'Chương 4 — Session 15',
  },
  {
    id: 'vi-dan',
    title: 'VÌ DÂN',
    short: 'Nhà nước phục vụ lợi ích và hạnh phúc của nhân dân.',
    detail:
      'Nhà nước không có mục đích tự thân. Việc gì có lợi cho dân thì hết sức làm, việc gì có hại cho dân thì hết sức tránh. Thước đo duy nhất của một nhà nước là đời sống của người dân có được cải thiện hay không.',
    source: 'Chương 4 — Session 16',
  },
];

export const cycle = [
  { id: 'nhan-dan', label: 'Nhân dân' },
  { id: 'nha-nuoc', label: 'Nhà nước' },
  { id: 'chinh-sach', label: 'Chính sách' },
];

export const cycleNote =
  'Nhân dân lập ra nhà nước, nhà nước ban hành chính sách, chính sách phục vụ nhân dân — một vòng khép kín, không phải ba ô kiến thức rời rạc.';
```

- [ ] **Step 8: Viết nội dung phòng 4**

Tạo `src/content/room4.ts`:

```ts
import type { UnityGroup } from './types';

export const groups: UnityGroup[] = [
  {
    id: 'cong-nhan',
    name: 'Công nhân',
    message: 'Giai cấp công nhân là lực lượng lãnh đạo cách mạng thông qua đội tiên phong của mình.',
    source: 'Chương 5 — Session 19',
  },
  {
    id: 'nong-dan',
    name: 'Nông dân',
    message: 'Công nông là gốc của cách mạng, là lực lượng đông đảo và bền bỉ nhất.',
    source: 'Chương 5 — Session 19',
  },
  {
    id: 'tri-thuc',
    name: 'Trí thức',
    message: 'Trí thức là vốn quý của dân tộc, cần được trọng dụng trong sự nghiệp kiến quốc.',
    source: 'Chương 5 — Session 20',
  },
  {
    id: 'thanh-nien',
    name: 'Thanh niên',
    message: 'Nước nhà thịnh hay suy, yếu hay mạnh, một phần lớn là do thanh niên.',
    source: 'Chương 5 — Session 20',
  },
  {
    id: 'phu-nu',
    name: 'Phụ nữ',
    message: 'Nói phụ nữ là nói phân nửa xã hội; giải phóng phụ nữ là một phần của giải phóng dân tộc.',
    source: 'Chương 5 — Session 21',
  },
  {
    id: 'cac-dan-toc',
    name: 'Các dân tộc',
    message: 'Các dân tộc anh em đều là con một nhà, bình đẳng và giúp nhau cùng tiến bộ.',
    source: 'Chương 5 — Session 21',
  },
  {
    id: 'ton-giao',
    name: 'Các tôn giáo',
    message: 'Tín ngưỡng tự do và lương giáo đoàn kết, lấy lợi ích chung của dân tộc làm điểm quy tụ.',
    source: 'Chương 5 — Session 22',
  },
  {
    id: 'kieu-bao',
    name: 'Kiều bào',
    message: 'Đồng bào ở nước ngoài là bộ phận không tách rời của cộng đồng dân tộc Việt Nam.',
    source: 'Chương 5 — Session 23',
  },
];

export const completionQuote =
  'Đoàn kết, đoàn kết, đại đoàn kết — Thành công, thành công, đại thành công.';
```

- [ ] **Step 9: Đối chiếu nội dung với bản trích thô**

Mở `docs/content-raw/chuong-2.md` đến `chuong-5.md`, đọc lướt và xác nhận các mốc, sự kiện, luận điểm trong 5 file content không mâu thuẫn với slide môn học. Sửa ngay nếu lệch.

- [ ] **Step 10: Kiểm tra kiểu và commit**

```bash
npm run typecheck
```

Kỳ vọng: sạch.

```bash
git add src/content scripts
git commit -m "feat: kiểu dữ liệu, script trích slides và nội dung 4 phòng"
```

---

### Task 4: Khung chung — ErrorBoundary, RoomShell, RoomNav, router

**Files:**
- Create: `src/components/ErrorBoundary.tsx`, `src/components/RoomShell.tsx`, `src/components/RoomNav.tsx`, `src/components/ScrollToTop.tsx`, `src/components/RoomShell.css`
- Create: `src/routes/NotFound.tsx`, `src/routes/Hall.tsx`, `src/routes/Room1.tsx`, `src/routes/Room2.tsx`, `src/routes/Room3.tsx`, `src/routes/Room4.tsx`
- Modify: `src/App.tsx` (thay toàn bộ), `src/main.tsx` (bọc `BrowserRouter`)

**Interfaces:**
- Consumes: `rooms` từ `src/content/hall.ts` (task 3).
- Produces:

```ts
type RoomShellProps = {
  number: '01' | '02' | '03' | '04';
  title: string;
  tagline: string;
  children: React.ReactNode;
};
export default function RoomShell(props: RoomShellProps): JSX.Element;
```

- [ ] **Step 1: Viết ErrorBoundary**

Tạo `src/components/ErrorBoundary.tsx`:

```tsx
import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Props = { children: ReactNode };
type State = { failed: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main style={{ padding: 'var(--space)', maxWidth: 'var(--measure)' }}>
        <h1>Phòng này đang gặp sự cố</h1>
        <p style={{ color: 'var(--paper-dim)' }}>
          Các phòng còn lại vẫn tham quan bình thường.
        </p>
        <Link to="/">Quay lại sảnh</Link>
      </main>
    );
  }
}
```

- [ ] **Step 2: Viết RoomNav**

Tạo `src/components/RoomNav.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { rooms } from '../content/hall';

export default function RoomNav({ current }: { current: string }) {
  const at = rooms.findIndex((room) => room.number === current);
  const prev = at > 0 ? rooms[at - 1] : null;
  const next = at < rooms.length - 1 ? rooms[at + 1] : null;

  return (
    <nav className="room-nav" aria-label="Điều hướng giữa các phòng">
      {prev ? (
        <Link to={prev.path}>← {prev.number} {prev.title}</Link>
      ) : (
        <Link to="/">← Về sảnh</Link>
      )}
      {next ? (
        <Link to={next.path}>{next.number} {next.title} →</Link>
      ) : (
        <Link to="/">Về sảnh →</Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 3: Viết RoomShell và CSS của nó**

Tạo `src/components/RoomShell.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import RoomNav from './RoomNav';
import './RoomShell.css';

type RoomShellProps = {
  number: '01' | '02' | '03' | '04';
  title: string;
  tagline: string;
  children: ReactNode;
};

export default function RoomShell({ number, title, tagline, children }: RoomShellProps) {
  return (
    <div className="room">
      <header className="room__head">
        <Link className="room__back" to="/">← Sảnh</Link>
        <p className="room__number">{number}</p>
        <h1 className="room__title">{title}</h1>
        <p className="room__tagline">{tagline}</p>
      </header>
      <div className="room__body">{children}</div>
      <RoomNav current={number} />
    </div>
  );
}
```

Tạo `src/components/RoomShell.css`:

```css
.room {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: var(--space);
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.room__head { position: relative; }

.room__back {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--paper-dim);
  text-decoration: none;
  font-size: .9rem;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.room__back:hover { color: var(--accent-soft); }

.room__number {
  font-family: var(--font-display);
  font-size: clamp(3rem, 12vw, 7rem);
  line-height: .8;
  margin: 0;
  color: var(--line);
}

.room__title { font-size: clamp(1.8rem, 5vw, 3.2rem); margin-top: .3em; }

.room__tagline {
  color: var(--paper-dim);
  max-width: var(--measure);
  margin: .6rem 0 0;
}

.room__body { flex: 1; }

.room-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--line);
  padding-top: 1.2rem;
  font-size: .9rem;
}
.room-nav a { color: var(--paper-dim); text-decoration: none; }
.room-nav a:hover { color: var(--accent); }
```

- [ ] **Step 4: Viết ScrollToTop**

Tạo `src/components/ScrollToTop.tsx`:

```tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
```

Không có component này, chuyển từ cuối sảnh sang một phòng sẽ mở ra ở giữa trang.

- [ ] **Step 5: Viết trang 404 và 5 route**

Tạo `src/routes/NotFound.tsx`:

```tsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ padding: 'var(--space)', maxWidth: 'var(--measure)' }}>
      <h1>Không tìm thấy phòng này</h1>
      <p style={{ color: 'var(--paper-dim)' }}>Bảo tàng chỉ có bốn phòng.</p>
      <Link to="/">Quay lại sảnh</Link>
    </main>
  );
}
```

Tạo `src/routes/Hall.tsx` bản tạm (task 5 thay bằng bản thật):

```tsx
export default function Hall() {
  return <main style={{ padding: 'var(--space)' }}><h1>Sảnh</h1></main>;
}
```

Tạo `src/routes/Room1.tsx`:

```tsx
import RoomShell from '../components/RoomShell';

export default function Room1() {
  return (
    <RoomShell
      number="01"
      title="Hành trình hình thành tư tưởng"
      tagline="Từ làng Sen đến Pác Bó, một con đường được tìm thấy."
    >
      <p>Đang xây dựng.</p>
    </RoomShell>
  );
}
```

Tạo `src/routes/Room2.tsx`:

```tsx
import RoomShell from '../components/RoomShell';

export default function Room2() {
  return (
    <RoomShell
      number="02"
      title="Độc lập – Tự do"
      tagline="Quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc."
    >
      <p>Đang xây dựng.</p>
    </RoomShell>
  );
}
```

Tạo `src/routes/Room3.tsx`:

```tsx
import RoomShell from '../components/RoomShell';

export default function Room3() {
  return (
    <RoomShell
      number="03"
      title="Dân là gốc"
      tagline="Nhà nước của nhân dân, do nhân dân, vì nhân dân."
    >
      <p>Đang xây dựng.</p>
    </RoomShell>
  );
}
```

Tạo `src/routes/Room4.tsx`:

```tsx
import RoomShell from '../components/RoomShell';

export default function Room4() {
  return (
    <RoomShell
      number="04"
      title="Đại đoàn kết"
      tagline="Đoàn kết là một chiến lược, không phải một khẩu hiệu."
    >
      <p>Đang xây dựng.</p>
    </RoomShell>
  );
}
```

- [ ] **Step 6: Nối router**

Thay `src/App.tsx`:

```tsx
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Hall from './routes/Hall';
import NotFound from './routes/NotFound';
import Room1 from './routes/Room1';
import Room2 from './routes/Room2';
import Room3 from './routes/Room3';
import Room4 from './routes/Room4';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Hall />} />
        <Route path="/phong-1" element={<ErrorBoundary><Room1 /></ErrorBoundary>} />
        <Route path="/phong-2" element={<ErrorBoundary><Room2 /></ErrorBoundary>} />
        <Route path="/phong-3" element={<ErrorBoundary><Room3 /></ErrorBoundary>} />
        <Route path="/phong-4" element={<ErrorBoundary><Room4 /></ErrorBoundary>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
```

Mỗi phòng có `ErrorBoundary` riêng, nên một phòng hỏng không kéo theo phòng khác.

Sửa `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/base.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 7: Kiểm tra thủ công**

```bash
npm run dev
```

Mở lần lượt `/`, `/phong-1`, `/phong-2`, `/phong-3`, `/phong-4`, `/khong-co-that`. Kỳ vọng: 4 phòng hiện đúng số hiệu và tiêu đề, nút Phòng trước/sau đi đúng thứ tự 01→02→03→04, route lạ ra trang 404 có nút về sảnh.

- [ ] **Step 8: Commit**

```bash
npm run typecheck
git add src
git commit -m "feat: khung phòng dùng chung, router và ranh giới lỗi từng phòng"
```

---

### Task 5: Sảnh và thẻ cửa nghiêng 3D

**Files:**
- Create: `src/hooks/useReducedMotion.ts`, `src/components/DoorCard.tsx`, `src/components/DoorCard.css`, `src/routes/Hall.css`
- Modify: `src/routes/Hall.tsx` (thay toàn bộ)

**Interfaces:**
- Consumes: `hallIntro`, `rooms` từ `src/content/hall.ts` (task 3), kiểu `RoomMeta` từ `src/content/types.ts`.
- Produces:

```ts
export function useReducedMotion(): boolean;                        // src/hooks/useReducedMotion.ts
export default function DoorCard(props: { room: RoomMeta }): JSX.Element;
```

Task 7 và 9 dùng lại `useReducedMotion`.

- [ ] **Step 1: Viết hook nhận biết chế độ giảm chuyển động**

Tạo `src/hooks/useReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Viết DoorCard**

Tạo `src/components/DoorCard.tsx`:

```tsx
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RoomMeta } from '../content/types';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './DoorCard.css';

const MAX_TILT = 8; // độ, theo ràng buộc chuyển động trong spec

export default function DoorCard({ room }: { room: RoomMeta }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  function onPointerMove(event: React.PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const px = (event.clientX - box.left) / box.width - 0.5;
    const py = (event.clientY - box.top) / box.height - 0.5;
    setTilt({ x: -py * 2 * MAX_TILT, y: px * 2 * MAX_TILT });
  }

  function reset() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <Link
      ref={ref}
      to={room.path}
      className="door"
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <span className="door__number">{room.number}</span>
      <span className="door__title">{room.title}</span>
      <span className="door__tagline">{room.tagline}</span>
      <svg className="door__motif" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth=".6" />
        <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth=".6" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="currentColor" strokeWidth=".4" />
      </svg>
    </Link>
  );
}
```

Kiểm tra `event.pointerType !== 'mouse'` là bắt buộc: trên điện thoại, nghiêng thẻ theo ngón tay khiến thẻ nhảy loạn khi chạm.

- [ ] **Step 3: Viết CSS cho DoorCard**

Tạo `src/components/DoorCard.css`:

```css
.door {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: .4rem;
  padding: 1.6rem 1.4rem 2rem;
  min-height: 15rem;
  background: var(--ink-soft);
  border: 1px solid var(--line);
  color: var(--paper-dim);
  text-decoration: none;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: transform var(--dur-fast) var(--ease),
              border-color var(--dur-fast) var(--ease),
              color var(--dur-fast) var(--ease);
}

.door:hover, .door:focus-visible {
  border-color: var(--accent);
  color: var(--paper);
}

.door__number {
  font-family: var(--font-display);
  font-size: 2.6rem;
  line-height: 1;
  color: var(--accent);
}

.door__title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  color: var(--paper);
}

.door__tagline { font-size: .92rem; }

.door__motif {
  position: absolute;
  right: -2.5rem;
  bottom: -2.5rem;
  width: 11rem;
  color: var(--line);
  transition: color var(--dur-slow) var(--ease);
}
.door:hover .door__motif { color: rgba(179, 39, 30, .35); }
```

- [ ] **Step 4: Viết sảnh**

Thay `src/routes/Hall.tsx`:

```tsx
import DoorCard from '../components/DoorCard';
import { hallIntro, rooms } from '../content/hall';
import './Hall.css';

export default function Hall() {
  return (
    <main className="hall">
      <section className="hall__intro">
        <h1 className="hall__title">{hallIntro.title}</h1>
        <p className="hall__subtitle">{hallIntro.subtitle}</p>
        <p className="hall__lead">{hallIntro.lead}</p>
        <a className="hall__scroll" href="#cac-phong">Bắt đầu tham quan ↓</a>
      </section>

      <section className="hall__rooms" id="cac-phong">
        <h2 className="hall__rooms-title">Bốn phòng trưng bày</h2>
        <div className="hall__grid">
          {rooms.map((room) => (
            <DoorCard key={room.number} room={room} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

Tạo `src/routes/Hall.css`:

```css
.hall { padding: var(--space); }

.hall__intro {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  max-width: var(--measure);
}

.hall__title {
  font-size: clamp(2.2rem, 8vw, 5.5rem);
  line-height: 1;
}

.hall__subtitle {
  color: var(--accent);
  letter-spacing: .16em;
  text-transform: uppercase;
  font-size: .9rem;
  margin: 0;
}

.hall__lead { color: var(--paper-dim); }

.hall__scroll {
  margin-top: 1.5rem;
  color: var(--paper-dim);
  text-decoration: none;
  font-size: .9rem;
  animation: nudge 2.4s var(--ease) infinite;
  align-self: flex-start;
}
.hall__scroll:hover { color: var(--accent-soft); }

@keyframes nudge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

.hall__rooms { padding-block: clamp(3rem, 10vh, 7rem); }

.hall__rooms-title {
  font-size: .9rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--paper-dim);
  font-family: var(--font-body);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hall__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}
```

`auto-fit` với `minmax` cho ra 4 cột trên desktop và tự xếp chồng dưới 768px mà không cần media query riêng.

- [ ] **Step 5: Kiểm tra thủ công**

```bash
npm run dev
```

Kỳ vọng: màn đầu chiếm trọn viewport, bấm "Bắt đầu tham quan" cuộn xuống lưới 4 thẻ. Rê chuột thấy thẻ nghiêng nhẹ và viền chuyển đỏ. Thu cửa sổ xuống 375px thấy 4 thẻ xếp dọc. Bật giảm chuyển động trong hệ điều hành rồi tải lại, thẻ không nghiêng nữa.

- [ ] **Step 6: Commit**

```bash
npm run typecheck
git add src
git commit -m "feat: sảnh chính với bốn thẻ cửa nghiêng 3D bằng CSS"
```

---

### Task 6: Phòng 1 — Timeline tương tác

**Files:**
- Create: `src/rooms/room1/Timeline.tsx`, `src/rooms/room1/MilestonePanel.tsx`, `src/rooms/room1/room1.css`
- Modify: `src/routes/Room1.tsx` (thay toàn bộ)

**Interfaces:**
- Consumes: `milestones` (task 3), `useStepIndex` (task 2), `RoomShell` (task 4).
- Produces: không có gì cho task sau.

- [ ] **Step 1: Viết Timeline**

Tạo `src/rooms/room1/Timeline.tsx`:

```tsx
import { motion } from 'framer-motion';
import type { Milestone } from '../../content/types';

type Props = {
  items: Milestone[];
  index: number;
  onSelect: (next: number) => void;
  onStep: (delta: number) => void;
};

export default function Timeline({ items, index, onSelect, onStep }: Props) {
  function onKeyDown(event: React.KeyboardEvent<HTMLOListElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onStep(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onStep(-1);
    }
  }

  return (
    <ol
      className="tl"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Các mốc thời gian, dùng phím mũi tên trái phải để chuyển"
    >
      <span className="tl__rail" aria-hidden="true" />
      {items.map((item, i) => {
        const active = i === index;
        return (
          <li key={item.year} className="tl__item">
            <button
              type="button"
              className={active ? 'tl__dot tl__dot--on' : 'tl__dot'}
              aria-current={active ? 'step' : undefined}
              onClick={() => onSelect(i)}
            >
              {active && (
                <motion.span layoutId="tl-spark" className="tl__spark" aria-hidden="true" />
              )}
              <span className="tl__year">{item.year}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
```

`layoutId` khiến Framer Motion tự trượt chấm sáng từ mốc cũ sang mốc mới thay vì hiện tức thời.

- [ ] **Step 2: Viết MilestonePanel**

Tạo `src/rooms/room1/MilestonePanel.tsx`:

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import type { Milestone } from '../../content/types';

export default function MilestonePanel({ item }: { item: Milestone }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={item.year}
        className="tl-panel"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <p className="tl-panel__year">{item.year}</p>
        <p className="tl-panel__place">{item.place}</p>
        <p className="tl-panel__event">{item.event}</p>
        <p className="tl-panel__meaning">{item.meaning}</p>
      </motion.article>
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Nối vào route**

Thay `src/routes/Room1.tsx`:

```tsx
import RoomShell from '../components/RoomShell';
import { milestones } from '../content/room1';
import { useStepIndex } from '../hooks/useStepIndex';
import MilestonePanel from '../rooms/room1/MilestonePanel';
import Timeline from '../rooms/room1/Timeline';
import '../rooms/room1/room1.css';

export default function Room1() {
  const step = useStepIndex(milestones.length);

  return (
    <RoomShell
      number="01"
      title="Hành trình hình thành tư tưởng"
      tagline="Từ làng Sen đến Pác Bó, một con đường được tìm thấy."
    >
      <Timeline
        items={milestones}
        index={step.index}
        onSelect={step.go}
        onStep={(delta) => (delta > 0 ? step.next() : step.prev())}
      />
      <MilestonePanel item={milestones[step.index]} />
    </RoomShell>
  );
}
```

- [ ] **Step 4: Viết CSS**

Tạo `src/rooms/room1/room1.css`:

```css
.tl {
  position: relative;
  display: flex;
  gap: 1rem;
  list-style: none;
  margin: 0 0 2.5rem;
  padding: 2rem 0 0;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.tl__rail {
  position: absolute;
  top: 2.55rem;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--line);
}

.tl__item { flex: 1 0 6.5rem; scroll-snap-align: center; }

.tl__dot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .8rem;
  width: 100%;
  padding: 0;
  background: none;
  border: 0;
  color: var(--paper-dim);
  font-family: var(--font-display);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease);
}

.tl__dot::before {
  content: '';
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--ink);
  border: 1px solid var(--paper-dim);
}

.tl__dot:hover, .tl__dot--on { color: var(--paper); }
.tl__dot--on::before { border-color: var(--accent); }

.tl__spark {
  position: absolute;
  top: 0;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 14px 4px rgba(179, 39, 30, .55);
}

.tl-panel { max-width: var(--measure); }
.tl-panel__year {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 9vw, 4.5rem);
  line-height: 1;
  color: var(--accent);
  margin: 0;
}
.tl-panel__place {
  letter-spacing: .14em;
  text-transform: uppercase;
  font-size: .85rem;
  color: var(--accent-soft);
  margin: .6rem 0 1rem;
}
.tl-panel__event { margin: 0 0 .8rem; }
.tl-panel__meaning {
  margin: 0;
  padding-left: 1rem;
  border-left: 2px solid var(--accent);
  color: var(--paper-dim);
}
```

- [ ] **Step 5: Kiểm tra thủ công**

```bash
npm run dev
```

Mở `/phong-1`. Kỳ vọng: bấm mốc thì chấm sáng trượt tới và panel đổi nội dung bằng cross-fade; bấm vào timeline rồi dùng phím mũi tên trái/phải cũng chuyển được; ở mốc 1890 bấm mũi tên trái thì đứng yên; thu cửa sổ 375px thì timeline cuộn ngang và bám mốc.

- [ ] **Step 6: Commit**

```bash
npm run typecheck
git add src
git commit -m "feat: phòng 1 với timeline tương tác và chấm sáng trượt"
```

---

### Task 7: Phòng 3 — Infographic Dân là gốc

Làm phòng 3 trước phòng 2 vì nó rẻ hơn và tạo ra hàm toán cung tròn mà phòng 4 dùng lại.

**Files:**
- Create: `src/lib/polar.ts`, `src/lib/polar.test.ts`
- Create: `src/rooms/room3/PeopleDiagram.tsx`, `src/rooms/room3/CycleRing.tsx`, `src/rooms/room3/room3.css`
- Modify: `src/routes/Room3.tsx` (thay toàn bộ)

**Interfaces:**
- Consumes: `facets`, `cycle`, `cycleNote` (task 3), `useReducedMotion` (task 5), `RoomShell` (task 4).
- Produces:

```ts
export type Point = { x: number; y: number };
export function polar(cx: number, cy: number, r: number, deg: number): Point;
export function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string;
```

Task 9 dùng lại `polar` để rải 8 chỗ ngồi quanh vòng tròn.

- [ ] **Step 1: Viết test thất bại cho toán cung tròn**

Tạo `src/lib/polar.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { arcPath, polar } from './polar';

describe('polar', () => {
  it('0 độ nằm ngay phía trên tâm', () => {
    const p = polar(100, 100, 50, 0);
    expect(p.x).toBeCloseTo(100, 5);
    expect(p.y).toBeCloseTo(50, 5);
  });

  it('90 độ nằm bên phải tâm', () => {
    const p = polar(100, 100, 50, 90);
    expect(p.x).toBeCloseTo(150, 5);
    expect(p.y).toBeCloseTo(100, 5);
  });

  it('180 độ nằm phía dưới tâm', () => {
    const p = polar(100, 100, 50, 180);
    expect(p.x).toBeCloseTo(100, 5);
    expect(p.y).toBeCloseTo(150, 5);
  });
});

describe('arcPath', () => {
  it('cung 120 độ dùng cờ large-arc bằng 0', () => {
    expect(arcPath(100, 100, 50, 0, 120)).toMatch(/A 50 50 0 0 1/);
  });

  it('cung 240 độ dùng cờ large-arc bằng 1', () => {
    expect(arcPath(100, 100, 50, 0, 240)).toMatch(/A 50 50 0 1 1/);
  });
});
```

- [ ] **Step 2: Chạy test để chắc chắn nó thất bại**

```bash
npx vitest run src/lib/polar.test.ts
```

Kỳ vọng: FAIL vì không tìm thấy module `./polar`.

- [ ] **Step 3: Viết cài đặt**

Tạo `src/lib/polar.ts`:

```ts
export type Point = { x: number; y: number };

/** 0 độ ở đỉnh vòng tròn, tăng theo chiều kim đồng hồ. */
export function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}
```

- [ ] **Step 4: Chạy test để chắc chắn nó qua**

```bash
npx vitest run src/lib/polar.test.ts
```

Kỳ vọng: PASS, 5 test.

- [ ] **Step 5: Viết PeopleDiagram**

Tạo `src/rooms/room3/PeopleDiagram.tsx`:

```tsx
import type { PeopleFacet } from '../../content/types';
import { arcPath, polar } from '../../lib/polar';

const CX = 200;
const CY = 200;
const R = 150;
const GAP = 6; // độ hở giữa hai cung

type Props = {
  facets: PeopleFacet[];
  activeId: string | null;
  onToggle: (id: string) => void;
};

export default function PeopleDiagram({ facets, activeId, onToggle }: Props) {
  return (
    <svg className="pd" viewBox="0 0 400 400" role="group" aria-label="Sơ đồ nhân dân">
      <circle cx={CX} cy={CY} r={64} fill="var(--ink-soft)" stroke="var(--accent)" strokeWidth="1" />
      <text className="pd__core" x={CX} y={CY + 6} textAnchor="middle">NHÂN DÂN</text>

      {facets.map((facet, i) => {
        const start = i * 120 + GAP;
        const end = (i + 1) * 120 - GAP;
        const mid = polar(CX, CY, R + 28, (start + end) / 2);
        const on = activeId === facet.id;
        const dim = activeId !== null && !on;

        return (
          <g
            key={facet.id}
            className={dim ? 'pd__arc pd__arc--dim' : 'pd__arc'}
            onClick={() => onToggle(facet.id)}
          >
            <path
              d={arcPath(CX, CY, R, start, end)}
              fill="none"
              stroke={on ? 'var(--accent)' : 'var(--paper-dim)'}
              strokeWidth={on ? 10 : 4}
              strokeLinecap="round"
            />
            <text className="pd__label" x={mid.x} y={mid.y} textAnchor="middle">
              {facet.title}
            </text>
            <path
              d={arcPath(CX, CY, R, start, end)}
              fill="none"
              stroke="transparent"
              strokeWidth={30}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={facet.title}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onToggle(facet.id);
                }
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
```

Đường `stroke="transparent"` dày 30 là vùng bấm: cung nhìn thấy chỉ dày 4–10px, quá mảnh để chạm bằng ngón tay.

- [ ] **Step 6: Viết CycleRing**

Tạo `src/rooms/room3/CycleRing.tsx`:

```tsx
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { polar } from '../../lib/polar';

const CX = 130;
const CY = 130;
const R = 92;

export default function CycleRing({ nodes }: { nodes: { id: string; label: string }[] }) {
  const reduced = useReducedMotion();

  return (
    <svg
      className="cycle"
      viewBox="0 0 260 260"
      role="img"
      aria-label="Vòng tuần hoàn nhân dân, nhà nước, chính sách"
    >
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line)" strokeWidth="1" />

      {!reduced && (
        <circle r="5" fill="var(--accent)">
          <animateMotion
            dur="8s"
            repeatCount="indefinite"
            path={`M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.01} ${CY - R} Z`}
          />
        </circle>
      )}

      {nodes.map((node, i) => {
        const p = polar(CX, CY, R, (360 / nodes.length) * i);
        return (
          <g key={node.id}>
            <circle cx={p.x} cy={p.y} r="24" fill="var(--ink-soft)" stroke="var(--accent-soft)" strokeWidth="1" />
            <text className="cycle__label" x={p.x} y={p.y + 4} textAnchor="middle">
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 7: Nối vào route**

Thay `src/routes/Room3.tsx`:

```tsx
import { useState } from 'react';
import RoomShell from '../components/RoomShell';
import { cycle, cycleNote, facets } from '../content/room3';
import CycleRing from '../rooms/room3/CycleRing';
import PeopleDiagram from '../rooms/room3/PeopleDiagram';
import '../rooms/room3/room3.css';

export default function Room3() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = facets.find((facet) => facet.id === activeId) ?? null;

  return (
    <RoomShell
      number="03"
      title="Dân là gốc"
      tagline="Nhà nước của nhân dân, do nhân dân, vì nhân dân."
    >
      <div className="r3">
        <div className="r3__diagram">
          <PeopleDiagram
            facets={facets}
            activeId={activeId}
            onToggle={(id) => setActiveId((current) => (current === id ? null : id))}
          />
        </div>

        <div className="r3__side">
          {active ? (
            <article className="r3__detail">
              <h2>{active.title}</h2>
              <p className="r3__short">{active.short}</p>
              <p>{active.detail}</p>
            </article>
          ) : (
            <p className="r3__hint">Bấm vào một trong ba cung để đọc nội dung.</p>
          )}

          <CycleRing nodes={cycle} />
          <p className="r3__note">{cycleNote}</p>
        </div>
      </div>
    </RoomShell>
  );
}
```

- [ ] **Step 8: Viết CSS**

Tạo `src/rooms/room3/room3.css`:

```css
.r3 {
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

@media (min-width: 900px) {
  .r3 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
}

.r3__diagram { max-width: 30rem; margin-inline: auto; width: 100%; }

.pd { width: 100%; height: auto; }
.pd__arc { cursor: pointer; transition: opacity var(--dur-fast) var(--ease); }
.pd__arc--dim { opacity: .35; }

.pd__core {
  font-family: var(--font-display);
  font-size: 15px;
  fill: var(--paper);
  letter-spacing: .06em;
}

.pd__label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .12em;
  fill: var(--paper-dim);
}

.r3__detail h2 { font-size: 1.6rem; color: var(--accent); }
.r3__short { color: var(--accent-soft); margin: .4rem 0 .8rem; }
.r3__hint { color: var(--paper-dim); font-style: italic; }
.r3__note { color: var(--paper-dim); font-size: .92rem; max-width: var(--measure); }

.cycle { width: min(16rem, 100%); height: auto; margin-top: 2rem; }
.cycle__label { font-family: var(--font-body); font-size: 10px; fill: var(--paper); }
```

- [ ] **Step 9: Kiểm tra thủ công**

```bash
npm run dev
```

Mở `/phong-3`. Kỳ vọng: bấm một cung thì cung dày lên và chuyển đỏ, hai cung kia mờ còn 35%, panel bên cạnh hiện nội dung; bấm lại chính cung đó thì trở về trạng thái đầu; Tab tới từng cung rồi Enter cũng chọn được; chấm sáng chạy quanh vòng tuần hoàn và biến mất khi bật giảm chuyển động.

- [ ] **Step 10: Commit**

```bash
npm run typecheck && npm test
git add src
git commit -m "feat: phòng 3 với sơ đồ ba cung và vòng tuần hoàn"
```

---

### Task 8: Phòng 2 — Bản đồ hành trình

**Files:**
- Create: `src/rooms/room2/WorldMap.tsx`, `src/rooms/room2/RouteLine.tsx`, `src/rooms/room2/StoryPanel.tsx`, `src/rooms/room2/room2.css`
- Modify: `src/routes/Room2.tsx` (thay toàn bộ)

**Interfaces:**
- Consumes: `stops`, `closingQuote` (task 3), `useStepIndex` (task 2), `RoomShell` (task 4).
- Produces: không có gì cho task sau.

Bản đồ dùng phương án trừu tượng đã chốt trong spec: lưới toạ độ mảnh cộng nhãn địa danh đặt đúng tương quan vị trí địa lý. Không tải tài nguyên ngoài, không rủi ro giấy phép.

- [ ] **Step 1: Viết RouteLine**

Tạo `src/rooms/room2/RouteLine.tsx`:

```tsx
import { motion } from 'framer-motion';
import type { MapStop } from '../../content/types';

type Props = { from: MapStop; to: MapStop; faded?: boolean };

/** Đường cong nối hai điểm, độ vồng tỉ lệ với khoảng cách. */
export function curveBetween(from: MapStop, to: MapStop): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.22;
  return `M ${from.x} ${from.y} Q ${mx} ${my - lift} ${to.x} ${to.y}`;
}

export default function RouteLine({ from, to, faded = false }: Props) {
  return (
    <motion.path
      d={curveBetween(from, to)}
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 1 }}
      animate={{ pathLength: 1, opacity: faded ? 0.25 : 1 }}
      transition={{ pathLength: { duration: 0.6, ease: 'easeOut' }, opacity: { delay: 0.6 } }}
    />
  );
}
```

- [ ] **Step 2: Viết WorldMap**

Tạo `src/rooms/room2/WorldMap.tsx`:

```tsx
import type { MapStop } from '../../content/types';
import RouteLine from './RouteLine';

type Props = {
  stops: MapStop[];
  index: number;
  visited: number[];
  onSelect: (next: number) => void;
  onStep: (delta: number) => void;
};

const GRID_X = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const GRID_Y = [100, 200, 300, 400];

export default function WorldMap({ stops, index, visited, onSelect, onStep }: Props) {
  const ordered = visited.slice().sort((a, b) => a - b);
  const legs = ordered.slice(1).map((step, i) => [ordered[i], step] as const);

  function onKeyDown(event: React.KeyboardEvent<SVGSVGElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onStep(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onStep(-1);
    }
  }

  return (
    <svg
      className="map"
      viewBox="0 0 1000 500"
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="group"
      aria-label="Bản đồ hành trình, dùng phím mũi tên trái phải để chuyển điểm"
    >
      <g className="map__grid" aria-hidden="true">
        {GRID_X.map((x) => (
          <line key={`x${x}`} x1={x} y1="0" x2={x} y2="500" />
        ))}
        {GRID_Y.map((y) => (
          <line key={`y${y}`} x1="0" y1={y} x2="1000" y2={y} />
        ))}
        <line className="map__equator" x1="0" y1="250" x2="1000" y2="250" />
      </g>

      {legs.map(([a, b]) => (
        <RouteLine key={`${a}-${b}`} from={stops[a]} to={stops[b]} faded={b !== index} />
      ))}

      {stops.map((stop, i) => {
        const on = i === index;
        return (
          <g key={stop.id} className={on ? 'map__stop map__stop--on' : 'map__stop'}>
            <circle
              cx={stop.x}
              cy={stop.y}
              r={on ? 8 : 5}
              fill={on ? 'var(--accent)' : 'var(--paper-dim)'}
            />
            <circle
              cx={stop.x}
              cy={stop.y}
              r="20"
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={stop.label}
              aria-current={on ? 'step' : undefined}
              onClick={() => onSelect(i)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(i);
                }
              }}
            />
            <text
              className="map__label"
              x={stop.x + stop.labelDx}
              y={stop.y + stop.labelDy}
              textAnchor="middle"
            >
              {stop.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
```

- [ ] **Step 3: Viết StoryPanel**

Tạo `src/rooms/room2/StoryPanel.tsx`:

```tsx
import { AnimatePresence, motion } from 'framer-motion';
import type { MapStop } from '../../content/types';

export default function StoryPanel({ stop }: { stop: MapStop }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={stop.id}
        className="story"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <h2 className="story__place">{stop.label}</h2>
        <p className="story__event">{stop.event}</p>
        <p className="story__link">{stop.link}</p>
      </motion.article>
    </AnimatePresence>
  );
}
```

- [ ] **Step 4: Nối vào route**

Thay `src/routes/Room2.tsx`:

```tsx
import { motion } from 'framer-motion';
import RoomShell from '../components/RoomShell';
import { closingQuote, stops } from '../content/room2';
import { useStepIndex } from '../hooks/useStepIndex';
import StoryPanel from '../rooms/room2/StoryPanel';
import WorldMap from '../rooms/room2/WorldMap';
import '../rooms/room2/room2.css';

export default function Room2() {
  const step = useStepIndex(stops.length);

  return (
    <RoomShell
      number="02"
      title="Độc lập – Tự do"
      tagline="Quyền thiêng liêng, bất khả xâm phạm của mọi dân tộc."
    >
      <div className="r2">
        <WorldMap
          stops={stops}
          index={step.index}
          visited={step.visited}
          onSelect={step.go}
          onStep={(delta) => (delta > 0 ? step.next() : step.prev())}
        />
        <StoryPanel stop={stops[step.index]} />
      </div>

      {step.allVisited && (
        <motion.p
          className="r2__closing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {closingQuote}
        </motion.p>
      )}
    </RoomShell>
  );
}
```

- [ ] **Step 5: Viết CSS**

Tạo `src/rooms/room2/room2.css`:

```css
.r2 {
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

@media (min-width: 900px) {
  .r2 { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); }
}

.map {
  width: 100%;
  height: auto;
  background: var(--ink-soft);
  border: 1px solid var(--line);
}

.map__grid line { stroke: var(--line); stroke-width: .5; }
.map__equator { stroke-dasharray: 6 8; }

.map__stop [role='button'] { cursor: pointer; }

.map__label {
  font-family: var(--font-body);
  font-size: 15px;
  fill: var(--paper-dim);
  letter-spacing: .06em;
}
.map__stop--on .map__label { fill: var(--paper); }

.story__place { font-size: 1.6rem; color: var(--accent); }
.story__event { margin: .8rem 0; }
.story__link {
  margin: 0;
  padding-left: 1rem;
  border-left: 2px solid var(--accent-soft);
  color: var(--paper-dim);
}

.r2__closing {
  margin-top: 2.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 4vw, 2.4rem);
  color: var(--accent-soft);
  text-align: center;
  border-block: 1px solid var(--line);
  padding-block: 1.5rem;
}
```

- [ ] **Step 6: Kiểm tra thủ công**

```bash
npm run dev
```

Mở `/phong-2`. Kỳ vọng: 5 điểm hiện đúng vị trí, nhãn Pác Bó và Quảng Châu không chồng lên nhau; bấm điểm thì panel đổi và một đường cong sáng vẽ nối từ điểm trước; đường đã đi giữ lại ở độ đậm 25%; sau khi xem đủ 5 điểm thì câu "Không có gì quý hơn độc lập, tự do." hiện ra; phím mũi tên chuyển được điểm.

- [ ] **Step 7: Commit**

```bash
npm run typecheck && npm test
git add src
git commit -m "feat: phòng 2 với bản đồ hành trình và đường sáng nối điểm"
```

---

### Task 9: Phòng 4 — Vòng tròn Đại đoàn kết

**Files:**
- Create: `src/rooms/room4/unityState.ts`, `src/rooms/room4/unityState.test.ts`
- Create: `src/rooms/room4/UnityCircle.tsx`, `src/rooms/room4/GroupCard.tsx`, `src/rooms/room4/StrengthBar.tsx`, `src/rooms/room4/room4.css`
- Modify: `src/routes/Room4.tsx` (thay toàn bộ)

**Interfaces:**
- Consumes: `groups`, `completionQuote` (task 3), `polar` (task 7), `RoomShell` (task 4).
- Produces:

```ts
export const TOTAL_GROUPS = 8;
export function addGroup(joined: string[], id: string): string[];
export function strength(joined: string[]): number;   // 0..100, bội số của 12.5
export function isComplete(joined: string[]): boolean;
```

- [ ] **Step 1: Viết test thất bại cho logic điểm đoàn kết**

Tạo `src/rooms/room4/unityState.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { addGroup, isComplete, strength, TOTAL_GROUPS } from './unityState';

describe('unityState', () => {
  it('bắt đầu ở 0%', () => {
    expect(strength([])).toBe(0);
    expect(isComplete([])).toBe(false);
  });

  it('mỗi nhóm đóng góp 12,5%', () => {
    expect(strength(['cong-nhan'])).toBe(12.5);
    expect(strength(['cong-nhan', 'nong-dan'])).toBe(25);
  });

  it('thêm trùng nhóm không tăng điểm hai lần', () => {
    const once = addGroup([], 'cong-nhan');
    const twice = addGroup(once, 'cong-nhan');
    expect(twice).toEqual(['cong-nhan']);
    expect(strength(twice)).toBe(12.5);
  });

  it('addGroup không sửa mảng gốc', () => {
    const before = ['cong-nhan'];
    addGroup(before, 'nong-dan');
    expect(before).toEqual(['cong-nhan']);
  });

  it('đủ 8 nhóm ra đúng 100% và báo hoàn thành', () => {
    const all = Array.from({ length: TOTAL_GROUPS }, (_, i) => `nhom-${i}`);
    expect(strength(all)).toBe(100);
    expect(isComplete(all)).toBe(true);
  });
});
```

- [ ] **Step 2: Chạy test để chắc chắn nó thất bại**

```bash
npx vitest run src/rooms/room4/unityState.test.ts
```

Kỳ vọng: FAIL vì không tìm thấy module `./unityState`.

- [ ] **Step 3: Viết cài đặt**

Tạo `src/rooms/room4/unityState.ts`:

```ts
export const TOTAL_GROUPS = 8;

export function addGroup(joined: string[], id: string): string[] {
  return joined.includes(id) ? joined : [...joined, id];
}

export function strength(joined: string[]): number {
  return (joined.length / TOTAL_GROUPS) * 100;
}

export function isComplete(joined: string[]): boolean {
  return joined.length >= TOTAL_GROUPS;
}
```

- [ ] **Step 4: Chạy test để chắc chắn nó qua**

```bash
npx vitest run src/rooms/room4/unityState.test.ts
```

Kỳ vọng: PASS, 5 test.

- [ ] **Step 5: Viết StrengthBar**

Tạo `src/rooms/room4/StrengthBar.tsx`:

```tsx
import { motion } from 'framer-motion';

export default function StrengthBar({ value }: { value: number }) {
  return (
    <div className="bar">
      <div className="bar__head">
        <span>Sức mạnh đoàn kết</span>
        <span className="bar__value">{Math.round(value)}%</span>
      </div>
      <div
        className="bar__track"
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Sức mạnh đoàn kết"
      >
        <motion.div
          className="bar__fill"
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Viết GroupCard (thẻ kéo được)**

Tạo `src/rooms/room4/GroupCard.tsx`:

```tsx
import { useDraggable } from '@dnd-kit/core';
import type { UnityGroup } from '../../content/types';

type Props = { group: UnityGroup; onPick: (id: string) => void };

export default function GroupCard({ group, onPick }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: group.id,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={isDragging ? 'gcard gcard--dragging' : 'gcard'}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
          : undefined
      }
      onClick={() => onPick(group.id)}
      aria-label={`Thêm ${group.name} vào khối đại đoàn kết`}
      {...listeners}
      {...attributes}
    >
      {group.name}
    </button>
  );
}
```

Thẻ là `<button>` thật nên bấm và Enter đều thêm được nhóm — đây là đường dự phòng bắt buộc khi kéo thả không dùng được.

- [ ] **Step 7: Viết UnityCircle (vùng thả)**

Tạo `src/rooms/room4/UnityCircle.tsx`:

```tsx
import { useDroppable } from '@dnd-kit/core';
import type { UnityGroup } from '../../content/types';
import { polar } from '../../lib/polar';
import { TOTAL_GROUPS } from './unityState';

const CX = 160;
const CY = 160;
const R = 118;

type Props = { joined: string[]; groups: UnityGroup[] };

export default function UnityCircle({ joined, groups }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: 'unity-circle' });
  const glow = joined.length / TOTAL_GROUPS;

  return (
    <div ref={setNodeRef} className={isOver ? 'unity unity--over' : 'unity'}>
      <svg viewBox="0 0 320 320" role="img" aria-label="Khối đại đoàn kết toàn dân tộc">
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1 + glow * 5}
          opacity={0.25 + glow * 0.75}
          style={{ filter: `drop-shadow(0 0 ${glow * 22}px rgba(179,39,30,${glow * 0.8}))` }}
        />
        <text className="unity__core" x={CX} y={CY - 8} textAnchor="middle">ĐẠI ĐOÀN KẾT</text>
        <text className="unity__core" x={CX} y={CY + 14} textAnchor="middle">TOÀN DÂN TỘC</text>

        {joined.map((id, i) => {
          const seat = polar(CX, CY, R, (360 / TOTAL_GROUPS) * i);
          const group = groups.find((item) => item.id === id);
          return (
            <g key={id}>
              <circle cx={seat.x} cy={seat.y} r="7" fill="var(--accent-soft)" />
              <text className="unity__seat" x={seat.x} y={seat.y - 14} textAnchor="middle">
                {group?.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 8: Nối vào route**

Thay `src/routes/Room4.tsx`:

```tsx
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import RoomShell from '../components/RoomShell';
import { completionQuote, groups } from '../content/room4';
import GroupCard from '../rooms/room4/GroupCard';
import StrengthBar from '../rooms/room4/StrengthBar';
import UnityCircle from '../rooms/room4/UnityCircle';
import { addGroup, isComplete, strength } from '../rooms/room4/unityState';
import '../rooms/room4/room4.css';

export default function Room4() {
  const [joined, setJoined] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 3000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  function join(id: string) {
    if (joined.includes(id)) return;
    const group = groups.find((item) => item.id === id);
    if (group) setFlash(group.message);
    setJoined((current) => addGroup(current, id));
  }

  function onDragEnd(event: DragEndEvent) {
    if (event.over?.id === 'unity-circle') join(String(event.active.id));
  }

  const waiting = groups.filter((group) => !joined.includes(group.id));

  return (
    <RoomShell
      number="04"
      title="Đại đoàn kết"
      tagline="Đoàn kết là một chiến lược, không phải một khẩu hiệu."
    >
      <DndContext onDragEnd={onDragEnd}>
        <div className="r4">
          <div className="r4__stage">
            <UnityCircle joined={joined} groups={groups} />
            <StrengthBar value={strength(joined)} />
          </div>

          <div className="r4__side">
            <p className="r4__hint">
              Kéo từng nhóm vào vòng tròn, hoặc bấm vào nhóm để thêm.
            </p>
            <div className="r4__deck">
              {waiting.map((group) => (
                <GroupCard key={group.id} group={group} onPick={join} />
              ))}
            </div>

            <AnimatePresence>
              {flash && (
                <motion.p
                  className="r4__flash"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {flash}
                </motion.p>
              )}
            </AnimatePresence>

            {isComplete(joined) && (
              <motion.div
                className="r4__done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="r4__quote">{completionQuote}</p>
                <button type="button" className="r4__reset" onClick={() => setJoined([])}>
                  Làm lại
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </DndContext>
    </RoomShell>
  );
}
```

- [ ] **Step 9: Viết CSS**

Tạo `src/rooms/room4/room4.css`:

```css
.r4 {
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

@media (min-width: 900px) {
  .r4 { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
}

.unity { max-width: 26rem; margin-inline: auto; }
.unity svg { width: 100%; height: auto; }
.unity--over svg { transform: scale(1.02); transition: transform var(--dur-fast) var(--ease); }

.unity__core {
  font-family: var(--font-display);
  font-size: 17px;
  fill: var(--paper);
  letter-spacing: .05em;
}
.unity__seat { font-family: var(--font-body); font-size: 10px; fill: var(--paper-dim); }

.bar { margin-top: 1.5rem; }
.bar__head {
  display: flex;
  justify-content: space-between;
  font-size: .85rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--paper-dim);
  margin-bottom: .5rem;
}
.bar__value { color: var(--accent-soft); }
.bar__track { height: 6px; background: var(--ink-soft); border: 1px solid var(--line); }
.bar__fill { height: 100%; background: var(--accent); }

.r4__hint { color: var(--paper-dim); font-size: .92rem; }

.r4__deck { display: flex; flex-wrap: wrap; gap: .6rem; margin-block: 1rem; }

.gcard {
  padding: .6rem 1rem;
  background: var(--ink-soft);
  border: 1px solid var(--line);
  color: var(--paper);
  font-family: var(--font-body);
  font-size: .95rem;
  cursor: grab;
  touch-action: none;
  transition: border-color var(--dur-fast) var(--ease);
}
.gcard:hover { border-color: var(--accent); }
.gcard--dragging { cursor: grabbing; border-color: var(--accent); position: relative; z-index: 2; }

.r4__flash {
  border-left: 2px solid var(--accent-soft);
  padding-left: 1rem;
  color: var(--paper-dim);
  max-width: var(--measure);
}

.r4__done { margin-top: 1.5rem; border-top: 1px solid var(--line); padding-top: 1.5rem; }
.r4__quote {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  color: var(--accent-soft);
  margin: 0 0 1rem;
}
.r4__reset {
  padding: .6rem 1.2rem;
  background: none;
  border: 1px solid var(--accent);
  color: var(--accent);
  font-family: var(--font-body);
  cursor: pointer;
}
.r4__reset:hover { background: var(--accent); color: var(--paper); }
```

`touch-action: none` trên `.gcard` là bắt buộc: thiếu nó, kéo thẻ trên điện thoại sẽ bị trình duyệt hiểu thành cuộn trang.

- [ ] **Step 10: Kiểm tra thủ công**

```bash
npm run dev
```

Mở `/phong-4`. Kỳ vọng: kéo một thẻ vào vòng tròn thì vòng sáng thêm, thanh sức mạnh tăng đúng 12,5%, câu thông điệp hiện 3 giây rồi mất; bấm thẻ cũng cho kết quả y hệt; đủ 8 nhóm thì hiện câu kết và nút Làm lại; bấm Làm lại thì mọi thứ về trạng thái đầu. Bật chế độ giả lập cảm ứng của DevTools ở khổ 375px để chắc chắn kéo thẻ không làm cuộn trang.

- [ ] **Step 11: Commit**

```bash
npm run typecheck && npm test
git add src
git commit -m "feat: phòng 4 với kéo thả và thanh sức mạnh đoàn kết"
```

---

### Task 10: Rà soát điện thoại, giảm chuyển động, QA và deploy bản cuối

**Files:**
- Create: `docs/qa-checklist.md`
- Modify: các file CSS phòng nếu phát hiện lỗi bố cục

**Interfaces:**
- Consumes: toàn bộ 9 task trước.
- Produces: bản production trên Vercel.

- [ ] **Step 1: Ghi checklist QA**

Tạo `docs/qa-checklist.md`:

```markdown
# Checklist trước khi nộp

- [ ] Bốn phòng vào được từ sảnh và từ nút Phòng trước/sau
- [ ] Refresh tại `/`, `/phong-1`, `/phong-2`, `/phong-3`, `/phong-4` — không route nào 404
- [ ] `/khong-co-that` ra trang 404 có nút về sảnh
- [ ] Điện thoại 375px: mọi tương tác dùng được bằng ngón tay ở cả 4 phòng
- [ ] Bàn phím: Tab đi hết sảnh và 4 phòng, Enter kích hoạt đúng, viền focus nhìn thấy được
- [ ] Bật giảm chuyển động: không phòng nào vỡ bố cục, không animation lặp vô hạn
- [ ] Chính tả và dấu tiếng Việt trong 5 file `src/content/*`
- [ ] Mở link production trên một máy khác, không phải máy phát triển
```

- [ ] **Step 2: Rà soát ở khổ điện thoại**

```bash
npm run dev
```

Mở DevTools, chọn khổ 375×812, bật giả lập cảm ứng. Đi hết 4 phòng. Sửa CSS ngay nếu thấy tràn ngang, chữ trong SVG quá nhỏ, hoặc vùng chạm nhỏ hơn 44px.

- [ ] **Step 3: Rà soát chế độ giảm chuyển động**

Trong DevTools, mở Command Menu và chạy "Emulate CSS prefers-reduced-motion: reduce". Tải lại từng phòng. Kỳ vọng: thẻ cửa không nghiêng, chấm sáng vòng tuần hoàn không xuất hiện, không animation nào lặp vô hạn, mọi nội dung vẫn đọc được.

- [ ] **Step 4: Chạy toàn bộ kiểm tra tự động**

```bash
npm run typecheck && npm test && npm run build
```

Kỳ vọng: typecheck sạch, 16 test qua (6 của `useStepIndex`, 5 của `polar`, 5 của `unityState`), build sinh `dist/`.

- [ ] **Step 5: Soát lại nội dung**

Đọc lại `src/content/hall.ts` và `room1.ts` đến `room4.ts`. Kiểm tra chính tả, dấu câu, và tính chính xác của mốc thời gian so với `docs/content-raw/`.

- [ ] **Step 6: Commit và deploy**

```bash
git add -A
git commit -m "chore: rà soát điện thoại, giảm chuyển động và checklist QA"
git push
```

Vercel tự deploy khi `main` được đẩy lên. Mở link production và chạy hết checklist ở Step 1 trên chính bản production, không phải bản dev.

- [ ] **Step 7: Kiểm tra lần cuối trên thiết bị khác**

Mở link production bằng điện thoại thật. Kỳ vọng: 4 phòng dùng được bằng ngón tay, font hiện đúng dấu tiếng Việt, không lỗi hiển thị.

---

## Thứ tự cắt nếu hụt thời gian

Nếu đến ngày 5 mà chưa xong, cắt theo đúng thứ tự này. Mỗi thứ cắt xong sản phẩm vẫn đủ 4 phòng hoàn chỉnh:

1. **Task 8, Step 1** — bỏ `RouteLine` và lời gọi nó trong `WorldMap`, chỉ giữ chấm sáng đổi trạng thái.
2. **Task 7, Step 6** — bỏ `CycleRing` và lời gọi nó trong `Room3`, chỉ giữ ba cung tròn và panel nội dung.
3. **Task 9, Step 6–7** — bỏ `DndContext`, `useDraggable`, `useDroppable`; giữ `GroupCard` như nút bấm thường và `UnityCircle` như hình tĩnh.

## Ánh xạ task theo lịch 6 ngày

| Ngày | Task |
|---|---|
| 1 | Task 1 |
| 2 | Task 2, Task 3, Task 4, Task 5 |
| 3 | Task 6, Task 7 |
| 4 | Task 8 |
| 5 | Task 9 |
| 6 | Task 10 |

Thực thi đúng thứ tự task từ 1 đến 10, không đảo. Ràng buộc phụ thuộc: task 4 cần `rooms` và `types.ts` từ task 3; task 6 và 8 cần `useStepIndex` từ task 2; task 7 và 9 cần `useReducedMotion` từ task 5; task 9 cần `polar` từ task 7.
