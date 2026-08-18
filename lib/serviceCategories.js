export const SERVICE_CATEGORIES = [
  {
    slug: 'notice',
    number: '1',
    title: '공지사항',
    shortTitle: '공지사항',
    href: '/notice',
    eyebrow: 'Notice & Activity',
    description: '협회 공지사항과 협회 활동 소식을 한곳에서 확인합니다.',
    topics: ['협회공지사항', '협회 활동', '행사 모집', '지원사업 안내'],
    features: [
      '이미지와 함께 공지 카드 등록',
      '중요 공지 상단 고정',
      '행사/교육/지원사업 카테고리 필터',
      '공지 채널 구독 신청'
    ]
  },
  {
    slug: 'sero-day',
    number: '2',
    title: '세로 데이',
    shortTitle: '세로 데이',
    href: '/sero-day',
    eyebrow: 'Sero Networking Day',
    description: '세종 로컬 창업가가 만나고 연결되는 정기 네트워킹데이입니다.',
    topics: ['정기 네트워킹', '참가 신청', '참여자 매칭', '행사 후기'],
    features: [
      '회차별 일정 및 장소 안내',
      '참가자 네트워킹 관심사 접수',
      '참여 브랜드 미리보기',
      '행사 후기 및 사진 아카이브'
    ]
  },
  {
    slug: 'sero-members',
    number: '3',
    title: '세로 회원사',
    shortTitle: '세로 회원사',
    href: '/sero-members',
    eyebrow: 'Member Stories',
    description: '회원 기업별 인터뷰 영상과 SNS 콘텐츠를 소개합니다.',
    topics: ['회원 기업 인터뷰 영상', 'SNS 콘텐츠', '브랜드 스토리', '콘텐츠 제보'],
    features: [
      '회원사 인터뷰 영상 큐레이션',
      'SNS 숏폼 콘텐츠 모음',
      '브랜드별 콘텐츠 캘린더',
      '신규 콘텐츠 제보 신청'
    ]
  },
  {
    slug: 'sero-ai-start',
    number: '4',
    title: '세로 AI 스타트',
    shortTitle: 'AI 스타트',
    href: '/sero-ai-start',
    eyebrow: 'AI Start Toolkit',
    description: 'AI 사업계획서 작성 서비스',
    topics: ['준비중'],
    features: [
      '서비스 내용을 준비하고 있습니다'
    ]
  },
  {
    slug: 'mentoring-day',
    number: '5',
    title: '멘토링 데이',
    shortTitle: '멘토링 데이',
    href: '/mentoring-day',
    eyebrow: '1:1 Mentoring Day',
    description: '분야별 전문가와 연결되는 1:1 멘토링 및 컨설팅 프로그램입니다.',
    topics: ['멘토링 신청', '분야별 전문가 매칭', '상담 이력', '후속 과제'],
    features: [
      '브랜딩/마케팅/세무/유통 분야 선택',
      '상담 희망 일정 접수',
      '멘토링 요청 내용 저장',
      '사전 준비 체크리스트 제공'
    ]
  },
  {
    slug: 'sero-shop',
    number: '6',
    title: '세로 쇼핑',
    shortTitle: '세로 쇼핑',
    href: '/sero-shop',
    eyebrow: 'Sero Shopping',
    description: '회원사 상품을 모아 소개하고 구매로 연결하는 쇼핑몰입니다.',
    topics: ['회원사 상품 쇼핑몰', '상품 검색', '장바구니', '상품 등록 신청'],
    features: [
      '회원사 상품 카드형 목록',
      '카테고리별 상품 필터',
      '간이 장바구니 기능',
      '판매 상품 등록 신청'
    ]
  },
  {
    slug: 'sero-talk',
    number: '7',
    title: '세로 토크',
    shortTitle: '세로 토크',
    href: '/sero-talk',
    eyebrow: 'Sero Talk Board',
    description: '자유 게시판, MOU 제안, 콜라보 프로젝트를 연결하는 소통 채널입니다.',
    topics: ['자유 게시판', 'MOU 제안', '콜라보 프로젝트', '사업 정보 공유'],
    features: [
      '주제별 게시판 전환',
      '협업/MOU 제안 작성',
      '프로젝트 참여자 모집',
      '게시글 검색 및 분류'
    ]
  }
];

export function getServiceCategory(slug) {
  return SERVICE_CATEGORIES.find((category) => category.slug === slug);
}
