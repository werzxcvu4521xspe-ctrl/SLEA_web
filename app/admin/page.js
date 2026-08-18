'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { SERVICE_CATEGORIES } from '@/lib/serviceCategories';
import Link from 'next/link';

const CONTENT_STORAGE_KEY = 'sejong_site_content_sections';
const MENTORING_STORAGE_KEY = 'sejong_mentoring_requests';
const MEMBER_STORAGE_KEY = 'sejong_admin_members';
const PENDING_REGISTRATION_STORAGE_KEY = 'sejong_pending_registrations';

const ROLE_OPTIONS = [
  { value: 'super_admin', label: '최고 관리자', shortLabel: 'Level 2', description: '전체 운영 권한' },
  { value: 'staff_admin', label: '일반 관리자', shortLabel: 'Level 1', description: '회원·콘텐츠 운영' },
  { value: 'entrepreneur', label: '정회원', shortLabel: 'Member', description: '브랜드 활동 회원' },
  { value: 'visitor', label: '일반 회원', shortLabel: 'Visitor', description: '커뮤니티 열람 회원' }
];

const STATUS_OPTIONS = [
  { value: 'active', label: '활성' },
  { value: 'pending', label: '검토중' },
  { value: 'paused', label: '일시정지' },
  { value: 'left', label: '탈퇴' }
];

const DEFAULT_SITE_SECTIONS = [
  {
    id: 'home-hero',
    page: '홈',
    area: '메인 히어로',
    title: '세종 로컬 창업가를 연결하는 공식 협회 플랫폼',
    subtitle: '회원 브랜드 아카이브, 정기 네트워킹, 창업 지원 자료, 파트너십을 한곳에서 연결합니다.',
    body: '첫 방문자가 협회의 정체성과 핵심 이동 경로를 바로 이해할 수 있도록 첫 화면 메시지를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
    ctaLabel: '협회 회원으로 시작하기',
    ctaHref: '/signup',
    status: 'published',
    updatedAt: '2026-07-16'
  },
  {
    id: 'home-archive',
    page: '홈',
    area: '신규 창업가 브랜드',
    title: '새로 등록된 세종 창업가 브랜드',
    subtitle: 'New Archives',
    body: '메인 화면에서 최근 등록 브랜드 카드와 전체 아카이브 이동 버튼을 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1400&auto=format&fit=crop',
    ctaLabel: '전체 보기',
    ctaHref: '/archive',
    status: 'published',
    updatedAt: '2026-07-16'
  },
  {
    id: 'about-intro',
    page: '협회소개',
    area: '소개&설립 목적',
    title: '협회소개',
    subtitle: '당신이 중심이 되는 로컬, 세계를 움직이는 세종의 엔진.',
    body: '협회 설립 목적, 미션, 비전, 임원진, MOU 기관 현황을 소개하는 섹션입니다.',
    imageUrl: '',
    ctaLabel: '협회활동 보기',
    ctaHref: '/about#intro',
    status: 'published',
    updatedAt: '2026-07-16'
  },
  {
    id: 'about-leaders',
    page: '협회소개',
    area: '임원 및 자문 위원',
    title: '임원 및 자문 위원',
    subtitle: '세종 로컬 생태계를 함께 움직이는 운영진을 소개합니다.',
    body: '공동리더, 임원진, 분과장 소개 문구와 프로필 이미지, 역할 설명을 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '운영진 보기',
    ctaHref: '/about#leaders',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'about-history',
    page: '협회소개',
    area: '협회 연혁',
    title: '협회 연혁',
    subtitle: '창립부터 현재까지 세종 로컬 창업가 협회의 발자취입니다.',
    body: '연도별 주요 활동, 설립 이력, 성과 지표, 행사 기록을 타임라인 형태로 관리합니다.',
    imageUrl: '',
    ctaLabel: '연혁 보기',
    ctaHref: '/about#history',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'about-mou',
    page: '협회소개',
    area: 'MOU기관 현황',
    title: 'MOU기관 현황',
    subtitle: '협회와 함께하는 공공기관, 대학, 기업 파트너 네트워크입니다.',
    body: '협약 기관명, 협약일, 협력 분야, 기관 로고 및 링크를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '협력 기관 보기',
    ctaHref: '/about#mou',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'activities-program',
    page: '협회활동',
    area: '세로데이 (네트워킹)',
    title: '협회활동',
    subtitle: '세종의 창업가들을 연결하고 도약시키는 원동력.',
    body: '정기 네트워킹, 1:1 멘토링, 실무 교육, 팝업마켓 관련 안내 문구와 대표 이미지를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
    ctaLabel: '프로그램 확인',
    ctaHref: '/activities',
    status: 'published',
    updatedAt: '2026-07-16'
  },
  {
    id: 'activities-mentoring',
    page: '협회활동',
    area: '멘토링데이 (컨설팅)',
    title: '멘토링데이',
    subtitle: '브랜딩, 세무, 마케팅, 투자유치 전문가와 연결되는 1:1 컨설팅입니다.',
    body: '멘토링 신청 안내, 상담 분야, 멘토 소개, 신청 폼 설명 문구를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '멘토링 신청',
    ctaHref: '/activities?tab=mentoring',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'activities-education',
    page: '협회활동',
    area: '교육 · 특강',
    title: '교육 · 특강',
    subtitle: '로컬 브랜드 운영에 필요한 실무 교육과 특강을 제공합니다.',
    body: '강의명, 강사, 일정, 신청 조건, 교육 이미지 및 수강 안내를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '교육 일정 보기',
    ctaHref: '/activities?tab=education',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'activities-popup',
    page: '협회활동',
    area: '팝업마켓',
    title: '팝업마켓',
    subtitle: '세종 로컬 브랜드가 시민과 직접 만나는 오프라인 기획전입니다.',
    body: '팝업마켓 일정, 참가 브랜드, 장소, 신청 조건, 행사 대표 이미지를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '팝업마켓 보기',
    ctaHref: '/activities?tab=popup',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'archive-listing',
    page: '창업가 아카이브',
    area: '브랜드 목록',
    title: '창업가 아카이브',
    subtitle: '세종 로컬 브랜드와 대표자, 업종, 지역 정보를 탐색합니다.',
    body: '아카이브 목록, 카드 이미지, 브랜드 소개 요약, 지역 및 업종 필터 영역을 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=900&auto=format&fit=crop',
    ctaLabel: '브랜드 등록 신청',
    ctaHref: '/signup',
    status: 'published',
    updatedAt: '2026-07-16'
  },
  {
    id: 'members-register',
    page: '회원 & 쇼핑몰',
    area: '정회원 등록 신청',
    title: '정회원 등록 신청',
    subtitle: '세종 로컬 창업가 협회 정회원으로 브랜드를 등록하고 활동을 시작합니다.',
    body: '정회원 혜택, 가입 절차, 연회비, 신청서 입력 안내와 구글폼 링크를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '정회원 신청하기',
    ctaHref: '/members?tab=register',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'members-directory',
    page: '회원 & 쇼핑몰',
    area: '회원 디렉토리',
    title: '회원 디렉토리',
    subtitle: '업종, 지역, 협업 키워드로 세종 로컬 창업가를 탐색합니다.',
    body: '회원 검색/필터 안내, 디렉토리 카드 설명, 노출 기준과 협업 문구를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '회원 보기',
    ctaHref: '/members?tab=directory',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'shop-main',
    page: '회원 & 쇼핑몰',
    area: '브랜드관 (쇼핑몰)',
    title: '세종 로컬 쇼핑몰',
    subtitle: '협회 회원 브랜드의 상품과 공동구매 기획전을 소개합니다.',
    body: '브랜드 상품명, 가격, 상품 이미지, 공동구매 진행률, 입점 신청 안내를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=900&auto=format&fit=crop',
    ctaLabel: '입점 문의',
    ctaHref: '/shop',
    status: 'draft',
    updatedAt: '2026-07-16'
  },
  {
    id: 'shop-groupbuy',
    page: '회원 & 쇼핑몰',
    area: '공동구매 & 추천상품',
    title: '공동구매 & 추천상품',
    subtitle: '협회 회원 브랜드의 시즌 상품과 공동구매 기획전을 운영합니다.',
    body: '공동구매 상품명, 기간, 목표 수량, 진행률, 추천 상품 이미지와 상세 문구를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '공동구매 보기',
    ctaHref: '/shop?tab=group',
    status: 'draft',
    updatedAt: '2026-07-22'
  },
  {
    id: 'pr-media',
    page: '홍보 & 파트너',
    area: '기업 소개 & 인터뷰',
    title: '기업 소개 & 인터뷰',
    subtitle: '세종 로컬 창업가의 이야기를 영상과 기사로 전합니다.',
    body: '기업 소개 기사, 대표 인터뷰, 브랜드 스토리, 썸네일 이미지와 노출 문구를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1542204172-e70528091b50?q=80&w=900&auto=format&fit=crop',
    ctaLabel: '제보하기',
    ctaHref: '/pr?tab=intro',
    status: 'published',
    updatedAt: '2026-07-16'
  },
  {
    id: 'pr-videos',
    page: '홍보 & 파트너',
    area: '홍보영상 & 쇼츠',
    title: '홍보영상 & 쇼츠',
    subtitle: '브랜드 필름, 숏폼 영상, 현장 스케치로 로컬 브랜드를 알립니다.',
    body: '영상 제목, 썸네일, 재생 링크, 조회수, 카테고리와 카드 노출 문구를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '영상 보기',
    ctaHref: '/pr?tab=videos',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'partnership-main',
    page: '홍보 & 파트너',
    area: 'MOU 및 파트너십',
    title: 'MOU 및 파트너십',
    subtitle: '공공기관, 기업, 대학과 함께 로컬 창업 생태계를 확장합니다.',
    body: '파트너십 제안 안내, 협력 분야, 기관 소개, 문의 버튼 문구와 대표 이미지를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '제휴 문의',
    ctaHref: '/partnership',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'community-board',
    page: '커뮤니티 & 지원',
    area: '자유게시판 (협업)',
    title: '자유게시판',
    subtitle: '협업 제안, 사업 정보, 구인구직, 중고거래를 나누는 커뮤니티 공간입니다.',
    body: '게시판 소개, 카테고리 안내, 검색/글쓰기 영역 문구와 운영 기준을 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '게시판 보기',
    ctaHref: '/community',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'notice-channel',
    page: '커뮤니티 & 지원',
    area: '협회 공지사항',
    title: '협회 공지 채널',
    subtitle: '행사, 교육, 지원사업, 공모전 소식을 이미지 카드형 피드로 전합니다.',
    body: '공지 채널 히어로, 카테고리, 카드형 공지, 뉴스레터 구독 영역 문구를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
    ctaLabel: '공지 올리기',
    ctaHref: '/notice',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'support-center',
    page: '커뮤니티 & 지원',
    area: '창업지원센터 (자료실)',
    title: '창업지원센터',
    subtitle: '사업계획서, 피칭덱, 정부지원사업, AI 활용 자료를 모았습니다.',
    body: '다운로드 자료명, 파일 유형, 카테고리, 다운로드 수, 안내 문구를 관리합니다.',
    imageUrl: '',
    ctaLabel: '자료실 보기',
    ctaHref: '/support',
    status: 'published',
    updatedAt: '2026-07-16'
  },
  {
    id: 'proposal-page',
    page: '공통',
    area: '제휴·문의 신청',
    title: '제휴 및 문의',
    subtitle: '협회와 함께할 제휴, 후원, 협업 제안을 접수합니다.',
    body: '제휴 신청 폼 문구, 입력 항목 안내, 개인정보 동의 안내, 제출 버튼 문구를 관리합니다.',
    imageUrl: '',
    ctaLabel: '문의하기',
    ctaHref: '/proposal',
    status: 'published',
    updatedAt: '2026-07-22'
  },
  {
    id: 'footer-info',
    page: '공통',
    area: '푸터·연락처',
    title: '세종로컬창업가협회',
    subtitle: 'Sejong Local Entrepreneur Association',
    body: '사무국 소개, 이메일, 제휴 문의 안내, 개인정보처리방침 링크 등 공통 하단 정보를 관리합니다.',
    imageUrl: '',
    ctaLabel: '문의하기',
    ctaHref: '/proposal',
    status: 'published',
    updatedAt: '2026-07-16'
  }
];

const SERVICE_SECTION_IMAGES = {
  notice: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
  'sero-day': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
  'sero-members': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop',
  'sero-ai-start': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
  'mentoring-day': 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
  'sero-shop': 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
  'sero-talk': 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop'
};

const CURRENT_SITE_SECTIONS = [
  {
    id: 'home-hero',
    page: '홈',
    area: '메인 히어로',
    title: '세종 로컬 창업가를 연결하는 공식 협회 플랫폼',
    subtitle: '공지, 세로 데이, 회원사 콘텐츠, AI 창업 지원, 멘토링, 쇼핑, 토크 채널을 한곳에서 연결합니다.',
    body: '첫 방문자가 새 7개 서비스 카테고리와 핵심 이동 경로를 바로 이해할 수 있도록 첫 화면 메시지를 관리합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
    ctaLabel: '협회 회원으로 시작하기',
    ctaHref: '/signup',
    status: 'published',
    updatedAt: '2026-07-28'
  },
  ...SERVICE_CATEGORIES.flatMap((category) => (
    category.topics.map((topic, index) => ({
      id: `${category.slug}-${index + 1}`,
      page: category.title,
      area: topic,
      title: topic,
      subtitle: category.description,
      body: category.features[index] || `${category.title}의 ${topic} 콘텐츠, 대표 이미지, 버튼 문구, 링크와 노출 상태를 관리합니다.`,
      imageUrl: SERVICE_SECTION_IMAGES[category.slug] || '',
      ctaLabel: `${category.shortTitle} 열기`,
      ctaHref: category.href,
      status: 'published',
      updatedAt: '2026-07-28'
    }))
  )),
  {
    id: 'proposal-page',
    page: '공통',
    area: '제휴·문의 신청',
    title: '제휴 및 문의',
    subtitle: '협회와 함께할 제휴, 후원, 협업 제안을 접수합니다.',
    body: '제휴 신청 폼 문구, 입력 항목 안내, 개인정보 동의 안내, 제출 버튼 문구를 관리합니다.',
    imageUrl: '',
    ctaLabel: '문의하기',
    ctaHref: '/proposal',
    status: 'published',
    updatedAt: '2026-07-28'
  },
  {
    id: 'footer-info',
    page: '공통',
    area: '푸터·연락처',
    title: '세종로컬창업가협회',
    subtitle: 'Sejong Local Entrepreneur Association',
    body: '사무국 소개, 이메일, 제휴 문의 안내, 개인정보처리방침 링크 등 공통 하단 정보를 관리합니다.',
    imageUrl: '',
    ctaLabel: '문의하기',
    ctaHref: '/proposal',
    status: 'published',
    updatedAt: '2026-07-28'
  }
];

const mergeSectionsWithDefaults = (savedSections) => {
  if (!Array.isArray(savedSections) || savedSections.length === 0) return CURRENT_SITE_SECTIONS;

  const savedById = new Map(savedSections.map(section => [section.id, section]));
  const defaultIds = new Set(CURRENT_SITE_SECTIONS.map(section => section.id));
  const mergedDefaults = CURRENT_SITE_SECTIONS.map(section => ({
    ...section,
    ...(savedById.get(section.id) || {})
  }));
  const customSections = savedSections.filter(section => !defaultIds.has(section.id));

  return [...mergedDefaults, ...customSections];
};

const DEFAULT_MEMBERS = [
  {
    id: 'mem-1',
    name: '김태균',
    brand: '조치원 브루어리',
    email: 'brewery@sejonglocal.org',
    phone: '010-2244-1100',
    role: 'super_admin',
    status: 'active',
    joinedAt: '2024-03-10',
    memo: '초대 운영진. 대외협력 및 네트워킹 총괄.'
  },
  {
    id: 'mem-2',
    name: '박민수',
    brand: '로컬허브 나성',
    email: 'hub@sejonglocal.org',
    phone: '010-3344-7721',
    role: 'staff_admin',
    status: 'active',
    joinedAt: '2024-05-01',
    memo: '공간 대관 문의와 교육 프로그램 접수 담당.'
  },
  {
    id: 'mem-3',
    name: '이민수',
    brand: '디저트 카페 도원',
    email: 'dowon@sejonglocal.org',
    phone: '010-7188-2390',
    role: 'entrepreneur',
    status: 'active',
    joinedAt: '2025-01-12',
    memo: '로컬 농산물 공동구매 협업 의향 있음.'
  },
  {
    id: 'mem-4',
    name: '정소민',
    brand: '공방 세종',
    email: 'craft@sejonglocal.org',
    phone: '010-8731-6205',
    role: 'entrepreneur',
    status: 'paused',
    joinedAt: '2025-03-22',
    memo: '하반기 플리마켓 일정 조율 필요.'
  },
  {
    id: 'mem-5',
    name: '황정민',
    brand: '밀마루 베이커리',
    email: 'milmaru@sejonglocal.org',
    phone: '010-9901-4588',
    role: 'entrepreneur',
    status: 'active',
    joinedAt: '2025-09-18',
    memo: '쌀빵 납품 가능. 학교/기관 제휴 후보.'
  },
  {
    id: 'mem-6',
    name: '홍다은',
    brand: '세종 굿즈 팩토리',
    email: 'goods@sejonglocal.org',
    phone: '010-6422-1145',
    role: 'visitor',
    status: 'pending',
    joinedAt: '2026-06-19',
    memo: '정회원 전환 희망. 사업자등록증 확인 대기.'
  }
];

export default function AdminPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'super_admin', 'staff_admin', 'user', null
  const [activeSubTab, setActiveSubTab] = useState('home'); // 'home', 'approval', 'content', 'category', 'system'
  const [siteSections, setSiteSections] = useState(CURRENT_SITE_SECTIONS);
  const [selectedSectionId, setSelectedSectionId] = useState(CURRENT_SITE_SECTIONS[0].id);
  const [sectionFilter, setSectionFilter] = useState('all');
  const [mentoringRequests, setMentoringRequests] = useState([]);
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [memberQuery, setMemberQuery] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState('all');
  
  // Pending registrations simulation state
  const [pendingRegistrations, setPendingRegistrations] = useState([
    { id: 'reg-1', name: '홍길동', brand: '활빈 로컬 푸드', category: 'F&B', phone: '010-1111-2222', date: '2026-06-29', feePaid: false },
    { id: 'reg-2', name: '성춘향', brand: '광한루 전통 굿즈', category: 'Goods', phone: '010-3333-4444', date: '2026-06-28', feePaid: false },
    { id: 'reg-3', name: '이몽룡', brand: '어사 출두 공방', category: 'Craft', phone: '010-5555-6666', date: '2026-06-27', feePaid: false },
  ]);

  // Categories list simulation state
  const [categories, setCategories] = useState([
    { code: 'food', name: '식품 (F&B)', count: 12 },
    { code: 'craft', name: '공예 (Craft)', count: 7 },
    { code: 'goods', name: '굿즈 (Goods)', count: 9 },
    { code: 'beauty', name: '뷰티 (Beauty)', count: 4 },
    { code: 'pet', name: '반려동물 (Pet)', count: 3 },
    { code: 'fashion', name: '패션 (Fashion)', count: 6 },
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCode, setNewCatCode] = useState('');

  const [msg, setMsg] = useState({ type: '', text: '' });

  // Check role & override status
  const checkRole = useCallback(async () => {
    setLoading(true);
    
    // Check override first
    const override = localStorage.getItem('sejong_role_override');
    if (override) {
      if (override === 'none') {
        router.push('/login');
        return;
      }
      if (override === 'user') {
        alert('관리자 권한이 없습니다. 일반 계정은 마이페이지로 이동합니다.');
        router.push('/mypage');
        return;
      }
      setUserRole(override);
      setLoading(false);
      return;
    }

    // Fallback: Real session check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const role = session.user.user_metadata?.role;
    if (role !== 'super_admin' && role !== 'staff_admin') {
      alert('관리자 권한이 없습니다. 일반 계정은 마이페이지로 이동합니다.');
      router.push('/mypage');
      return;
    }

    setUserRole(role);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const roleCheckTimer = window.setTimeout(checkRole, 0);
    window.addEventListener('storage', checkRole);
    window.addEventListener('sejong_role_update', checkRole);
    return () => {
      window.clearTimeout(roleCheckTimer);
      window.removeEventListener('storage', checkRole);
      window.removeEventListener('sejong_role_update', checkRole);
    };
  }, [checkRole]);

  useEffect(() => {
    const storageLoadTimer = window.setTimeout(() => {
      const savedSections = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (!savedSections) return;

      try {
        const parsedSections = JSON.parse(savedSections);
        if (Array.isArray(parsedSections) && parsedSections.length > 0) {
          const mergedSections = mergeSectionsWithDefaults(parsedSections);
          setSiteSections(mergedSections);
          setSelectedSectionId(mergedSections[0].id);
        }
      } catch (error) {
        localStorage.removeItem(CONTENT_STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(storageLoadTimer);
  }, []);

  useEffect(() => {
    const requestLoadTimer = window.setTimeout(() => {
      const savedRequests = localStorage.getItem(MENTORING_STORAGE_KEY);
      if (!savedRequests) return;

      try {
        const parsedRequests = JSON.parse(savedRequests);
        if (Array.isArray(parsedRequests)) {
          setMentoringRequests(parsedRequests);
        }
      } catch (error) {
        localStorage.removeItem(MENTORING_STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(requestLoadTimer);
  }, []);

  useEffect(() => {
    const memberLoadTimer = window.setTimeout(() => {
      const savedMembers = localStorage.getItem(MEMBER_STORAGE_KEY);
      if (!savedMembers) return;

      try {
        const parsedMembers = JSON.parse(savedMembers);
        if (Array.isArray(parsedMembers) && parsedMembers.length > 0) {
          setMembers(parsedMembers);
        }
      } catch (error) {
        localStorage.removeItem(MEMBER_STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(memberLoadTimer);
  }, []);

  useEffect(() => {
    const registrationLoadTimer = window.setTimeout(() => {
      const savedRegistrations = localStorage.getItem(PENDING_REGISTRATION_STORAGE_KEY);
      if (!savedRegistrations) return;

      try {
        const parsedRegistrations = JSON.parse(savedRegistrations);
        if (Array.isArray(parsedRegistrations)) {
          setPendingRegistrations(parsedRegistrations);
        }
      } catch (error) {
        localStorage.removeItem(PENDING_REGISTRATION_STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(registrationLoadTimer);
  }, []);

  // Simulate Role Switching
  const handleSimulateRole = (role) => {
    localStorage.setItem('sejong_role_override', role);
    window.dispatchEvent(new Event('sejong_role_update'));
    setMsg({ type: 'success', text: `시뮬레이터: 권한이 [${role === 'super_admin' ? '최고 관리자 (Level 2)' : role === 'staff_admin' ? '일반 관리자 (Level 1)' : role === 'user' ? '일반 회원' : '비로그인'}] 상태로 전환되었습니다.` });
    
    if (role === 'user' || role === 'none') {
      checkRole();
    } else {
      setUserRole(role);
    }
  };

  // Actions
  const persistPendingRegistrations = (updater) => {
    setPendingRegistrations(prev => {
      const nextRegistrations = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(PENDING_REGISTRATION_STORAGE_KEY, JSON.stringify(nextRegistrations));
      return nextRegistrations;
    });
  };

  const handleApprove = (id, name) => {
    if (userRole !== 'super_admin') {
      setMsg({ type: 'error', text: '🔒 권한 부족: 회원 승인/반려 작업은 최고 관리자(Level 2)만 실행할 수 있습니다.' });
      return;
    }
    persistPendingRegistrations(prev => prev.filter(item => item.id !== id));
    setMsg({ type: 'success', text: `성공: [${name}] 대표님의 정회원 가입 신청이 최종 승인 처리되었습니다.` });
  };

  const handleReject = (id, name) => {
    if (userRole !== 'super_admin') {
      setMsg({ type: 'error', text: '🔒 권한 부족: 회원 승인/반려 작업은 최고 관리자(Level 2)만 실행할 수 있습니다.' });
      return;
    }
    persistPendingRegistrations(prev => prev.filter(item => item.id !== id));
    setMsg({ type: 'success', text: `반려: [${name}] 대표님의 정회원 가입 신청서가 반려 처리되었습니다.` });
  };

  const handleRegistrationFeePaidChange = (id, feePaid) => {
    if (userRole !== 'super_admin') {
      setMsg({ type: 'error', text: '권한 부족: 회비납부 여부 변경은 최고 관리자(Level 2)만 가능합니다.' });
      return;
    }

    persistPendingRegistrations(prev => prev.map(item => (
      item.id === id ? { ...item, feePaid } : item
    )));
    setMsg({ type: 'success', text: feePaid ? '회비납부 여부가 납부 확인됨으로 변경되었습니다.' : '회비납부 여부가 미납(확인중)으로 변경되었습니다.' });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName || !newCatCode) return;
    setCategories(prev => [...prev, { code: newCatCode.trim().toLowerCase(), name: newCatName.trim(), count: 0 }]);
    setNewCatName('');
    setNewCatCode('');
    setMsg({ type: 'success', text: `카테고리 [${newCatName}] 가 신규 추가되었습니다.` });
  };

  const handleDeleteCategory = (code, name) => {
    setCategories(prev => prev.filter(cat => cat.code !== code));
    setMsg({ type: 'success', text: `카테고리 [${name}] 가 삭제되었습니다.` });
  };

  const handleSectionFieldChange = (field, value) => {
    setSiteSections(prev => prev.map(section => (
      section.id === selectedSectionId
        ? { ...section, [field]: value, updatedAt: new Date().toISOString().slice(0, 10) }
        : section
    )));
  };

  const handleSectionImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleSectionFieldChange('imageUrl', reader.result);
      setMsg({ type: 'success', text: '대표 사진이 로컬 파일에서 업로드되어 미리보기에 반영되었습니다.' });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleSaveSections = () => {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(siteSections));
    setMsg({ type: 'success', text: '사이트 콘텐츠 수정사항이 관리자 브라우저에 저장되었습니다. 배포 반영용 JSON 내보내기도 가능합니다.' });
  };

  const handleResetSections = () => {
    setSiteSections(CURRENT_SITE_SECTIONS);
    setSelectedSectionId(CURRENT_SITE_SECTIONS[0].id);
    localStorage.removeItem(CONTENT_STORAGE_KEY);
    setMsg({ type: 'success', text: '콘텐츠 관리 섹션이 기본값으로 복원되었습니다.' });
  };

  const handleExportSections = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      sections: siteSections
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `sejong-site-content-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMsg({ type: 'success', text: '섹션별 콘텐츠 JSON 파일을 내보냈습니다.' });
  };

  const persistMentoringRequests = (nextRequests, successText) => {
    setMentoringRequests(nextRequests);
    localStorage.setItem(MENTORING_STORAGE_KEY, JSON.stringify(nextRequests));
    setMsg({ type: 'success', text: successText });
  };

  const handleMentoringStatusChange = (id, status) => {
    const nextRequests = mentoringRequests.map(request => (
      request.id === id ? { ...request, status } : request
    ));
    persistMentoringRequests(nextRequests, '멘토링 신청 처리 상태가 변경되었습니다.');
  };

  const handleDeleteMentoringRequest = (id) => {
    const nextRequests = mentoringRequests.filter(request => request.id !== id);
    persistMentoringRequests(nextRequests, '멘토링 신청 내역이 삭제되었습니다.');
  };

  const persistMembers = (nextMembers, successText = '') => {
    setMembers(nextMembers);
    localStorage.setItem(MEMBER_STORAGE_KEY, JSON.stringify(nextMembers));
    if (successText) {
      setMsg({ type: 'success', text: successText });
    }
  };

  const hasMultipleSuperAdmins = (targetId) => {
    const superAdmins = members.filter(member => member.role === 'super_admin');
    return superAdmins.length > 1 || superAdmins.every(member => member.id !== targetId);
  };

  const handleMemberRoleChange = (id, role) => {
    if (!isSuperAdmin) {
      setMsg({ type: 'error', text: '권한 부족: 기존 회원 권한 변경은 최고 관리자(Level 2)만 가능합니다.' });
      return;
    }
    const target = members.find(member => member.id === id);
    if (target?.role === 'super_admin' && role !== 'super_admin' && !hasMultipleSuperAdmins(id)) {
      setMsg({ type: 'error', text: '최고 관리자는 최소 1명 이상 유지되어야 합니다.' });
      return;
    }
    const nextMembers = members.map(member => (
      member.id === id ? { ...member, role } : member
    ));
    persistMembers(nextMembers, '회원 권한이 변경되었습니다.');
  };

  const handleMemberStatusChange = (id, status) => {
    if (!isSuperAdmin) {
      setMsg({ type: 'error', text: '권한 부족: 회원 상태 변경은 최고 관리자(Level 2)만 가능합니다.' });
      return;
    }
    const nextMembers = members.map(member => (
      member.id === id ? { ...member, status } : member
    ));
    persistMembers(nextMembers, '회원 상태가 변경되었습니다.');
  };

  const handleMemberMemoChange = (id, memo) => {
    const nextMembers = members.map(member => (
      member.id === id ? { ...member, memo } : member
    ));
    persistMembers(nextMembers);
  };

  const handleDeleteMember = (id, name) => {
    if (!isSuperAdmin) {
      setMsg({ type: 'error', text: '권한 부족: 기존 회원 삭제는 최고 관리자(Level 2)만 가능합니다.' });
      return;
    }
    const target = members.find(member => member.id === id);
    if (target?.role === 'super_admin' && !hasMultipleSuperAdmins(id)) {
      setMsg({ type: 'error', text: '최고 관리자 계정은 최소 1명 이상 유지되어야 합니다.' });
      return;
    }
    const nextMembers = members.filter(member => member.id !== id);
    persistMembers(nextMembers, `${name} 회원 정보가 기존 회원 목록에서 삭제되었습니다.`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '150px 0', textAlign: 'center', minHeight: '80vh' }}>
        <p style={{ fontWeight: '700', color: 'var(--color-emerald-deep)' }}>보안 관리자 대시보드를 불러오고 있습니다...</p>
      </div>
    );
  }

  const isSuperAdmin = userRole === 'super_admin';
  const selectedSection = siteSections.find(section => section.id === selectedSectionId) || siteSections[0];
  const sectionPages = ['all', ...Array.from(new Set(siteSections.map(section => section.page)))];
  const filteredSections = sectionFilter === 'all'
    ? siteSections
    : siteSections.filter(section => section.page === sectionFilter);
  const normalizedMemberQuery = memberQuery.trim().toLowerCase();
  const filteredMembers = members.filter(member => {
    const matchesRole = memberRoleFilter === 'all' || member.role === memberRoleFilter;
    const matchesQuery = !normalizedMemberQuery
      || (member.name || '').toLowerCase().includes(normalizedMemberQuery)
      || (member.brand || '').toLowerCase().includes(normalizedMemberQuery)
      || (member.email || '').toLowerCase().includes(normalizedMemberQuery)
      || (member.phone || '').toLowerCase().includes(normalizedMemberQuery)
      || (member.memo || '').toLowerCase().includes(normalizedMemberQuery);

    return matchesRole && matchesQuery;
  });
  const adminMemberCount = members.filter(member => member.role === 'super_admin' || member.role === 'staff_admin').length;
  const activeMemberCount = members.filter(member => member.status === 'active').length;

  return (
    <div className="admin-outer-container">
      {/* Sidebar Section */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">👑</span>
          <div>
            <h3 className="brand-title">협회 통합 관리툴</h3>
            <span className="brand-subtitle">Sejong Local Admin</span>
          </div>
        </div>

        {/* Current Role Badge */}
        <div className="role-badge-box">
          <span style={{ fontSize: '11px', color: 'var(--color-gray-dark)', fontWeight: '700', textTransform: 'uppercase' }}>보안 레벨</span>
          {isSuperAdmin ? (
            <div className="role-badge super">최고 관리자 (Level 2)</div>
          ) : (
            <div className="role-badge staff">일반 관리자 (Level 1)</div>
          )}
        </div>

        {/* Navigation Menus */}
        <nav className="sidebar-nav">
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'home' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('home'); setMsg({type:'',text:''}); }}
          >
            🏠 대시보드 홈
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'approval' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('approval'); setMsg({type:'',text:''}); }}
          >
            📋 회원 가입 승인/회원 관리 {pendingRegistrations.length > 0 && <span className="indicator-dot">{pendingRegistrations.length}</span>}
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('inquiries'); setMsg({type:'',text:''}); }}
          >
            📩 신청/문의 관리 {mentoringRequests.length > 0 && <span className="indicator-dot">{mentoringRequests.length}</span>}
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'content' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('content'); setMsg({type:'',text:''}); }}
          >
            ✏️ 사이트 콘텐츠 관리 <span className="indicator-dot muted">{siteSections.length}</span>
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'category' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('category'); setMsg({type:'',text:''}); }}
          >
            📁 카테고리 및 컨텐츠 설정
          </button>
          <button 
            type="button" 
            className={`nav-item ${activeSubTab === 'system' ? 'active' : ''}`}
            onClick={() => { setActiveSubTab('system'); setMsg({type:'',text:''}); }}
          >
            ⚙️ 시스템 설정 {!isSuperAdmin && '🔒'}
          </button>
        </nav>

        {/* Simulator Panel (For Demonstration) */}
        <div className="simulator-panel">
          <h4 className="sim-title">⚙️ 권한 시뮬레이터</h4>
          <p className="sim-desc">클릭하여 관리자 등급별 보기 권한 및 차단 UI를 테스트해 보세요.</p>
          <div className="sim-buttons">
            <button 
              type="button" 
              className={`sim-btn ${userRole === 'super_admin' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('super_admin')}
            >
              최고 관리자 (Lv.2)
            </button>
            <button 
              type="button" 
              className={`sim-btn ${userRole === 'staff_admin' ? 'active' : ''}`}
              onClick={() => handleSimulateRole('staff_admin')}
            >
              일반 관리자 (Lv.1)
            </button>
            <button 
              type="button" 
              className="sim-btn reset"
              onClick={() => handleSimulateRole('user')}
            >
              일반회원으로 강등
            </button>
            <button 
              type="button" 
              className="sim-btn reset"
              onClick={() => handleSimulateRole('none')}
            >
              로그아웃 (권한 해제)
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="content-header">
          <div>
            <span className="breadcrumb">Admin &gt; {activeSubTab}</span>
            <h1 className="header-title">
              {activeSubTab === 'home' && '대시보드 개요'}
              {activeSubTab === 'approval' && '회원 가입 승인 및 기존 회원 관리'}
              {activeSubTab === 'inquiries' && '멘토링 및 컨설팅 신청 관리'}
              {activeSubTab === 'content' && '섹션별 사이트 콘텐츠 관리'}
              {activeSubTab === 'category' && '쇼핑몰 카테고리 관리'}
              {activeSubTab === 'system' && '시스템 인프라 및 권한 설정'}
            </h1>
          </div>
          <Link href="/" className="exit-btn">
            GNB 홈페이지 바로가기 ➔
          </Link>
        </header>

        {msg.text && (
          <div className={`alert-box ${msg.type}`} style={{ marginBottom: '24px' }}>
            {msg.type === 'error' ? '❌ ' : '✨ '} {msg.text}
          </div>
        )}

        {/* Tab 1: Dashboard Home */}
        {activeSubTab === 'home' && (
          <div className="tab-view animate-fade-in">
            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">총 등록 회원수</span>
                <span className="stat-val">{members.length} 명</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">가입 승인 대기</span>
                <span className="stat-val" style={{ color: 'var(--color-orange-accent)' }}>{pendingRegistrations.length} 건</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">활성 브랜드 쇼핑몰 수</span>
                <span className="stat-val">42 개</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">이번 달 정기 네트워킹</span>
                <span className="stat-val" style={{ color: 'var(--color-emerald-deep)' }}>1회 (완료)</span>
              </div>
            </div>

            {/* Quick overview grids */}
            <div className="overview-split" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '30px' }}>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '10px' }}>
                  📌 최근 정회원 신청 요약
                </h3>
                {pendingRegistrations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pendingRegistrations.map(reg => (
                      <div key={reg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--color-sand-light)', borderRadius: '4px' }}>
                        <div>
                          <strong style={{ fontSize: '14.5px', color: 'var(--color-charcoal-deep)' }}>{reg.brand}</strong>
                          <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>대표: {reg.name} ({reg.category})</span>
                        </div>
                        <span style={{ fontSize: '12px', color: reg.feePaid ? 'var(--color-emerald-deep)' : 'var(--color-orange-accent)', fontWeight: '800' }}>
                          {reg.feePaid ? '납부 확인됨' : '미납(확인중)'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontSize: '13.5px' }}>승인 처리 대기 중인 회원이 없습니다.</p>
                )}
              </div>

              <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '10px' }}>
                  ⚡ 시스템 로그 요약
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'var(--color-gray-dark)' }}>
                  <div>• [04:12] Supabase DB 연결 활성화 완료</div>
                  <div>• [04:10] 시뮬레이션 토글: {userRole}</div>
                  <div>• [03:55] Vercel 프로덕션 자동 배포 트리거</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Member Approvals */}
        {activeSubTab === 'approval' && (
          <div className="tab-view animate-fade-in glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', margin: '0' }}>
                🕒 승인 심사 대기자 목록 ({pendingRegistrations.length})
              </h3>
              {!isSuperAdmin && (
                <span style={{ color: 'var(--color-orange-accent)', fontSize: '13px', fontWeight: '700' }}>
                  🔒 Level 1 일반관리자는 승인 처리가 불가합니다 (읽기 전용).
                </span>
              )}
            </div>

            {pendingRegistrations.length > 0 ? (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>신청자명</th>
                      <th>브랜드(업체)명</th>
                      <th>업종 카테고리</th>
                      <th>연락처</th>
                      <th>신청일</th>
                      <th>회비납부여부</th>
                      <th style={{ textAlign: 'center' }}>조치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRegistrations.map((reg) => (
                      <tr key={reg.id}>
                        <td style={{ fontWeight: '700' }}>{reg.name}</td>
                        <td>{reg.brand}</td>
                        <td><span className="badge badge-emerald" style={{ fontSize: '11px' }}>{reg.category}</span></td>
                        <td>{reg.phone}</td>
                        <td>{reg.date}</td>
                        <td>
                          <label className={`fee-check-label ${reg.feePaid ? 'paid' : 'unpaid'} ${!isSuperAdmin ? 'disabled' : ''}`}>
                            <input
                              type="checkbox"
                              className="fee-check-input"
                              checked={reg.feePaid}
                              disabled={!isSuperAdmin}
                              onChange={(event) => handleRegistrationFeePaidChange(reg.id, event.target.checked)}
                              aria-label={`${reg.name} 회비납부 여부`}
                            />
                            <span className="fee-status-pill">
                              {reg.feePaid ? '납부 확인됨' : '미납(확인중)'}
                            </span>
                          </label>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              className={`action-btn approve ${!isSuperAdmin ? 'disabled' : ''}`}
                              disabled={!isSuperAdmin}
                              onClick={() => handleApprove(reg.id, reg.name)}
                            >
                              {!isSuperAdmin && '🔒 '}승인
                            </button>
                            <button
                              type="button"
                              className={`action-btn reject ${!isSuperAdmin ? 'disabled' : ''}`}
                              disabled={!isSuperAdmin}
                              onClick={() => handleReject(reg.id, reg.name)}
                            >
                              {!isSuperAdmin && '🔒 '}반려
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                <span style={{ fontSize: '40px' }}>🎉</span>
                <p style={{ marginTop: '12px', fontWeight: '700' }}>모든 정회원 신청 승인 심사가 완료되었습니다!</p>
              </div>
            )}

            <section className="member-management-panel">
              <div className="member-management-header">
                <div>
                  <h3>기존 회원 관리 ({filteredMembers.length})</h3>
                  <p>회원별 권한, 활동 상태, 운영 메모를 관리합니다.</p>
                </div>
                <div className="member-summary-grid">
                  <div className="member-summary-card">
                    <span>전체 회원</span>
                    <strong>{members.length}</strong>
                  </div>
                  <div className="member-summary-card">
                    <span>운영 권한</span>
                    <strong>{adminMemberCount}</strong>
                  </div>
                  <div className="member-summary-card">
                    <span>활성 회원</span>
                    <strong>{activeMemberCount}</strong>
                  </div>
                </div>
              </div>

              <div className="member-toolbar">
                <input
                  className="member-search-input"
                  type="search"
                  placeholder="이름, 브랜드, 이메일, 연락처, 메모 검색"
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  aria-label="기존 회원 검색"
                />
                <select
                  className="member-filter-select"
                  value={memberRoleFilter}
                  onChange={(e) => setMemberRoleFilter(e.target.value)}
                  aria-label="권한별 회원 필터"
                >
                  <option value="all">전체 권한</option>
                  {ROLE_OPTIONS.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div className="table-wrapper">
                <table className="admin-table member-table">
                  <thead>
                    <tr>
                      <th>회원</th>
                      <th>연락처</th>
                      <th>권한</th>
                      <th>상태</th>
                      <th>가입일</th>
                      <th>특이 사항 메모</th>
                      <th style={{ textAlign: 'center' }}>조치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => {
                      const roleOption = ROLE_OPTIONS.find(role => role.value === member.role);
                      const statusOption = STATUS_OPTIONS.find(status => status.value === member.status);

                      return (
                        <tr key={member.id}>
                          <td>
                            <div className="member-name-block">
                              <strong>{member.name}</strong>
                              <span>{member.brand || '브랜드 미입력'}</span>
                              {roleOption && (
                                <small className={`member-role-pill ${member.role}`}>
                                  {roleOption.shortLabel}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="member-contact-block">
                              <span>{member.phone || '연락처 미입력'}</span>
                              <small>{member.email || '이메일 미입력'}</small>
                            </div>
                          </td>
                          <td>
                            <select
                              value={member.role}
                              className="member-control-select"
                              disabled={!isSuperAdmin}
                              onChange={(e) => handleMemberRoleChange(member.id, e.target.value)}
                              aria-label={`${member.name} 회원 권한 변경`}
                            >
                              {ROLE_OPTIONS.map(role => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                              ))}
                            </select>
                            {roleOption && <small className="member-select-hint">{roleOption.description}</small>}
                          </td>
                          <td>
                            <select
                              value={member.status}
                              className={`member-control-select status-${member.status}`}
                              disabled={!isSuperAdmin}
                              onChange={(e) => handleMemberStatusChange(member.id, e.target.value)}
                              aria-label={`${member.name} 회원 상태 변경`}
                            >
                              {STATUS_OPTIONS.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                              ))}
                            </select>
                            {statusOption && <small className="member-select-hint">{statusOption.label}</small>}
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontWeight: '700' }}>{member.joinedAt || '-'}</td>
                          <td>
                            <textarea
                              className="member-memo-input"
                              rows="3"
                              value={member.memo || ''}
                              onChange={(e) => handleMemberMemoChange(member.id, e.target.value)}
                              aria-label={`${member.name} 회원 특이 사항 메모`}
                            />
                          </td>
                          <td>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <button
                                type="button"
                                className={`action-btn reject ${!isSuperAdmin ? 'disabled' : ''}`}
                                disabled={!isSuperAdmin}
                                onClick={() => handleDeleteMember(member.id, member.name)}
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredMembers.length === 0 && (
                <div className="member-empty-state">
                  검색 조건에 맞는 회원이 없습니다.
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab 3: Mentoring / Consulting Requests */}
        {activeSubTab === 'inquiries' && (
          <div className="tab-view animate-fade-in glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', margin: '0 0 6px' }}>
                  📩 멘토링 및 컨설팅 신청 내역 ({mentoringRequests.length})
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--color-gray-dark)', margin: 0 }}>
                  협회활동 페이지의 “1:1 멘토링 및 컨설팅 신청” 폼으로 접수된 내용을 확인합니다.
                </p>
              </div>
              <Link href="/activities?tab=mentoring" className="exit-btn">
                신청 페이지 보기 →
              </Link>
            </div>

            {mentoringRequests.length > 0 ? (
              <div className="table-wrapper">
                <table className="admin-table inquiry-table">
                  <thead>
                    <tr>
                      <th>접수일시</th>
                      <th>희망 분과</th>
                      <th>회사명 및 대표명</th>
                      <th>신청 내용</th>
                      <th>상태</th>
                      <th style={{ textAlign: 'center' }}>조치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentoringRequests.map((request) => (
                      <tr key={request.id}>
                        <td style={{ whiteSpace: 'nowrap', fontWeight: '700' }}>
                          {new Date(request.createdAt).toLocaleString('ko-KR')}
                        </td>
                        <td>
                          <span className="badge badge-emerald" style={{ fontSize: '11px' }}>
                            {request.typeLabel || request.type}
                          </span>
                        </td>
                        <td style={{ fontWeight: '800' }}>{request.name}</td>
                        <td className="inquiry-desc-cell">{request.desc}</td>
                        <td>
                          <select
                            value={request.status}
                            onChange={(e) => handleMentoringStatusChange(request.id, e.target.value)}
                            className="inquiry-status-select"
                            aria-label={`${request.name} 신청 상태 변경`}
                          >
                            <option value="new">신규 접수</option>
                            <option value="contacting">연락중</option>
                            <option value="done">완료</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                              type="button"
                              className="action-btn reject"
                              onClick={() => handleDeleteMentoringRequest(request.id)}
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '70px 20px', color: '#888' }}>
                <span style={{ fontSize: '44px' }}>📭</span>
                <p style={{ marginTop: '12px', fontWeight: '800', color: 'var(--color-charcoal-deep)' }}>
                  아직 접수된 멘토링 신청이 없습니다.
                </p>
                <p style={{ marginTop: '6px', fontSize: '13.5px' }}>
                  사용자가 협회활동 페이지에서 신청서를 제출하면 이곳에 표시됩니다.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Site Content Management */}
        {activeSubTab === 'content' && (
          <div className="tab-view animate-fade-in content-manager-view">
            <section className="content-toolbar glass-panel">
              <div>
                <span className="toolbar-eyebrow">Content Operations</span>
                <h3 className="toolbar-title">웹사이트 전체 섹션 콘텐츠 편집</h3>
                <p className="toolbar-desc">
                  전체 서비스 메뉴의 모든 페이지를 그룹별로 나누어 텍스트, 대표 이미지, 버튼 문구, 링크, 노출 상태를 관리합니다.
                </p>
              </div>
              <div className="toolbar-actions">
                <button type="button" className="content-action-btn primary" onClick={handleSaveSections}>
                  저장
                </button>
                <button type="button" className="content-action-btn" onClick={handleExportSections}>
                  JSON 내보내기
                </button>
                <button type="button" className="content-action-btn danger" onClick={handleResetSections}>
                  기본값 복원
                </button>
              </div>
            </section>

            <div className="content-manager-grid">
              <aside className="section-index-panel glass-panel">
                <div className="section-index-header">
                  <div>
                    <span className="toolbar-eyebrow">Sitemap</span>
                    <h3>실제 메뉴 구조</h3>
                  </div>
                  <span>전체 {siteSections.length}개</span>
                </div>

                <div className="section-filter-row">
                  {sectionPages.map(pageName => (
                    <button
                      key={pageName}
                      type="button"
                      className={`section-filter-chip ${sectionFilter === pageName ? 'active' : ''}`}
                      onClick={() => {
                        setSectionFilter(pageName);
                        const nextSection = pageName === 'all'
                          ? siteSections[0]
                          : siteSections.find(section => section.page === pageName);
                        if (nextSection) setSelectedSectionId(nextSection.id);
                      }}
                    >
                      {pageName === 'all' ? '전체 페이지' : pageName}
                    </button>
                  ))}
                </div>

                <div className="section-list">
                  {filteredSections.map(section => (
                    <button
                      key={section.id}
                      type="button"
                      className={`section-list-item ${selectedSectionId === section.id ? 'active' : ''}`}
                      onClick={() => setSelectedSectionId(section.id)}
                    >
                      <div className="section-list-main">
                        <span className="section-page-tag">{section.page}</span>
                        <strong>{section.area}</strong>
                      </div>
                      <small>{section.title}</small>
                      <small className="section-link-path">{section.ctaHref}</small>
                      <span className={`section-status ${section.status}`}>
                        {section.status === 'published' ? '노출중' : section.status === 'hidden' ? '숨김' : '초안'}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="section-editor-panel glass-panel">
                <div className="editor-header">
                  <div>
                    <span className="section-page-tag">{selectedSection.page}</span>
                    <h3>{selectedSection.area}</h3>
                    <p>마지막 수정일: {selectedSection.updatedAt}</p>
                  </div>
                  <select
                    className="status-select"
                    value={selectedSection.status}
                    onChange={(e) => handleSectionFieldChange('status', e.target.value)}
                    aria-label="콘텐츠 노출 상태"
                  >
                    <option value="published">노출중</option>
                    <option value="draft">초안</option>
                    <option value="hidden">숨김</option>
                  </select>
                </div>

                <div className="visual-edit-shell">
                  <div className="visual-edit-preview">
                    <div className="preview-browser-bar">
                      <strong>SELO</strong>
                      <div>
                        <span>{selectedSection.page}</span>
                        <span>{selectedSection.area}</span>
                      </div>
                    </div>
                    <div className="preview-hero-card">
                      <div className="preview-hero-media">
                        {selectedSection.imageUrl ? (
                          <img src={selectedSection.imageUrl} alt={`${selectedSection.area} 미리보기`} />
                        ) : (
                          <div className="empty-preview">이미지 없음</div>
                        )}
                      </div>
                      <div className="preview-hero-copy">
                        <span>{selectedSection.page} / {selectedSection.area}</span>
                        <h4>{selectedSection.title}</h4>
                        <p>{selectedSection.subtitle}</p>
                        <small>{selectedSection.body}</small>
                        <Link href={selectedSection.ctaHref || '/'} className="preview-cta">
                          {selectedSection.ctaLabel || '바로가기'} →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="editor-fields">
                    <div className="form-row-pair">
                      <div className="form-group">
                        <label htmlFor="section-page">상단 메뉴명</label>
                        <input
                          id="section-page"
                          type="text"
                          value={selectedSection.page}
                          onChange={(e) => handleSectionFieldChange('page', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="section-area">페이지 안 섹션명</label>
                        <input
                          id="section-area"
                          type="text"
                          value={selectedSection.area}
                          onChange={(e) => handleSectionFieldChange('area', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="section-title">화면에 크게 보이는 제목</label>
                      <input
                        id="section-title"
                        type="text"
                        value={selectedSection.title}
                        onChange={(e) => handleSectionFieldChange('title', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="section-subtitle">제목 아래 설명 문구</label>
                      <input
                        id="section-subtitle"
                        type="text"
                        value={selectedSection.subtitle}
                        onChange={(e) => handleSectionFieldChange('subtitle', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="section-body">본문 및 운영 메모</label>
                      <textarea
                        id="section-body"
                        rows="4"
                        value={selectedSection.body}
                        onChange={(e) => handleSectionFieldChange('body', e.target.value)}
                      />
                    </div>

                    <div className="mini-field-grid">
                      <div className="form-group">
                        <label htmlFor="section-cta-label">버튼 문구</label>
                        <input
                          id="section-cta-label"
                          type="text"
                          value={selectedSection.ctaLabel}
                          onChange={(e) => handleSectionFieldChange('ctaLabel', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="section-cta-href">연결 링크</label>
                        <input
                          id="section-cta-href"
                          type="text"
                          value={selectedSection.ctaHref}
                          onChange={(e) => handleSectionFieldChange('ctaHref', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="image-edit-grid">
                      <div className="form-group section-upload-group">
                        <label htmlFor="section-image-file">대표 사진 업로드</label>
                        <input
                          id="section-image-file"
                          type="file"
                          accept="image/*"
                          onChange={handleSectionImageUpload}
                        />
                        <small>로컬 이미지 파일을 선택하면 오른쪽 미리보기에 바로 반영됩니다.</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="section-image">이미지 데이터/주소</label>
                        <textarea
                          id="section-image"
                          rows="3"
                          placeholder="로컬 업로드 이미지 데이터 또는 기존 이미지 주소"
                          value={selectedSection.imageUrl}
                          onChange={(e) => handleSectionFieldChange('imageUrl', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Tab 4: Category Management */}
        {activeSubTab === 'category' && (
          <div className="tab-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="grid-2">
              {/* Category creation form */}
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '20px' }}>
                  ➕ 카테고리 추가
                </h3>
                <form className="newsletter-form" onSubmit={handleAddCategory}>
                  <div className="form-group">
                    <label htmlFor="cat-code">카테고리 코드 (영어 소문자)</label>
                    <input 
                      id="cat-code"
                      type="text" 
                      required 
                      placeholder="예) fashion, beauty" 
                      value={newCatCode} 
                      onChange={(e) => setNewCatCode(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cat-name">카테고리 한글명</label>
                    <input 
                      id="cat-name"
                      type="text" 
                      required 
                      placeholder="예) 패션 (Fashion)" 
                      value={newCatName} 
                      onChange={(e) => setNewCatName(e.target.value)} 
                    />
                  </div>
                  <button type="submit" className="subscribe-btn" style={{ height: '46px', marginTop: '10px' }}>
                    카테고리 생성 등록 ➔
                  </button>
                </form>
              </div>

              {/* Current Categories List */}
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', marginBottom: '20px' }}>
                  📁 활성 브랜드 카테고리 목록 ({categories.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categories.map((cat) => (
                    <div 
                      key={cat.code} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '12px 16px', 
                        background: 'var(--color-sand-light)', 
                        borderRadius: '4px',
                        borderLeft: '4px solid var(--color-emerald-deep)'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '15px' }}>{cat.name}</strong>
                        <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>({cat.code})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-emerald-medium)' }}>
                          {cat.count}개 브랜드
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.code, cat.name)}
                          style={{
                            background: 'none',
                            color: 'var(--color-orange-accent)',
                            fontWeight: '800',
                            fontSize: '12px',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: System Settings */}
        {activeSubTab === 'system' && (
          <div className="tab-view animate-fade-in">
            {!isSuperAdmin ? (
              <div className="glass-panel" style={{ padding: '50px 30px', textAlign: 'center', backgroundColor: 'var(--color-white)' }}>
                <span style={{ fontSize: '64px' }}>🔒</span>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-charcoal-deep)', marginTop: '20px' }}>
                  접근 권한 제한 (최고 관리자 전용)
                </h3>
                <p style={{ fontSize: '14.5px', color: 'var(--color-gray-dark)', maxWidth: '450px', margin: '12px auto 0', lineHeight: '1.6' }}>
                  데이터베이스 접속 권한, 백업 복구, API 토큰 키 발급 등 인프라 설정 영역은 **최고 관리자(Level 2)** 외에 일반 관리자는 접근할 수 없습니다.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <button 
                    type="button" 
                    className="subscribe-btn"
                    style={{ padding: '10px 24px', height: 'auto', borderRadius: '4px' }}
                    onClick={() => handleSimulateRole('super_admin')}
                  >
                    최고 관리자 권한으로 변경하여 테스트하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '30px', backgroundColor: 'var(--color-white)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-charcoal-deep)', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '10px' }}>
                  ⚙️ 데이터베이스 & 인프라 권한 설정 (Level 2 Authorized)
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  <div style={{ padding: '20px', background: 'var(--color-sand-light)', borderRadius: '6px' }}>
                    <h4 style={{ fontWeight: '800', marginBottom: '8px' }}>데이터베이스 백업 스케줄</h4>
                    <span style={{ fontSize: '13px', color: 'var(--color-gray-dark)', display: 'block', marginBottom: '12px' }}>
                      일일 오전 04:00 자동 스냅샷 백업 수행 중
                    </span>
                    <button 
                      type="button" 
                      className="subscribe-btn" 
                      style={{ height: '36px', fontSize: '12px', padding: '0 16px', borderRadius: '4px' }}
                      onClick={() => alert('즉시 백업 인스턴스가 시작되었습니다.')}
                    >
                      즉시 백업 진행
                    </button>
                  </div>

                  <div style={{ padding: '20px', background: 'var(--color-sand-light)', borderRadius: '6px' }}>
                    <h4 style={{ fontWeight: '800', marginBottom: '8px' }}>외부 API 및 Supabase 연동 상태</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ width: '10px', height: '10px', background: '#6cbfab', borderRadius: '50%' }} />
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>Active (연결 상태 완벽)</span>
                    </div>
                    <button 
                      type="button" 
                      className="subscribe-btn" 
                      style={{ height: '36px', fontSize: '12px', padding: '0 16px', borderRadius: '4px', background: '#aaa' }}
                      onClick={() => alert('Supabase 연결 검증을 재개합니다.')}
                    >
                      커넥션 헬스 체크
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-outer-container {
          display: flex;
          min-height: 90vh;
          margin-top: 100px;
          background-color: var(--color-sand-light);
        }

        /* Sidebar styling */
        .admin-sidebar {
          width: 280px;
          background-color: var(--color-white);
          border-right: 1px solid var(--color-gray-light);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .brand-logo {
          font-size: 28px;
        }

        .brand-title {
          font-size: 15px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin: 0;
        }

        .brand-subtitle {
          font-size: 11px;
          color: var(--color-gray-medium);
          font-weight: 700;
          display: block;
        }

        .role-badge-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .role-badge {
          font-size: 12.5px;
          font-weight: 800;
          padding: 8px;
          border-radius: 4px;
          text-align: center;
        }

        .role-badge.super {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
          border: 1px solid rgba(229, 76, 28, 0.2);
        }

        .role-badge.staff {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          border: 1px solid rgba(108, 191, 171, 0.24);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-grow: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          font-size: 14px;
          font-weight: 700;
          color: var(--color-gray-dark);
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-item:hover, .nav-item.active {
          background-color: var(--color-sand-light);
          color: var(--color-emerald-deep);
        }

        .indicator-dot {
          background-color: var(--color-orange-accent);
          color: var(--color-white);
          font-size: 10px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: var(--border-radius-full);
        }

        .indicator-dot.muted {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
        }

        /* Simulator Styles */
        .simulator-panel {
          padding: 16px;
          background-color: var(--color-sand-light);
          border-radius: 6px;
          border: 1px solid var(--color-gray-light);
        }

        .sim-title {
          font-size: 12px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin-bottom: 6px;
        }

        .sim-desc {
          font-size: 11px;
          color: var(--color-gray-dark);
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .sim-buttons {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sim-btn {
          width: 100%;
          padding: 8px;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 4px;
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          color: var(--color-gray-dark);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sim-btn:hover, .sim-btn.active {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          border-color: var(--color-emerald-deep);
        }

        .sim-btn.reset {
          background-color: #f1f1f1;
          color: #666;
        }

        .sim-btn.reset:hover {
          background-color: #ddd;
        }

        /* Main Content Container */
        .admin-main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 2px solid var(--color-gray-light);
          padding-bottom: 20px;
        }

        .breadcrumb {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--color-gray-medium);
        }

        .header-title {
          font-size: 26px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin: 4px 0 0 0;
          letter-spacing: -0.5px;
        }

        .exit-btn {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--color-emerald-deep);
          text-decoration: underline;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background-color: var(--color-white);
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: var(--shadow-subtle);
        }

        .stat-label {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }

        .stat-val {
          font-size: 28px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
        }

        .stat-sub {
          font-size: 11.5px;
          color: var(--color-gray-medium);
          font-weight: 600;
        }

        /* Alert Box */
        .alert-box {
          padding: 14px 18px;
          border-radius: 4px;
          font-size: 13.5px;
          font-weight: 700;
        }

        .alert-box.success {
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
          border: 1px solid var(--color-emerald-light);
        }

        .alert-box.error {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
          border: 1px solid rgba(229, 76, 28, 0.2);
        }

        /* Table */
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13.5px;
        }

        .admin-table th, .admin-table td {
          padding: 16px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .admin-table th {
          background-color: var(--color-sand-light);
          color: var(--color-charcoal-deep);
          font-weight: 800;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .fee-check-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 142px;
          cursor: pointer;
        }

        .fee-check-label.disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .fee-check-input {
          width: 18px;
          height: 18px;
          accent-color: var(--color-emerald-deep);
          flex: 0 0 auto;
        }

        .fee-status-pill {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
          white-space: nowrap;
        }

        .fee-check-label.paid .fee-status-pill {
          color: var(--color-emerald-deep);
          background: var(--color-emerald-pale);
        }

        .fee-check-label.unpaid .fee-status-pill {
          color: var(--color-orange-accent);
          background: var(--color-orange-light);
        }

        .member-management-panel {
          margin-top: 34px;
          padding-top: 30px;
          border-top: 1px solid var(--color-gray-light);
        }

        .member-management-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 18px;
        }

        .member-management-header h3 {
          font-size: 18px;
          color: var(--color-charcoal-deep);
          margin: 0 0 6px;
        }

        .member-management-header p {
          font-size: 13.5px;
          color: var(--color-gray-dark);
          margin: 0;
        }

        .member-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(90px, 1fr));
          gap: 10px;
          min-width: 310px;
        }

        .member-summary-card {
          padding: 12px;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          background-color: var(--color-sand-light);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .member-summary-card span {
          font-size: 11px;
          font-weight: 800;
          color: var(--color-gray-dark);
        }

        .member-summary-card strong {
          font-size: 20px;
          font-weight: 900;
          color: var(--color-emerald-deep);
        }

        .member-toolbar {
          display: grid;
          grid-template-columns: minmax(240px, 1fr) 180px;
          gap: 10px;
          margin-bottom: 16px;
        }

        .member-search-input,
        .member-filter-select,
        .member-control-select,
        .member-memo-input {
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          background-color: var(--color-white);
          color: var(--color-charcoal-deep);
          font-size: 12.5px;
        }

        .member-search-input,
        .member-filter-select,
        .member-control-select {
          height: 38px;
          padding: 0 10px;
          font-weight: 800;
        }

        .member-table {
          min-width: 1180px;
        }

        .member-name-block,
        .member-contact-block {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .member-name-block strong {
          color: var(--color-charcoal-deep);
          font-size: 14px;
        }

        .member-name-block span,
        .member-contact-block small {
          color: var(--color-gray-dark);
          font-size: 12px;
          line-height: 1.35;
        }

        .member-contact-block span {
          color: var(--color-charcoal-deep);
          font-size: 12.5px;
          font-weight: 800;
        }

        .member-role-pill {
          width: fit-content;
          padding: 3px 7px;
          border-radius: var(--border-radius-full);
          font-size: 10.5px;
          font-weight: 900;
          background-color: var(--color-emerald-pale);
          color: var(--color-emerald-deep);
        }

        .member-role-pill.super_admin {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
        }

        .member-role-pill.staff_admin {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
        }

        .member-control-select {
          width: 132px;
        }

        .member-control-select:disabled {
          color: var(--color-gray-medium);
          background-color: var(--color-sand-light);
          cursor: not-allowed;
        }

        .member-control-select.status-active {
          color: var(--color-emerald-deep);
        }

        .member-control-select.status-paused,
        .member-control-select.status-left {
          color: var(--color-orange-accent);
        }

        .member-select-hint {
          display: block;
          color: var(--color-gray-medium);
          font-size: 11px;
          font-weight: 700;
          margin-top: 5px;
        }

        .member-memo-input {
          width: 280px;
          min-height: 68px;
          padding: 10px;
          resize: vertical;
          line-height: 1.45;
          font-weight: 700;
        }

        .member-empty-state {
          text-align: center;
          padding: 30px 12px 6px;
          color: var(--color-gray-dark);
          font-size: 13.5px;
          font-weight: 800;
        }

        .action-btn {
          padding: 8px 16px;
          font-size: 12.5px;
          font-weight: 800;
          border-radius: 4px;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        .action-btn.approve {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
        }

        .action-btn.approve:hover:not(:disabled) {
          background-color: var(--color-emerald-medium);
        }

        .action-btn.reject {
          background-color: var(--color-orange-accent);
          color: var(--color-white);
        }

        .action-btn.reject:hover:not(:disabled) {
          background-color: #ff5a2a;
        }

        .action-btn.disabled {
          background-color: var(--color-sand-medium) !important;
          color: #999 !important;
          cursor: not-allowed;
          opacity: 0.8;
        }

        .inquiry-table {
          table-layout: fixed;
        }

        .inquiry-desc-cell {
          max-width: 360px;
          white-space: normal;
          line-height: 1.55;
          color: var(--color-gray-dark);
        }

        .inquiry-status-select {
          min-width: 100px;
          height: 34px;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          background: var(--color-sand-light);
          color: var(--color-charcoal-deep);
          font-size: 12px;
          font-weight: 800;
          padding: 0 8px;
        }

        /* Content manager */
        .content-manager-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .content-toolbar {
          background-color: var(--color-white);
          border-radius: var(--border-radius-md);
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .toolbar-eyebrow {
          color: var(--color-orange-accent);
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .toolbar-title {
          font-size: 20px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin: 4px 0 6px;
        }

        .toolbar-desc {
          color: var(--color-gray-dark);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0;
        }

        .toolbar-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .content-action-btn {
          height: 38px;
          padding: 0 14px;
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--color-gray-light);
          background-color: var(--color-white);
          color: var(--color-charcoal-deep);
          font-size: 12.5px;
          font-weight: 800;
        }

        .content-action-btn.primary {
          background-color: var(--color-emerald-deep);
          color: var(--color-white);
          border-color: var(--color-emerald-deep);
        }

        .content-action-btn.danger {
          color: var(--color-orange-accent);
        }

        .content-manager-grid {
          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
        }

        .section-index-panel,
        .section-editor-panel {
          background-color: var(--color-white);
          border-radius: var(--border-radius-md);
          padding: 22px;
        }

        .section-index-panel {
          position: sticky;
          top: 24px;
        }

        .section-index-header,
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-gray-light);
          margin-bottom: 16px;
        }

        .section-index-header h3,
        .editor-header h3 {
          font-size: 17px;
          font-weight: 900;
          color: var(--color-charcoal-deep);
          margin: 0;
        }

        .section-index-header span,
        .editor-header p {
          color: var(--color-gray-medium);
          font-size: 12px;
          font-weight: 700;
          margin: 4px 0 0;
        }

        .section-filter-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }

        .section-filter-chip {
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 800;
          color: var(--color-gray-dark);
          background-color: var(--color-white);
          text-align: left;
        }

        .section-filter-chip.active {
          color: var(--color-white);
          background-color: var(--color-charcoal-deep);
          border-color: var(--color-charcoal-deep);
        }

        .section-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 640px;
          overflow-y: auto;
        }

        .section-list-item {
          position: relative;
          width: 100%;
          text-align: left;
          padding: 14px 78px 14px 14px;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          background-color: var(--color-white);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .section-list-item.active {
          border-color: var(--color-orange-accent);
          box-shadow: inset 4px 0 0 var(--color-orange-accent), var(--shadow-subtle);
        }

        .section-list-main {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .section-page-tag {
          display: inline-flex;
          width: fit-content;
          padding: 3px 8px;
          border-radius: var(--border-radius-sm);
          background-color: rgba(255, 90, 42, 0.1);
          color: var(--color-orange-accent);
          font-size: 11px;
          font-weight: 900;
        }

        .section-list-item strong {
          font-size: 14px;
          color: var(--color-charcoal-deep);
        }

        .section-list-item small {
          color: var(--color-gray-dark);
          font-size: 12px;
          line-height: 1.45;
        }

        .section-link-path {
          color: var(--color-gray-medium) !important;
          font-size: 11px !important;
          font-weight: 800;
          word-break: break-all;
        }

        .section-status {
          position: absolute;
          top: 12px;
          right: 12px;
          font-size: 10.5px;
          font-weight: 900;
          padding: 3px 7px;
          border-radius: var(--border-radius-full);
        }

        .section-status.published {
          background-color: var(--color-charcoal-deep);
          color: var(--color-white);
        }

        .section-status.draft {
          background-color: var(--color-orange-light);
          color: var(--color-orange-accent);
        }

        .section-status.hidden {
          background-color: var(--color-gray-light);
          color: var(--color-gray-dark);
        }

        .status-select {
          min-width: 110px;
          height: 38px;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-sm);
          padding: 0 10px;
          background-color: var(--color-sand-light);
          font-weight: 800;
          color: var(--color-charcoal-deep);
        }

        .section-upload-group input[type="file"] {
          border: 1px dashed var(--color-gray-light);
          background-color: var(--color-sand-light);
          cursor: pointer;
        }

        .section-upload-group small {
          color: var(--color-gray-medium);
          font-size: 11.5px;
          font-weight: 700;
          line-height: 1.5;
        }

        .visual-edit-shell {
          display: grid;
          grid-template-columns: minmax(360px, 0.9fr) minmax(420px, 1.1fr);
          gap: 24px;
          align-items: start;
        }

        .visual-edit-preview {
          position: sticky;
          top: 24px;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background-color: var(--color-charcoal-deep);
          box-shadow: var(--shadow-subtle);
        }

        .preview-browser-bar {
          min-height: 64px;
          padding: 18px 20px;
          background-color: var(--color-white);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid var(--color-gray-light);
        }

        .preview-browser-bar strong {
          color: var(--color-charcoal-deep);
          font-size: 22px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .preview-browser-bar div {
          display: flex;
          gap: 12px;
          color: var(--color-gray-dark);
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .preview-hero-card {
          background-color: var(--color-charcoal-deep);
        }

        .preview-hero-media {
          width: 100%;
          aspect-ratio: 16 / 9;
          background-color: #222;
          overflow: hidden;
        }

        .preview-hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.78);
        }

        .preview-hero-copy {
          min-height: 300px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .mini-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .form-row-pair,
        .image-edit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .editor-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 22px;
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          background-color: var(--color-white);
        }

        .editor-preview {
          border: 1px solid var(--color-gray-light);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background-color: var(--color-white);
          align-self: start;
        }

        .preview-image-box {
          width: 100%;
          aspect-ratio: 16 / 10;
          background-color: var(--color-sand-medium);
          overflow: hidden;
        }

        .preview-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .empty-preview {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gray-dark);
          font-weight: 800;
        }

        .preview-copy {
          padding: 18px;
        }

        .preview-copy span,
        .preview-hero-copy span {
          color: var(--color-orange-accent);
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .preview-copy h4,
        .preview-hero-copy h4 {
          color: var(--color-white);
          font-size: clamp(28px, 4vw, 56px);
          line-height: 1.08;
          margin: 0;
          letter-spacing: 0;
        }

        .preview-copy p,
        .preview-copy small,
        .preview-hero-copy p,
        .preview-hero-copy small {
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.6;
          font-weight: 700;
        }

        .preview-hero-copy p {
          font-size: 18px;
          margin: 0;
        }

        .preview-hero-copy small {
          font-size: 14px;
        }

        .preview-cta {
          width: fit-content;
          margin-top: 4px;
          color: var(--color-white);
          font-size: 15px;
          font-weight: 900;
          border-bottom: 2px solid var(--color-orange-accent);
          padding-bottom: 4px;
        }

        @media (max-width: 1024px) {
          .admin-outer-container {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--color-gray-light);
          }
          .content-manager-grid,
          .editor-form-grid,
          .visual-edit-shell,
          .form-row-pair,
          .image-edit-grid {
            grid-template-columns: 1fr;
          }
          .section-index-panel,
          .visual-edit-preview {
            position: static;
          }
          .content-toolbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .toolbar-actions {
            justify-content: flex-start;
          }
          .member-management-header {
            flex-direction: column;
          }
          .member-summary-grid,
          .member-toolbar {
            width: 100%;
            min-width: 0;
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
