# Thiết kế: Hồ Chí Minh Digital Museum

**Ngày:** 2026-08-13
**Môn học:** HCM202 — Tư tưởng Hồ Chí Minh
**Loại sản phẩm:** Website tương tác (sản phẩm phi vật lý)
**Hạn:** dưới 1 tuần
**Cách nộp:** link web công khai, deploy trên Vercel

---

## 1. Mục tiêu và phạm vi

### Mục tiêu

Một website "bảo tàng số" gồm sảnh chính và 4 phòng trưng bày, mỗi phòng dùng một dạng
tương tác khác nhau để trình bày một khối kiến thức của môn học. Người xem đi hết 4 phòng
thì nắm được mạch: tư tưởng hình thành như thế nào, độc lập – tự do nghĩa là gì, nhà nước
thuộc về ai, và sức mạnh dân tộc đến từ đâu.

### Tiêu chí thành công

1. Bốn phòng chạy được đầy đủ trên desktop và điện thoại, không lỗi khi thao tác.
2. Nội dung mọi phòng truy vết được về chương và session cụ thể của môn học.
3. Người xem mới, không được hướng dẫn, vẫn tự đi hết tour và hiểu mỗi phòng nói gì.
4. Site deploy được, mở bằng link công khai, refresh ở bất kỳ route nào cũng không 404.

### Ngoài phạm vi

- Chương 1 và Chương 6 không có phòng riêng. Chương 1 chỉ góp một đoạn dẫn ở sảnh.
- Không quiz, không thanh tiến trình tham quan, không trang nguồn tài liệu.
- Không dùng ảnh chụp thật. Toàn bộ hình ảnh là SVG và typography.
- Không Three.js, không 3D thật, không backend, không cơ sở dữ liệu, không đa ngôn ngữ.

### Bản đồ nội dung

| Phòng | Nội dung | Chương | Deck nguồn |
|---|---|---|---|
| Sảnh | Lời dẫn | Chương 1 | Session 2, 3 |
| 01 | Hành trình hình thành tư tưởng | Chương 2 | Session 4, 5, 6 |
| 02 | Độc lập – Tự do | Chương 3 | Session 7 → 12 |
| 03 | Dân là gốc | Chương 4 | Session 13 → 17 |
| 04 | Đại đoàn kết | Chương 5 | Session 19 → 24 |

---

## 2. Lựa chọn kỹ thuật

**Stack: Vite + React 18 + TypeScript, React Router, Framer Motion, `@dnd-kit/core`,
CSS thuần với custom properties.** Build ra file tĩnh, deploy Vercel.

Lý do không dùng Next.js: dự án không có backend, không cần SEO, không cần server render.
Next.js chỉ thêm cấu hình và rủi ro hydration mà không đổi lại lợi ích nào.

Lý do không dùng Three.js: hiệu ứng nghiêng 3D của thẻ cửa làm được bằng CSS
`perspective` + `rotateX/rotateY`, cho kết quả gần tương đương với chi phí bằng một phần
nhỏ. Trong 6 ngày, một ngày rưỡi dành cho WebGL là một ngày rưỡi không dành cho nội dung.

Lý do dùng `@dnd-kit/core` thay vì tự viết kéo thả: thư viện lo sẵn chuột, cảm ứng và
bàn phím. Tự viết pointer math sẽ tốn khoảng một ngày và sinh lỗi vặt trên điện thoại.

**Điều hướng: sảnh là trang cuộn, mỗi phòng là một route riêng.** Không gộp 4 phòng vào
một trang cuộn dài, vì thao tác kéo timeline ở phòng 1 và kéo thả ở phòng 4 sẽ tranh chấp
với cuộn trang. Nút "Phòng trước / Phòng sau" ở cuối mỗi phòng giữ lại trải nghiệm đi tour
tuần tự.

Route: `/` (sảnh), `/phong-1`, `/phong-2`, `/phong-3`, `/phong-4`, `*` (404).

---

## 3. Kiến trúc

### Nguyên tắc: nội dung tách rời giao diện

Mỗi phòng có một file dữ liệu TypeScript. Component phòng chỉ là bộ hiển thị dữ liệu đó,
không chứa câu chữ hard-code. Sửa nội dung ngày cuối không đụng tới code layout.

### Cấu trúc thư mục

```
HCM-museum/
  index.html
  vercel.json                    chuyển mọi route về index.html
  vite.config.ts
  src/
    main.tsx
    App.tsx                      khai báo router
    routes/
      Hall.tsx                   sảnh
      Room1.tsx ... Room4.tsx    mỗi route lắp dữ liệu vào component phòng
      NotFound.tsx
    content/
      types.ts                   kiểu dữ liệu của cả 4 phòng
      hall.ts
      room1.ts room2.ts room3.ts room4.ts
    components/
      RoomShell.tsx              khung chung của mọi phòng
      RoomNav.tsx                nút phòng trước / phòng sau / về sảnh
      DoorCard.tsx               thẻ cửa ở sảnh
      Reveal.tsx                 hiện dần khi cuộn tới
      ErrorBoundary.tsx
    rooms/
      room1/  Timeline.tsx, MilestonePanel.tsx
      room2/  WorldMap.tsx, StoryPanel.tsx, RouteLine.tsx
      room3/  PeopleDiagram.tsx, CycleRing.tsx
      room4/  UnityCircle.tsx, GroupCard.tsx, StrengthBar.tsx
    hooks/
      useStepIndex.ts            logic chuyển mốc dùng chung phòng 1 và 2
    styles/
      tokens.css  base.css
  scripts/
    extract-slides.mjs           PPTX -> markdown thô
  docs/
    content-raw/                 đầu ra của script, không dùng trực tiếp
    superpowers/specs/           tài liệu này
```

### Ranh giới giữa các phần

`RoomShell` nhận `number`, `title`, `subtitle`, `children` và tự lo phần khung: số hiệu
phòng, tiêu đề, nút quay lại sảnh, `RoomNav` ở cuối. Bốn phòng dùng chung một khung, nên
chúng chắc chắn trông như cùng một bảo tàng, và sửa khung một lần là cả bốn phòng đổi theo.

Các component trong `rooms/` chỉ nhận props dữ liệu và callback, không tự đọc file content.
Route mới là chỗ nối dữ liệu với giao diện. Nhờ vậy component phòng test được độc lập.

`useStepIndex` giữ logic "đang ở bước thứ mấy trong n bước", **chặn biên chứ không quay
vòng** (ở mốc đầu bấm lùi thì đứng yên, ở mốc cuối bấm tiến thì đứng yên), hỗ trợ phím mũi
tên, và ghi nhớ tập các bước đã xem. Phòng 1 và phòng 2 dùng chung.

### Kiểu dữ liệu

```ts
// content/types.ts
export type Milestone = {
  year: string;          // "1911"
  place: string;         // "Bến Nhà Rồng, Sài Gòn"
  event: string;         // 1–2 câu
  meaning: string;       // 1–2 dòng ý nghĩa
  source: string;        // "Chương 2 — Session 4"
};

export type MapStop = {
  id: string;
  label: string;         // "Paris"
  x: number; y: number;  // toạ độ trong viewBox của bản đồ SVG
  event: string;
  link: string;          // nối sự kiện với luận điểm độc lập – tự do
  source: string;
};

export type PeopleFacet = {
  id: 'cua-dan' | 'do-dan' | 'vi-dan';
  title: string;         // "CỦA DÂN"
  short: string;         // một dòng
  detail: string;        // đoạn mở rộng khi bấm
  source: string;
};

export type UnityGroup = {
  id: string;
  name: string;          // "Công nhân"
  message: string;       // câu ngắn hiện khi nhóm vào vòng
  source: string;
};
```

Mọi mục nội dung đều có `source`. Đây là ràng buộc kiểu, không phải quy ước — thiếu là
build đỏ. `source` chỉ tồn tại trong dữ liệu để truy vết khi bị hỏi "lấy từ đâu"; nó
**không hiển thị trên giao diện**, nên không mâu thuẫn với quyết định bỏ trang nguồn tài liệu.

---

## 4. Hệ thiết kế

Concept: **Historical Editorial Museum**. Nghiêm túc, học thuật, không màu mè kiểu game.

### Màu

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--ink` | `#0E0D0B` | nền chính, mực đen ngả nâu |
| `--ink-soft` | `#1A1815` | nền panel, thẻ |
| `--paper` | `#EDE6D8` | chữ chính, màu giấy ngà |
| `--paper-dim` | `#A8A092` | chữ phụ, chú thích |
| `--accent` | `#B3271E` | đỏ son, màu nhấn duy nhất |
| `--accent-soft` | `#C9A227` | vàng đồng, chi tiết phụ |
| `--line` | `rgba(237,230,216,.14)` | đường kẻ mảnh |

Đỏ son chỉ dùng cho điểm nhấn thật sự: mốc đang chọn, viền thẻ khi rê chuột, thanh sức
mạnh. Không dùng đỏ cho chữ dài.

### Chữ

Tiêu đề: **Playfair Display** (có bộ dấu tiếng Việt đầy đủ), cỡ lớn, letter-spacing âm nhẹ.
Thân bài: **Be Vietnam Pro**, 16–18px, line-height 1.7.
Số hiệu phòng và năm: Playfair Display cỡ rất lớn, dùng như một phần đồ hoạ.

Nạp font qua Google Fonts với `display=swap`.

### Chuyển động

Chuyển động phản hồi thao tác — hover, nghiêng thẻ, đổi panel, chuyển mốc — dài 250–400ms,
easing ease-out, không bounce, không xoay quá 8 độ.

Chuyển động nền lặp vô hạn là ngoại lệ và có trần riêng: nhịp chậm, 2–10 giây mỗi chu kỳ,
biên độ nhỏ. Đây là tín hiệu gợi ý chứ không phải phản hồi, nên ép nó về 400ms sẽ thành
giật như đèn báo lỗi. Hai chuyển động thuộc nhóm này: mũi tên gợi ý cuộn ở sảnh, và chấm
sáng chạy quanh vòng tuần hoàn ở phòng 3.

Mọi animation, cả hai nhóm, bọc trong kiểm tra `prefers-reduced-motion: reduce` — khi bật,
chuyển động thu về đổi opacity hoặc dừng hẳn.

---

## 5. Đặc tả từng màn

### 5.1 Sảnh (`/`)

Màn hình một, chiếm trọn viewport: tiêu đề HỒ CHÍ MINH DIGITAL MUSEUM, phụ đề "Hành trình
khám phá Tư tưởng Hồ Chí Minh", một đoạn dẫn ngắn rút từ Chương 1, mũi tên gợi ý cuộn có
chuyển động lên xuống nhẹ.

Màn hình hai: bốn `DoorCard` xếp hàng ngang trên desktop, chồng dọc dưới 768px. Mỗi thẻ
gồm số hiệu 01–04 cỡ lớn, tên phòng, một dòng mô tả, và một hoạ tiết SVG riêng của phòng.

Rê chuột: thẻ nghiêng theo vị trí con trỏ bằng `perspective(900px) rotateX/rotateY`, giới
hạn 8 độ; viền đỏ son sáng dần; chữ tăng độ sáng. Rời chuột thì về vị trí gốc trong 300ms.
Trên thiết bị cảm ứng, bỏ hiệu ứng nghiêng, chỉ giữ trạng thái nhấn.

Bấm thẻ điều hướng sang route tương ứng. Thẻ là thẻ `<a>` thật, nên mở tab mới và điều
khiển bằng bàn phím đều hoạt động.

**Không làm:** cánh cửa mở thật, hiệu ứng WebGL.

### 5.2 Phòng 1 — Hành trình hình thành tư tưởng (`/phong-1`)

Đường timeline ngang vẽ bằng SVG, 6 mốc: 1890, 1911, 1920, 1930, 1941, 1969.

Ba cách chuyển mốc, tất cả đều phải hoạt động:
1. Bấm trực tiếp vào mốc.
2. Phím mũi tên trái/phải khi timeline đang được focus.
3. Kéo ngang trên đường timeline (con trỏ hoặc ngón tay), thả thì bám vào mốc gần nhất.

Khi đổi mốc, một chấm sáng có vệt đuôi trượt dọc đường timeline tới mốc mới (Framer Motion
`layoutId`). `MilestonePanel` bên dưới đổi nội dung bằng cross-fade cộng trượt lên 8px:
năm cỡ lớn, địa điểm, sự kiện, ý nghĩa.

Dưới 768px: timeline cuộn ngang với `scroll-snap`, mốc đang chọn tự cuộn vào giữa.

**Không làm:** hình con tàu chạy trên timeline. Chấm sáng có vệt đuôi đủ diễn đạt ý.

### 5.3 Phòng 2 — Độc lập, Tự do (`/phong-2`)

Bản đồ thế giới SVG dạng đường viền tối giản, tô một màu `--ink-soft`, viền `--line`.
Năm điểm dừng: Bến Nhà Rồng, Paris, Moscow, Quảng Châu, Pác Bó.

Điểm chưa chọn là chấm nhỏ màu `--paper-dim` có nhịp đập rất nhẹ. Bấm vào thì chấm chuyển
đỏ son và `StoryPanel` bên phải (dưới bản đồ trên mobile) mở ra: tên địa điểm, sự kiện, và
một đoạn nối sự kiện đó với luận điểm độc lập – tự do.

Khi chuyển từ điểm A sang điểm B, `RouteLine` vẽ một đường cong sáng nối hai điểm bằng
animation `stroke-dashoffset` trong 600ms rồi mờ dần còn 25% độ đậm, để lại dấu vết hành
trình. Đường đã đi giữ lại trên bản đồ đến hết phiên.

Ngoài bấm chuột, phím mũi tên trái/phải cũng chuyển giữa 5 điểm theo thứ tự hành trình —
đây là lý do phòng 1 và phòng 2 dùng chung `useStepIndex`.

`useStepIndex` giữ tập id các điểm đã xem. Khi tập này đủ 5 phần tử, một dải chữ hiện ở
cuối: "Không có gì quý hơn độc lập, tự do."

**Không làm:** zoom, pan, thư viện bản đồ, GeoJSON.

**Rủi ro tài nguyên:** cần một file SVG bản đồ thế giới thuộc miền công cộng. Nếu không
tìm được bản sạch giấy phép trong 30 phút, chuyển sang phương án dự phòng: bản đồ trừu
tượng gồm lưới toạ độ mảnh cộng nhãn địa danh đặt đúng tương quan vị trí. Phương án dự
phòng vẫn giữ được ý "hành trình xuyên lục địa" và không cần tài nguyên ngoài.

### 5.4 Phòng 3 — Dân là gốc (`/phong-3`)

Chính giữa là vòng tròn NHÂN DÂN. Ba cung tròn bao quanh: CỦA DÂN, DO DÂN, VÌ DÂN, mỗi cung
chiếm 120 độ, cách nhau bằng khe hở mảnh.

Bấm một cung: cung đó dày lên và chuyển sang đỏ son, hai cung còn lại giảm còn 35% độ đậm,
panel bên dưới hiện `detail` của cung đó. Bấm lại cung đang chọn thì trở về trạng thái ban
đầu. Điều khiển được bằng bàn phím: mỗi cung là một `<button>` trong SVG.

Bên cạnh là `CycleRing`: bốn nút Nhân dân → Nhà nước → Chính sách → Nhân dân đặt trên một
vòng tròn, một chấm sáng chạy vòng liên tục trong 8 giây mỗi vòng. Chấm sáng làm rõ đây là
quan hệ hai chiều chứ không phải ba ô kiến thức rời rạc. Khi `prefers-reduced-motion` bật,
chấm sáng đứng yên và các mũi tên hiện tĩnh.

### 5.5 Phòng 4 — Đại đoàn kết (`/phong-4`)

Vòng tròn ĐẠI ĐOÀN KẾT TOÀN DÂN TỘC ở giữa, ban đầu chỉ là đường viền mảnh mờ. Tám thẻ
nhóm rải quanh: Công nhân, Nông dân, Trí thức, Thanh niên, Phụ nữ, Các dân tộc, Các tôn
giáo, Kiều bào.

Hai cách đưa nhóm vào vòng, cả hai đều bắt buộc:
1. Kéo thẻ thả vào vòng tròn (`@dnd-kit/core`, hỗ trợ chuột, cảm ứng, bàn phím).
2. Bấm vào thẻ.

Mỗi lần một nhóm vào vòng:
- Vòng tròn sáng thêm một bậc (viền dày hơn, quầng sáng đỏ son đậm hơn).
- Thanh "Sức mạnh đoàn kết" tăng 12,5%, chạy mượt tới giá trị mới.
- Câu `message` của nhóm hiện trong 3 giây rồi mờ đi.
- Thẻ nhóm bay về vị trí của nó trên vành vòng tròn.

Khi đủ 8 nhóm: vòng khép kín thành một vành liền sáng, thanh sức mạnh đạt 100%, và hiện
câu "Đoàn kết, đoàn kết, đại đoàn kết — Thành công, thành công, đại thành công." kèm nút
"Làm lại" đưa mọi thứ về trạng thái đầu.

Trạng thái chỉ nằm trong bộ nhớ, không lưu localStorage. Rời trang là làm lại từ đầu.

---

## 6. Đường đi của nội dung

**Bước 1 — trích thô.** `scripts/extract-slides.mjs` mở PPTX như file zip, đọc
`ppt/slides/slideN.xml`, rút mọi `<a:t>`, ghi ra `docs/content-raw/chuong-N.md` kèm số
session và số slide. Script chỉ chạy tay khi cần, không nằm trong quy trình build.

Đã kiểm chứng khả thi: mỗi deck khoảng 9–20 slide, chữ rút ra sạch và đúng nội dung chương.
Dung lượng file lớn là do các model 3D `.glb` nhúng trong slide, không ảnh hưởng việc rút chữ.

**Bước 2 — biên tập.** Từ bản thô, viết thành `src/content/room1.ts` đến `room4.ts` theo
đúng kiểu dữ liệu ở mục 3. Mỗi mục ghi `source` trỏ về chương và session.

**Bước 3 — duyệt.** Toàn bộ câu chữ nằm trong 5 file content. Đọc lại và sửa ở đó.

---

## 7. Phòng hờ lỗi

| Tình huống | Cách xử lý |
|---|---|
| Một phòng lỗi lúc chạy | `ErrorBoundary` riêng từng route: ba phòng kia và sảnh vẫn sống |
| Route lạ | Trang 404 có nút về sảnh |
| Thiếu trường nội dung | Kiểu TypeScript bắt lúc build, không phải lúc demo |
| Font tải chậm | `font-display: swap` |
| Kéo thả trục trặc | Đường bấm-để-thêm luôn song song ở phòng 4 |
| Refresh tại `/phong-2` ra 404 | `vercel.json` chuyển mọi đường dẫn về `index.html` |
| Người dùng bật giảm chuyển động | Mọi animation thu về đổi opacity |

Lỗi SPA refresh 404 là lỗi kinh điển và phải xử lý ngay ngày đầu, không để đến cuối.

---

## 8. Kiểm thử

Tương xứng với quy mô và thời hạn. Không dựng bộ test giao diện đầy đủ.

**Tự động:**
- `tsc --noEmit` với `strict: true`, chạy trước mỗi lần deploy.
- Vitest cho logic thuần: `useStepIndex` (chặn biên ở hai đầu, tập đã-xem cộng dồn đúng),
  tính điểm sức mạnh đoàn kết ở phòng 4 (thêm trùng nhóm không tăng điểm hai lần, đủ 8
  nhóm ra đúng 100%).

**Thủ công — checklist chạy trước khi nộp:**
1. Bốn phòng vào được từ sảnh và từ nút Phòng trước/sau.
2. Refresh tại từng route, không route nào 404.
3. Điện thoại: chạm dùng được mọi tương tác ở cả 4 phòng.
4. Bàn phím: Tab đi hết được sảnh và 4 phòng, Enter kích hoạt đúng.
5. Bật giảm chuyển động, không phòng nào vỡ bố cục.
6. Kiểm tra chính tả và dấu tiếng Việt trong 5 file content.
7. Mở link production trên một máy khác, không phải máy phát triển.

---

## 9. Lịch làm 6 ngày

| Ngày | Việc |
|---|---|
| 1 | Dựng khung Vite + React + TS, `tokens.css`, `RoomShell`, `RoomNav`, router, `ErrorBoundary`, `vercel.json`, **deploy bản rỗng lên Vercel** |
| 2 | `extract-slides.mjs`, biên tập 5 file content, dựng Sảnh với `DoorCard` |
| 3 | Phòng 1 (timeline) và Phòng 3 (infographic) |
| 4 | Phòng 2 (bản đồ, đường sáng nối điểm) |
| 5 | Phòng 4 (kéo thả, thanh sức mạnh, trạng thái hoàn thành) |
| 6 | Điện thoại, giảm chuyển động, checklist QA, tinh chỉnh, deploy bản cuối |

Deploy bản rỗng ngay ngày 1 để mọi bất ngờ về cấu hình nổ ra khi còn 5 ngày dự phòng.

**Thứ tự cắt nếu hụt thời gian:**
1. Bỏ đường sáng nối điểm ở phòng 2, chỉ giữ chấm sáng đổi trạng thái.
2. Bỏ `CycleRing` ở phòng 3, chỉ giữ ba cung tròn.
3. Bỏ kéo thả ở phòng 4, chỉ giữ bấm-để-thêm.

Cắt cả ba thứ này thì site vẫn đủ 4 phòng hoàn chỉnh và vẫn kể trọn câu chuyện.

---

## 10. Những quyết định đã chốt và lý do

| Quyết định | Lý do |
|---|---|
| Vite thay vì Next.js | Không backend, không SEO, không SSR — Next.js chỉ thêm cấu hình |
| Không Three.js | CSS perspective cho hiệu ứng tương đương với chi phí nhỏ hơn nhiều |
| Route riêng cho mỗi phòng | Tránh tranh chấp giữa thao tác trong phòng và cuộn trang |
| Không ảnh chụp thật | Không rủi ro bản quyền, không xử lý ảnh, hợp phong cách editorial |
| `@dnd-kit` thay vì tự viết | Có sẵn cảm ứng và bàn phím, tiết kiệm khoảng một ngày |
| Nội dung nằm trong file TS riêng | Sửa câu chữ ngày cuối không đụng code layout |
| Không quiz, không tiến trình, không trang nguồn | Dồn toàn bộ thời gian cho chất lượng 4 phòng |
