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
