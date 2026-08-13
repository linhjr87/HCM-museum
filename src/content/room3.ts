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
