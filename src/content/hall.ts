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
