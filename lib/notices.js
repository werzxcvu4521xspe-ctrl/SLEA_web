export const NOTICE_STORAGE_KEY = 'sejong_notice_channel_posts';

export const DEFAULT_NOTICE_IMAGE = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop';

export const NOTICE_CATEGORIES = ['전체', '협회 공지사항', '협회 활동'];

export const NOTICE_CATEGORY_MAP = {
  '공모전 정보': '협회 공지사항',
  '지원사업 정보': '협회 공지사항',
  '정기행사 안내': '협회 활동',
  '세로데이 모집': '협회 활동',
  '교육 안내': '협회 활동'
};

export function normalizeNoticeCategory(category) {
  return NOTICE_CATEGORY_MAP[category] || category;
}

export function normalizeNotice(notice) {
  return {
    ...notice,
    category: normalizeNoticeCategory(notice.category)
  };
}

export const DEFAULT_NOTICES = [
  {
    id: 1,
    title: '2026 세종 로컬 크리에이티브 혁신 제품 공모전 참가 기업 모집',
    date: '2026-06-28',
    category: '협회 공지사항',
    author: '협회 사무국',
    excerpt: '세종 로컬 제품의 디자인과 기술 아이디어를 발굴하는 공모전이 시작됩니다.',
    content: '세종시 소상공인 및 창업기업을 대상으로 혁신적인 로컬 제품 디자인 및 기술 아이디어를 공모합니다. 선정 시 최대 1,000만원 제품 고도화 자금 및 상장이 부여됩니다.',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1400&auto=format&fit=crop',
    pinned: true
  },
  {
    id: 2,
    title: '7월 세종 로컬 창업 네트워킹 데이 참가자 모집',
    date: '2026-06-25',
    category: '협회 활동',
    author: '네트워킹팀',
    excerpt: '나성동 로컬허브에서 브랜드 디렉팅 멘토링과 네트워킹 세션을 진행합니다.',
    content: '오는 7월 12일 나성동 로컬허브에서 마케팅 및 브랜드 디렉팅 전문가를 초빙하여 로컬 멘토링 데이를 개최합니다. 선착순 20명 모집 마감되오니 마이페이지에서 신청해 주시기 바랍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
    pinned: false
  },
  {
    id: 3,
    title: '하반기 세종로컬창업가협회 정기 상생 컨퍼런스 개최',
    date: '2026-06-20',
    category: '협회 활동',
    author: '운영위원회',
    excerpt: '로컬의 미래와 연대를 주제로 창업가, 기획자, 파트너 기관이 모입니다.',
    content: '세종시청 대강당에서 세종 로컬 창업가와 전국 로컬 기획자들이 한데 모여 로컬의 미래와 연대를 주제로 컨퍼런스를 개최합니다. 네트워킹 만찬이 제공됩니다.',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1400&auto=format&fit=crop',
    pinned: false
  },
  {
    id: 4,
    title: '로컬 브랜딩 마스터클래스 1기 수강생 선착순 모집',
    date: '2026-06-15',
    category: '협회 활동',
    author: '교육분과',
    excerpt: '브랜드 디자이너와 카피라이터가 직접 진행하는 4주 실무 워크숍입니다.',
    content: '현업 브랜드 디자이너와 카피라이터가 직강하는 4주 코스 실무 워크숍입니다. 정회원은 무료로 수강 가능하며 선착순 15명 선발 예정입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop',
    pinned: false
  },
  {
    id: 5,
    title: '세종 로컬 크리에이터 브랜드 아카이빙 등록 접수 안내',
    date: '2026-06-10',
    category: '협회 공지사항',
    author: '아카이브팀',
    excerpt: '세종에서 활동 중인 로컬 브랜드의 스토리를 기록하고 온라인에 소개합니다.',
    content: '세종로컬창업가협회에서는 세종시에서 활동 중인 로컬 크리에이터 및 소상공인들의 브랜드 스토리를 기록하고 널리 알리는 아카이빙 등록 사업을 진행하고 있습니다. 많은 관심과 참여 바랍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1400&auto=format&fit=crop',
    pinned: false
  }
];
