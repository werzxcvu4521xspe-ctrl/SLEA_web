export const DEFAULT_SERO_TALK_POSTS = [
  {
    id: 1,
    type: '자유 게시판',
    title: '세종 조치원 복숭아 캐릭터를 활용한 굿즈 패키지 피드백 부탁드립니다!',
    author: '조치원크리에이터',
    content: '올해 복숭아 축제에 맞춰 조치원 복숭아 캐릭터 굿즈 3종(키링, 그립톡, 에코백) 시안을 제작해 보았습니다. 로컬 브랜드로서 세종 시민분들께 친근하게 다가갈 수 있을지, 보완할 점이 있다면 자유롭게 의견 부탁드립니다!',
    userEmail: 'creator@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    comments: [
      { id: 101, author: '세종양조장', body: '복숭아 캐릭터가 너무 귀엽네요! 에코백 색상이 복숭아 핑크빛 톤으로 화사하게 들어가면 좋겠어요.', createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString() },
      { id: 102, author: '한옥스테이세종', body: '그립톡은 실물 굿즈가 나오면 저희 게스트하우스 어메니티나 판매용으로도 샵인샵 입점하고 싶습니다!', createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString() }
    ]
  },
  {
    id: 2,
    type: 'MOU 제안',
    title: '로컬 F&B 회원사 공동 원두 소싱 및 물류 공동망 구축 제안',
    author: '커피랩세종',
    content: '현재 세종시 내 개인 로컬 카페들이 원두 생두를 각자 소싱하다 보니 단가 경쟁력이 낮습니다. 뜻이 맞는 5개 이상의 F&B 회원사분들과 함께 생두 공동 구매 및 로컬 통합 물류 보관소를 셰어링하여 비용을 절감하는 MOU 체결을 제안합니다.',
    userEmail: 'coffeelab@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    comments: [
      { id: 201, author: '디저트 카페 도원', body: '원두 공동구매 아주 찬성합니다! 저희 매장도 매월 원두 소모량이 많은데 함께 단가를 낮춰보면 큰 도움이 되겠네요.', createdAt: new Date(Date.now() - 3600000 * 4).toISOString() }
    ]
  },
  {
    id: 3,
    type: '콜라보 프로젝트',
    title: '[팀원 모집] 로컬 한옥 게스트하우스 주말 팝업 스토어 콜라보 브랜드 모집',
    author: '한옥스테이세종',
    content: '고운동 한옥마을 스테이 마당에서 매주 토요일 오후에 소규모 야외 마켓 팝업을 열 계획입니다. 디저트, 플라워, 핸드메이드 소품 브랜드를 운영하시는 회원사분들 중 공간을 셰어하여 함께 시너지를 낼 파트너를 모십니다.',
    userEmail: 'stay@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    comments: []
  },
  {
    id: 4,
    type: '자유 게시판',
    title: '신작 로컬 전통주 시음회에 협회 회원사 분들을 초대합니다',
    author: '세종양조장',
    content: '세종 쌀을 100% 사용하여 빚은 신제품 약주 출시를 앞두고 최종 피드백을 받고자 합니다. 이번 주 금요일 저녁 7시, 양조장 시음실에서 회원사분들을 모시고 편안하게 의견을 나누는 자리를 마련했으니 편하게 참석해 주세요!',
    userEmail: 'brewery@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    comments: [
      { id: 401, author: '조치원크리에이터', body: '전통주 시음회 꼭 가고 싶습니다! 어울리는 로컬 굿즈 페어링도 같이 고민해보면 재밌을 것 같아요.', createdAt: new Date(Date.now() - 3600000 * 18).toISOString() }
    ]
  },
  {
    id: 5,
    type: 'MOU 제안',
    title: '세종 청년 예술가 네트워크와 협회 공간 제휴 제안',
    author: '아트세종',
    content: '공실이나 유휴 벽면 공간을 보유하고 계신 회원사 매장(카페, 서점, 공유오피스 등)에 저희 청년 작가들의 작품을 무상으로 전시해 드리고, 판매 시 수익을 배분하는 문화공간 상생 MOU를 제안하고 싶습니다. 관심 있으신 대표님 연락 주세요!',
    userEmail: 'art@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    comments: []
  },
  {
    id: 6,
    type: '자유 게시판',
    title: '나성동 공유주방 입주 희망하시는 소상공인분 계신가요?',
    author: '공유세종',
    content: '나성동 중심가에 위치한 40평 규모의 공유주방 공간입니다. 베이킹, 밀키트 제조업체 등 2~3개 팀이 공간과 설비를 분할해서 임대하면 보증금과 월세를 크게 아낄 수 있습니다. 함께 입주하여 임대료 절감하실 파트너 모집합니다.',
    userEmail: 'kitchen@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    comments: []
  },
  {
    id: 7,
    type: '콜라보 프로젝트',
    title: '세종 복숭아 시즌 디저트 & 굿즈 팝업스토어 기획단 모집',
    author: '디저트 카페 도원',
    content: '복숭아 수확 시기에 맞추어 세종시청 로비 또는 로컬 복합 문화공간에서 3일간 팝업스토어를 운영하고자 합니다. F&B 제조, 디자인 굿즈, 공간 연출 및 이벤트 기획에 관심 있는 창업가분들을 공동 기획단으로 모십니다.',
    userEmail: 'dowon@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    comments: []
  },
  {
    id: 8,
    type: '자유 게시판',
    title: '로컬 크리에이터 활성화 지원사업 신청서 피드백 품앗이해요!',
    author: '로컬플래너',
    content: '이번 세종시 로컬 크리에이터 지원사업 공고 신청서 작성 중인데, 서로 기획안 읽어보고 제3자 관점에서 피드백 나누실 대표님 계신가요? 이번 주 수요일 저녁 조치원 로컬허브에서 커피 한잔하며 가볍게 워크숍 진행해봐요.',
    userEmail: 'planner@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    comments: []
  },
  {
    id: 9,
    type: 'MOU 제안',
    title: '세종 로컬 독립서점 연합 독서 배송망 구축 제안',
    author: '책방세종',
    content: '세종 내 독립서점들이 배송비를 아끼고 지역 주민들께 빠른 도서 전달 서비스를 제공하기 위해, 서점 공동 배송 거점 및 소형 친환경 퀵 배송업체와 다자간 업무협약(MOU) 체결을 제안합니다. 관심 있는 서점 대표님들의 의견 환영합니다.',
    userEmail: 'book@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 84).toISOString(),
    comments: []
  },
  {
    id: 10,
    type: '콜라보 프로젝트',
    title: '[팀원 모집] 조치원 전통시장 홍보 숏폼 챌린지 1기 크루 모집',
    author: '미디어로컬',
    content: '조치원 전통시장의 유서 깊은 맛집들과 특색 있는 점포들을 젊은 감성의 숏폼 영상으로 홍보하는 프로젝트를 시작합니다. 영상 촬영, 릴스/쇼츠 채널 운영, 현장 인터뷰 진행 등을 함께할 대학생 및 청년 크리에이터분들을 찾고 있습니다.',
    userEmail: 'media@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    comments: []
  },
  {
    id: 11,
    type: '자유 게시판',
    title: '세종시 로컬 페스티벌 굿즈 셀러 참여 후기 및 팁 공유',
    author: '세종디자인',
    content: '지난 주말 로컬 페스티벌 마켓에 참여하면서 느낀 점들을 정리해 공유합니다. 카드 결제기 세팅, 관람객 동선 파악, 소형 브로셔 비치가 생각보다 매출에 큰 영향을 주었습니다. 세부 피드백이 궁금하신 분들은 글을 확인해 주세요!',
    userEmail: 'design@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 108).toISOString(),
    comments: []
  },
  {
    id: 12,
    type: '자유 게시판',
    title: '창업 1주년 기념 로컬 제품 무료 나눔 이벤트 진행합니다!',
    author: '밀마루 베이커리',
    content: '밀마루 베이커리가 오픈한 지 벌써 1년이 되었습니다. 성원해주신 협회 회원사 분들과 지역 주민분들께 보답하고자, 선착순 30분께 대표 제품인 쌀빵 세트를 무료로 증정해 드립니다. 많은 신청 부탁드립니다.',
    userEmail: 'milmaru@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    comments: []
  },
  {
    id: 13,
    type: '자유 게시판',
    title: '세종시 지역 특산품을 활용한 신메뉴 개발 고민 상담',
    author: '조치원크리에이터',
    content: '도토리나 밤 등 세종 인근의 또 다른 농산품을 활용해 건강 디저트 라인업을 개발하려고 준비 중입니다. 원재료 수급이나 가공 방법 등에 대해 조언해주실 수 있는 선배 회원사 대표님들의 조언을 구합니다.',
    userEmail: 'creator@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 132).toISOString(),
    comments: []
  },
  {
    id: 14,
    type: '자유 게시판',
    title: '초기 소상공인을 위한 세무/노무 기본 상식 요약 정리 자료',
    author: '세종세무노무',
    content: '창업 초기 가장 헷갈리기 쉬운 부가가치세 신고 요령과 알바생 고용 시 필수 노무 서류 작성을 정리한 PDF 가이드를 무료 배포합니다. 필요하신 회원사 분들은 편하게 다운로드 받아 참고해 주세요.',
    userEmail: 'tax@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 144).toISOString(),
    comments: []
  },
  {
    id: 15,
    type: '자유 게시판',
    title: '협회 커뮤니티 공간 이용 시 주차 및 예약 팁 공유합니다.',
    author: '협회 사무국',
    content: '나성동 로컬허브의 회의실 및 라운지 공간은 회원사라면 누구나 예약 후 무료 사용하실 수 있습니다. 다만 주차가 혼잡할 수 있으니 근처 공영주차장 이용을 추천해 드립니다. 자세한 이용 안내서 파일을 첨부합니다.',
    userEmail: 'office@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 156).toISOString(),
    comments: []
  },
  {
    id: 16,
    type: '자유 게시판',
    title: '세종시 창업기업 로컬 판로 개척 우수사례 인터뷰 공유',
    author: '세종스타트업',
    content: '대형 유통망 입점에 성공한 세종 지역 소상공인 3인의 인터뷰 핵심 요약본입니다. 입점 제안서 작성 노하우와 수수료 협상 시 유의할 점들을 공유하니 관심 있으신 분들은 꼭 읽어보세요!',
    userEmail: 'startup@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 168).toISOString(),
    comments: []
  },
  {
    id: 17,
    type: '자유 게시판',
    title: '회원사 홍보 브로셔 무료 비치 및 협회 라운지 거치 안내',
    author: '협회 사무국',
    content: '협회 라운지 입구에 회원사 전용 브로셔 거치대를 마련했습니다. 브로셔나 리플렛 비치를 희망하시는 회원사는 사무국으로 30부 내외를 전달해 주시면 예쁘게 진열해 드리겠습니다.',
    userEmail: 'office@sejong.com',
    createdAt: new Date(Date.now() - 3600000 * 180).toISOString(),
    comments: []
  }
];
