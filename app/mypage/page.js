'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BOOKMARK_STORAGE_KEY } from '@/components/BookmarkButton';
import { supabase } from '@/lib/supabaseClient';
import { DEFAULT_SHOP_PRODUCTS } from '@/lib/shopProducts';

const SHOP_STORAGE_KEY = 'sejong_shop_products';
const MENTORING_STORAGE_KEY = 'sejong_sero_service_mentoring-day';
const TALK_STORAGE_KEY = 'sejong_sero_service_sero-talk';
const MEMBER_STORAGE_KEY = 'sejong_sero_service_sero-members';
const MEMBER_CONTENT_TYPES = ['인터뷰 영상', 'Instagram Reels', 'Instagram 게시물', '브랜드 필름'];

const readStoredList = (key) => {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
};

const writeStoredList = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Shop products live in a store shared with admin/`/shop`; fall back to the
// seeded catalog so a first-time write here doesn't wipe it out.
const readShopProductsList = () => {
  if (typeof window === 'undefined') return DEFAULT_SHOP_PRODUCTS;

  const stored = localStorage.getItem(SHOP_STORAGE_KEY);
  if (!stored) return DEFAULT_SHOP_PRODUCTS;

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_SHOP_PRODUCTS;
  } catch {
    return DEFAULT_SHOP_PRODUCTS;
  }
};

const getReactionStats = (item, index) => {
  const source = String(item.id || item.title || index);
  const seed = source.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    views: 90 + (seed % 320),
    comments: 2 + (seed % 18),
    likes: 12 + (seed % 74)
  };
};

const getUserBrand = (user) => (
  user?.user_metadata?.brand
  || user?.user_metadata?.company_name
  || user?.user_metadata?.companyName
  || ''
).trim();

const MEMBER_GRADE_LABELS = {
  super_admin: { label: '최고 관리자', className: 'grade-admin' },
  staff_admin: { label: '운영 관리자', className: 'grade-admin' },
  entrepreneur: { label: '정회원', className: 'grade-full' },
  visitor: { label: '일반회원', className: 'grade-general' }
};

const getMemberGrade = (user) => {
  const role = user?.user_metadata?.role;
  return MEMBER_GRADE_LABELS[role] || MEMBER_GRADE_LABELS.visitor;
};

export default function MyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [mentoringItems, setMentoringItems] = useState([]);
  const [talkPosts, setTalkPosts] = useState([]);
  const [memberContentItems, setMemberContentItems] = useState([]);
  const [shopForm, setShopForm] = useState({
    name: '',
    brand: '',
    price: '',
    img: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  // Shop upload form toggle + item edit state
  const [isShopFormOpen, setIsShopFormOpen] = useState(false);
  const [editingShopItem, setEditingShopItem] = useState(null);
  const [shopEditForm, setShopEditForm] = useState({ name: '', brand: '', price: '', img: '', description: '' });

  // 세로 회원사 콘텐츠 upload form toggle + item edit state
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({ title: '', type: MEMBER_CONTENT_TYPES[0], channel: '', url: '', story: '', image: '' });
  const [memberMessage, setMemberMessage] = useState('');
  const [editingMemberItem, setEditingMemberItem] = useState(null);
  const [memberEditForm, setMemberEditForm] = useState({ title: '', type: MEMBER_CONTENT_TYPES[0], channel: '', url: '', story: '', image: '' });

  // Profile edit toggle state
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', brand: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  
  // Post Edit states
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Close whichever edit modal is open on Escape
  useEffect(() => {
    if (!editingPost && !editingShopItem && !editingMemberItem) return;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setEditingPost(null);
      setEditingShopItem(null);
      setEditingMemberItem(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingPost, editingShopItem, editingMemberItem]);

  const startEditPost = (post) => {
    setEditingPost(post);
    setEditTitle(post.title || '');
    setEditContent(post.content || '');
  };

  const saveEditPost = (e) => {
    e.preventDefault();
    if (!editingPost) return;

    try {
      const stored = readStoredList(TALK_STORAGE_KEY);
      const nextTalks = stored.map((p) => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            title: editTitle.trim(),
            content: editContent.trim(),
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });

      localStorage.setItem(TALK_STORAGE_KEY, JSON.stringify(nextTalks));
      refreshDashboard();
      setEditingPost(null);
      alert('게시글이 수정되었습니다.');
    } catch {
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  const deletePost = (postId) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    try {
      const stored = readStoredList(TALK_STORAGE_KEY);
      const nextTalks = stored.filter((p) => p.id !== postId);
      localStorage.setItem(TALK_STORAGE_KEY, JSON.stringify(nextTalks));
      refreshDashboard();
      alert('게시글이 삭제되었습니다.');
    } catch {
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'SELO 회원';
  const userBrand = getUserBrand(user);
  const memberGrade = getMemberGrade(user);

  const refreshDashboard = () => {
    setBookmarks(readStoredList(BOOKMARK_STORAGE_KEY));
    setShopItems(readShopProductsList());
    setMentoringItems(readStoredList(MENTORING_STORAGE_KEY));
    setTalkPosts(readStoredList(TALK_STORAGE_KEY));
    setMemberContentItems(readStoredList(MEMBER_STORAGE_KEY));
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/login');
        return;
      }

      setUser(session.user);
      refreshDashboard();
      setLoading(false);
    };

    checkSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace('/login');
        return;
      }
      setUser(session.user);
      refreshDashboard();
      setLoading(false);
    });

    window.addEventListener('selo_bookmark_update', refreshDashboard);
    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener('selo_bookmark_update', refreshDashboard);
    };
  }, [router]);

  useEffect(() => {
    if (!userBrand) return;

    setShopForm((prev) => (
      prev.brand.trim() ? prev : { ...prev, brand: userBrand }
    ));
  }, [userBrand]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.user_metadata?.name || userName || '',
      brand: userBrand || ''
    });
  }, [user, userName, userBrand]);

  const toggleProfileEdit = () => {
    if (!isProfileEditOpen && user) {
      setProfileForm({
        name: user.user_metadata?.name || userName || '',
        brand: userBrand || ''
      });
    }
    setProfileMsg('');
    setIsProfileEditOpen((prev) => !prev);
  };

  const updateProfileField = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!profileForm.name.trim()) {
      setProfileMsg('이름을 입력해 주세요.');
      return;
    }

    setProfileSaving(true);
    setProfileMsg('');

    const nextName = profileForm.name.trim();
    const nextBrand = profileForm.brand.trim();

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: nextName,
          brand: nextBrand,
          company_name: nextBrand
        }
      });

      if (error) {
        setProfileMsg(error.message || '회원정보 수정 중 오류가 발생했습니다.');
        setProfileSaving(false);
        return;
      }

      if (data?.user) {
        setUser(data.user);
      }

      setProfileMsg('회원정보가 수정되었습니다.');
      window.setTimeout(() => {
        setProfileMsg('');
        setIsProfileEditOpen(false);
      }, 1400);
    } catch {
      setProfileMsg('회원정보 수정 중 오류가 발생했습니다.');
    } finally {
      setProfileSaving(false);
    }
  };

  const mentoringBriefs = useMemo(() => (
    mentoringItems.map((item, index) => ({
      ...item,
      step: index % 3 === 0 ? '접수 완료' : index % 3 === 1 ? '멘토 매칭중' : '일정 조율중',
      next: index % 3 === 0 ? '담당자가 상담 분야를 검토합니다.' : index % 3 === 1 ? '전문가 후보를 확인하고 있습니다.' : '가능한 상담 시간을 조율합니다.'
    }))
  ), [mentoringItems]);

  const talkReports = useMemo(() => {
    const myPosts = talkPosts.filter(
      (post) => 
        (post.userEmail && user?.email && post.userEmail.toLowerCase() === user.email.toLowerCase()) ||
        (post.userId && user?.id && post.userId === user.id) ||
        (post.author && userName && post.author.trim() === userName.trim())
    );

    return myPosts.map((post, index) => ({
      ...post,
      ...getReactionStats(post, index)
    }));
  }, [talkPosts, user, userName]);

  const myShopItems = useMemo(() => (
    shopItems.filter((item) => (
      (item.authorEmail && user?.email && item.authorEmail.toLowerCase() === user.email.toLowerCase()) ||
      (!item.authorEmail && userBrand && item.brand === userBrand)
    ))
  ), [shopItems, user, userBrand]);

  const myMemberContents = useMemo(() => (
    memberContentItems.filter((item) => (
      (item.authorEmail && user?.email && item.authorEmail.toLowerCase() === user.email.toLowerCase()) ||
      (!item.authorEmail && userBrand && item.brand === userBrand)
    ))
  ), [memberContentItems, user, userBrand]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const updateShopField = (field, value) => {
    setShopForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShopImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateShopField('img', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitShopItem = (event) => {
    event.preventDefault();
    const sourceBrand = (userBrand || shopForm.brand).trim();
    if (!shopForm.name.trim() || !sourceBrand) return;

    const nextItem = {
      id: `mypage-shop-${Date.now()}`,
      category: '기타',
      name: shopForm.name.trim(),
      brand: sourceBrand,
      price: shopForm.price.trim(),
      img: shopForm.img,
      description: shopForm.description.trim(),
      authorEmail: user.email,
      authorName: userName,
      status: '검토중',
      createdAt: new Date().toISOString()
    };

    const nextItems = [nextItem, ...readShopProductsList()];
    writeStoredList(SHOP_STORAGE_KEY, nextItems);
    setShopItems(nextItems);
    setShopForm({ name: '', brand: userBrand, price: '', img: '', description: '' });
    setMessage('쇼핑 콘텐츠 등록 신청이 저장되었습니다. 관리자 승인 후 쇼핑몰에 노출됩니다.');
    window.setTimeout(() => setMessage(''), 3600);
  };

  const toggleShopForm = () => {
    if (!isShopFormOpen && userBrand) {
      setShopForm((prev) => ({ ...prev, brand: prev.brand || userBrand }));
    }
    setIsShopFormOpen((prev) => !prev);
  };

  const startEditShopItem = (item) => {
    setEditingShopItem(item);
    setShopEditForm({
      name: item.name || '',
      brand: item.brand || '',
      price: item.price || '',
      img: item.img || '',
      description: item.description || ''
    });
  };

  const updateShopEditField = (field, value) => {
    setShopEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleShopEditImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateShopEditField('img', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveShopEdit = (event) => {
    event.preventDefault();
    if (!editingShopItem) return;
    if (!shopEditForm.name.trim() || !shopEditForm.brand.trim()) return;

    try {
      const stored = readShopProductsList();
      const nextItems = stored.map((item) => (
        item.id === editingShopItem.id
          ? {
              ...item,
              name: shopEditForm.name.trim(),
              brand: shopEditForm.brand.trim(),
              price: shopEditForm.price.trim(),
              img: shopEditForm.img,
              description: shopEditForm.description.trim(),
              updatedAt: new Date().toISOString()
            }
          : item
      ));
      writeStoredList(SHOP_STORAGE_KEY, nextItems);
      setShopItems(nextItems);
      setEditingShopItem(null);
      alert('상품 게시글이 수정되었습니다.');
    } catch {
      alert('상품 게시글 수정 중 오류가 발생했습니다.');
    }
  };

  const deleteShopItem = (id) => {
    if (!confirm('정말로 이 상품 게시글을 삭제하시겠습니까?')) return;

    try {
      const stored = readShopProductsList();
      const nextItems = stored.filter((item) => item.id !== id);
      writeStoredList(SHOP_STORAGE_KEY, nextItems);
      setShopItems(nextItems);
      alert('상품 게시글이 삭제되었습니다.');
    } catch {
      alert('상품 게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const toggleMemberForm = () => {
    setIsMemberFormOpen((prev) => !prev);
  };

  const updateMemberField = (field, value) => {
    setMemberForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateMemberField('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitMemberContent = (event) => {
    event.preventDefault();
    const sourceBrand = userBrand.trim();
    if (!memberForm.title.trim() || !memberForm.story.trim() || !sourceBrand) return;

    const nextItem = {
      id: `mypage-member-${Date.now()}`,
      title: memberForm.title.trim(),
      type: memberForm.type,
      channel: memberForm.channel.trim(),
      url: memberForm.url.trim(),
      story: memberForm.story.trim(),
      content: [memberForm.story.trim()],
      image: memberForm.image,
      mediaKind: 'user',
      brand: sourceBrand,
      authorEmail: user.email,
      authorName: userName,
      date: new Date().toISOString().slice(0, 10),
      popularity: 50,
      createdAt: new Date().toISOString()
    };

    const nextItems = [nextItem, ...memberContentItems];
    writeStoredList(MEMBER_STORAGE_KEY, nextItems);
    setMemberContentItems(nextItems);
    setMemberForm({ title: '', type: MEMBER_CONTENT_TYPES[0], channel: '', url: '', story: '', image: '' });
    setMemberMessage('세로 회원사 콘텐츠가 등록되었습니다.');
    window.setTimeout(() => setMemberMessage(''), 2600);
  };

  const startEditMemberItem = (item) => {
    setEditingMemberItem(item);
    setMemberEditForm({
      title: item.title || '',
      type: item.type || MEMBER_CONTENT_TYPES[0],
      channel: item.channel || '',
      url: item.url || '',
      story: item.story || '',
      image: item.image || ''
    });
  };

  const updateMemberEditField = (field, value) => {
    setMemberEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberEditImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateMemberEditField('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveMemberEdit = (event) => {
    event.preventDefault();
    if (!editingMemberItem) return;
    if (!memberEditForm.title.trim() || !memberEditForm.story.trim()) return;

    try {
      const stored = readStoredList(MEMBER_STORAGE_KEY);
      const nextItems = stored.map((item) => (
        item.id === editingMemberItem.id
          ? {
              ...item,
              title: memberEditForm.title.trim(),
              type: memberEditForm.type,
              channel: memberEditForm.channel.trim(),
              url: memberEditForm.url.trim(),
              story: memberEditForm.story.trim(),
              content: [memberEditForm.story.trim()],
              image: memberEditForm.image,
              updatedAt: new Date().toISOString()
            }
          : item
      ));
      writeStoredList(MEMBER_STORAGE_KEY, nextItems);
      setMemberContentItems(nextItems);
      setEditingMemberItem(null);
      alert('세로 회원사 콘텐츠가 수정되었습니다.');
    } catch {
      alert('콘텐츠 수정 중 오류가 발생했습니다.');
    }
  };

  const deleteMemberItem = (id) => {
    if (!confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) return;

    try {
      const stored = readStoredList(MEMBER_STORAGE_KEY);
      const nextItems = stored.filter((item) => item.id !== id);
      writeStoredList(MEMBER_STORAGE_KEY, nextItems);
      setMemberContentItems(nextItems);
      alert('세로 회원사 콘텐츠가 삭제되었습니다.');
    } catch {
      alert('콘텐츠 삭제 중 오류가 발생했습니다.');
    }
  };

  const removeBookmark = (id) => {
    const nextBookmarks = bookmarks.filter((item) => item.id !== id);
    writeStoredList(BOOKMARK_STORAGE_KEY, nextBookmarks);
    setBookmarks(nextBookmarks);
  };

  if (loading) {
    return (
      <main className="mypage-loading">
        <p>로그인 상태를 확인하고 있습니다.</p>
        <style jsx>{`
          .mypage-loading {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #111111;
            color: #ffffff;
            font-weight: 900;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="mypage">
      <section className="mypage-hero">
        <div className="dashboard-container">
          <div>
            <span className="eyebrow">MY SELO</span>
            <div className="mypage-title-row">
              <h1>마이페이지</h1>
              <span className={`member-grade-badge ${memberGrade.className}`}>{memberGrade.label}</span>
            </div>
            <p>{userName}님의 저장 콘텐츠, 등록 신청, 멘토링 진행, 세로토크 반응을 확인합니다.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="profile-toggle-btn" onClick={toggleProfileEdit}>
              {isProfileEditOpen ? '회원정보 수정 닫기' : '회원정보 수정'}
            </button>
            <button type="button" onClick={handleLogout}>로그아웃</button>
          </div>
        </div>

        {isProfileEditOpen && (
          <div className="dashboard-container">
            <form className="profile-edit-panel" onSubmit={saveProfile}>
              <div className="profile-edit-row">
                <div className="profile-edit-field">
                  <label>이름 / 담당자명</label>
                  <input
                    required
                    value={profileForm.name}
                    onChange={(e) => updateProfileField('name', e.target.value)}
                    placeholder="홍길동"
                  />
                </div>
                <div className="profile-edit-field">
                  <label>브랜드 / 회사명</label>
                  <input
                    value={profileForm.brand}
                    onChange={(e) => updateProfileField('brand', e.target.value)}
                    placeholder="예: 밀마루 베이커리"
                  />
                </div>
              </div>
              <div className="profile-edit-field">
                <label>이메일 주소</label>
                <input value={user?.email || ''} disabled />
                <small>이메일은 여기서 변경할 수 없습니다.</small>
              </div>
              <div className="profile-edit-actions">
                <button type="submit" className="profile-save-btn" disabled={profileSaving}>
                  {profileSaving ? '저장 중...' : '저장하기'}
                </button>
                {profileMsg && <em className="profile-msg">{profileMsg}</em>}
              </div>
            </form>
          </div>
        )}
      </section>

      <section className="dashboard-container dashboard-grid">
        <article className="panel wide">
          <div className="panel-title-row">
            <span>BOOKMARK</span>
            <strong>{bookmarks.length}개 저장됨</strong>
          </div>
          <div className="bookmark-grid">
            {bookmarks.map((item) => (
              <div key={item.id} className="bookmark-card">
                {item.imageUrl && (
                  <div style={{ position: 'relative', width: '100%', height: '120px' }}>
                    <Image
                      src={item.imageUrl}
                      alt={`${item.title} 썸네일`}
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div>
                  <span>{item.type}</span>
                  <Link href={item.href}>{item.title}</Link>
                  <p>{item.excerpt}</p>
                  <button type="button" onClick={() => removeBookmark(item.id)}>삭제</button>
                </div>
              </div>
            ))}
            {bookmarks.length === 0 && (
              <div className="empty-state">
                공지사항 또는 세로 회원사 콘텐츠 상세 페이지에서 북마크를 눌러 저장해 보세요.
              </div>
            )}
          </div>
        </article>

        <article className="panel wide">
          <div className="panel-title-row">
            <div>
              <span>SERO MEMBERS</span>
              <strong>세로 회원사 콘텐츠 관리</strong>
            </div>
            <button type="button" className="panel-toggle-btn" onClick={toggleMemberForm}>
              {isMemberFormOpen ? '콘텐츠 등록 닫기' : '콘텐츠 등록'}
            </button>
          </div>

          {isMemberFormOpen && (
            <form className="dashboard-form" onSubmit={submitMemberContent}>
              <input required value={memberForm.title} onChange={(event) => updateMemberField('title', event.target.value)} placeholder="콘텐츠 제목" />
              <select value={memberForm.type} onChange={(event) => updateMemberField('type', event.target.value)}>
                {MEMBER_CONTENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {userBrand && <small className="source-helper">회원가입 정보의 브랜드/회사명({userBrand})이 출처로 자동 포함됩니다.</small>}
              <input value={memberForm.channel} onChange={(event) => updateMemberField('channel', event.target.value)} placeholder="채널 예: YouTube, Instagram" />
              <input value={memberForm.url} onChange={(event) => updateMemberField('url', event.target.value)} placeholder="원본 콘텐츠 링크 (선택)" />
              <input type="file" accept="image/*" onChange={handleMemberImageUpload} />
              <textarea required value={memberForm.story} onChange={(event) => updateMemberField('story', event.target.value)} placeholder="브랜드 스토리 / 콘텐츠 소개" />
              <button type="submit">회원사 콘텐츠 저장</button>
              {memberMessage && <em>{memberMessage}</em>}
            </form>
          )}

          <div className="reaction-grid">
            {myMemberContents.map((item) => (
              <div key={item.id} className="reaction-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px' }}>
                <div>
                  {item.image && (
                    <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                      <Image
                        src={item.image}
                        alt={`${item.title} 이미지`}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <span className="talk-type-tag" style={{ display: 'inline-block', fontSize: '10px', background: 'var(--color-orange-accent)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {item.type}
                  </span>
                  <strong style={{ display: 'block', fontSize: '16px', margin: '8px 0 6px', color: 'var(--color-charcoal-deep)' }}>{item.title}</strong>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {item.brand} · {item.channel || '채널 미입력'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => startEditMemberItem(item)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', color: '#3f3f46', transition: 'background-color 0.2s' }}
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMemberItem(item.id)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', transition: 'background-color 0.2s' }}
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            ))}
            {myMemberContents.length === 0 && (
              <div className="empty-state">아직 등록한 세로 회원사 콘텐츠가 없습니다. 위 버튼으로 새 콘텐츠를 등록해 보세요.</div>
            )}
          </div>
        </article>

        <article className="panel wide">
          <div className="panel-title-row">
            <div>
              <span>SHOP UPLOAD</span>
              <strong>회원사 상품 게시물 관리</strong>
            </div>
            <button type="button" className="panel-toggle-btn" onClick={toggleShopForm}>
              {isShopFormOpen ? '상품 등록 닫기' : '상품 콘텐츠 등록'}
            </button>
          </div>

          {isShopFormOpen && (
            <form className="dashboard-form" onSubmit={submitShopItem}>
              <input required value={shopForm.name} onChange={(event) => updateShopField('name', event.target.value)} placeholder="상품명" />
              <input required value={shopForm.brand} onChange={(event) => updateShopField('brand', event.target.value)} placeholder="브랜드/회원사명" />
              {userBrand && <small className="source-helper">회원가입 정보의 브랜드/회사명이 출처로 자동 포함됩니다.</small>}
              <input value={shopForm.price} onChange={(event) => updateShopField('price', event.target.value)} placeholder="가격 예: 22,900원" />
              <input type="file" accept="image/*" onChange={handleShopImageUpload} />
              <textarea value={shopForm.description} onChange={(event) => updateShopField('description', event.target.value)} placeholder="상품 소개" />
              <button type="submit">쇼핑 콘텐츠 저장</button>
              {message && <em>{message}</em>}
            </form>
          )}

          <div className="reaction-grid">
            {myShopItems.map((item) => (
              <div key={item.id} className="reaction-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px' }}>
                <div>
                  {item.img && (
                    <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                      <Image
                        src={item.img}
                        alt={`${item.name} 이미지`}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <strong style={{ display: 'block', fontSize: '16px', margin: '0 0 6px 0', color: 'var(--color-charcoal-deep)' }}>{item.name}</strong>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {item.brand} · {item.price || '가격 미정'} · {item.status || '검토중'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => startEditShopItem(item)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', color: '#3f3f46', transition: 'background-color 0.2s' }}
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteShopItem(item.id)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', transition: 'background-color 0.2s' }}
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            ))}
            {myShopItems.length === 0 && (
              <div className="empty-state">아직 등록한 상품 게시물이 없습니다. 위 버튼으로 새 상품을 등록해 보세요.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title-row">
            <span>MENTORING</span>
            <strong>진행사항 브리핑</strong>
          </div>
          <div className="timeline-list">
            {mentoringBriefs.slice(0, 4).map((item) => (
              <div key={item.id || item.createdAt}>
                <span>{item.step}</span>
                <strong>{item.brand || '멘토링 신청'}</strong>
                <p>{item.field || '상담 분야'} · {item.next}</p>
              </div>
            ))}
            {mentoringBriefs.length === 0 && (
              <div className="empty-state">아직 저장된 멘토링 신청이 없습니다.</div>
            )}
          </div>
          <Link href="/mentoring-day" className="text-link">멘토링 신청하러 가기 →</Link>
        </article>

        <article className="panel wide">
          <div className="panel-title-row">
            <span>SERO TALK</span>
            <strong>내 게시물 관리</strong>
          </div>
          <div className="reaction-grid">
            {talkReports.map((post) => (
              <div key={post.id} className="reaction-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px' }}>
                <div>
                  <span className="talk-type-tag" style={{ display: 'inline-block', fontSize: '10px', background: 'var(--color-orange-accent)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {post.type}
                  </span>
                  <strong style={{ display: 'block', fontSize: '16px', margin: '8px 0', color: 'var(--color-charcoal-deep)' }}>{post.title}</strong>
                  <p style={{ fontSize: '13px', color: '#666', margin: '0 0 12px 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {post.content || '(내용 없음)'}
                  </p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    <b>{post.views}</b> 조회 · <b>{post.comments}</b> 댓글 · <b>{post.likes}</b> 좋아요
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: 'auto' }}>
                  <button 
                    type="button" 
                    onClick={() => startEditPost(post)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12px', background: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', color: '#3f3f46', transition: 'background-color 0.2s' }}
                  >
                    수정하기
                  </button>
                  <button 
                    type="button" 
                    onClick={() => deletePost(post.id)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '12px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', transition: 'background-color 0.2s' }}
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            ))}
            {talkReports.length === 0 && (
              <div className="empty-state">세로 토크에 올린 게시물이 아직 없습니다.</div>
            )}
          </div>
          <Link href="/sero-talk" className="text-link">세로 토크 글쓰기 →</Link>
        </article>
      </section>

      {editingPost && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-card glass-panel animate-fade-in" role="dialog" aria-modal="true">
            <h3>게시글 수정</h3>
            <form onSubmit={saveEditPost}>
              <div className="edit-form-group">
                <label>제목</label>
                <input 
                  required 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)} 
                  placeholder="제목을 입력해 주세요" 
                />
              </div>
              <div className="edit-form-group">
                <label>내용</label>
                <textarea 
                  required 
                  value={editContent} 
                  onChange={(e) => setEditContent(e.target.value)} 
                  placeholder="내용을 입력해 주세요" 
                  rows={6}
                />
              </div>
              <div className="edit-modal-actions">
                <button type="submit" className="save-btn">저장하기</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingPost(null)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingShopItem && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-card glass-panel animate-fade-in" role="dialog" aria-modal="true">
            <h3>상품 게시글 수정</h3>
            <form onSubmit={saveShopEdit}>
              <div className="edit-form-group">
                <label>상품명</label>
                <input
                  required
                  value={shopEditForm.name}
                  onChange={(e) => updateShopEditField('name', e.target.value)}
                  placeholder="상품명을 입력해 주세요"
                />
              </div>
              <div className="edit-form-group">
                <label>브랜드/회원사명</label>
                <input
                  required
                  value={shopEditForm.brand}
                  onChange={(e) => updateShopEditField('brand', e.target.value)}
                  placeholder="브랜드/회원사명"
                />
              </div>
              <div className="edit-form-group">
                <label>가격</label>
                <input
                  value={shopEditForm.price}
                  onChange={(e) => updateShopEditField('price', e.target.value)}
                  placeholder="가격 예: 22,900원"
                />
              </div>
              <div className="edit-form-group">
                <label>상품 이미지</label>
                <input type="file" accept="image/*" onChange={handleShopEditImageUpload} />
                {shopEditForm.img && (
                  <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                    <Image
                      src={shopEditForm.img}
                      alt="상품 이미지 미리보기"
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              <div className="edit-form-group">
                <label>상품 소개</label>
                <textarea
                  value={shopEditForm.description}
                  onChange={(e) => updateShopEditField('description', e.target.value)}
                  placeholder="상품 소개를 입력해 주세요"
                  rows={4}
                />
              </div>
              <div className="edit-modal-actions">
                <button type="submit" className="save-btn">저장하기</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingShopItem(null)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingMemberItem && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-card glass-panel animate-fade-in" role="dialog" aria-modal="true">
            <h3>세로 회원사 콘텐츠 수정</h3>
            <form onSubmit={saveMemberEdit}>
              <div className="edit-form-group">
                <label>제목</label>
                <input
                  required
                  value={memberEditForm.title}
                  onChange={(e) => updateMemberEditField('title', e.target.value)}
                  placeholder="콘텐츠 제목을 입력해 주세요"
                />
              </div>
              <div className="edit-form-group">
                <label>콘텐츠 유형</label>
                <select value={memberEditForm.type} onChange={(e) => updateMemberEditField('type', e.target.value)}>
                  {MEMBER_CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="edit-form-group">
                <label>채널</label>
                <input
                  value={memberEditForm.channel}
                  onChange={(e) => updateMemberEditField('channel', e.target.value)}
                  placeholder="채널 예: YouTube, Instagram"
                />
              </div>
              <div className="edit-form-group">
                <label>원본 콘텐츠 링크</label>
                <input
                  value={memberEditForm.url}
                  onChange={(e) => updateMemberEditField('url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="edit-form-group">
                <label>대표 이미지</label>
                <input type="file" accept="image/*" onChange={handleMemberEditImageUpload} />
                {memberEditForm.image && (
                  <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                    <Image
                      src={memberEditForm.image}
                      alt="콘텐츠 이미지 미리보기"
                      fill
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>
              <div className="edit-form-group">
                <label>브랜드 스토리 / 콘텐츠 소개</label>
                <textarea
                  required
                  value={memberEditForm.story}
                  onChange={(e) => updateMemberEditField('story', e.target.value)}
                  placeholder="브랜드 스토리 / 콘텐츠 소개를 입력해 주세요"
                  rows={4}
                />
              </div>
              <div className="edit-modal-actions">
                <button type="submit" className="save-btn">저장하기</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingMemberItem(null)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .mypage {
          background: #f8f8f8;
          color: #161616;
          min-height: 100vh;
        }

        .edit-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .edit-modal-card {
          max-width: 500px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          background: #ffffff;
          padding: 30px;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .edit-modal-card h3 {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 20px 0;
          color: var(--color-charcoal-deep);
        }

        .edit-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .edit-form-group label {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-gray-dark);
        }

        .edit-form-group input, .edit-form-group select, .edit-form-group textarea {
          padding: 10px 12px;
          font-size: 14px;
          border: 1px solid #d4d4d8;
          border-radius: 4px;
          font-family: inherit;
        }

        .edit-modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .edit-modal-actions button {
          flex: 1;
          height: 44px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .save-btn {
          background: var(--color-orange-accent);
          color: #ffffff;
          border: none;
        }

        .save-btn:hover {
          background: var(--color-charcoal-deep);
        }

        .cancel-btn {
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          color: #3f3f46;
        }

        .cancel-btn:hover {
          background: #e4e4e7;
        }

        .dashboard-container {
          width: min(100%, 1440px);
          margin: 0 auto;
          padding-left: clamp(20px, 4vw, 56px);
          padding-right: clamp(20px, 4vw, 56px);
        }

        .mypage-hero {
          margin-top: var(--header-height);
          background: #111111;
          color: #ffffff;
        }

        .mypage-hero .dashboard-container {
          min-height: 300px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          padding-top: 80px;
          padding-bottom: 48px;
        }

        .eyebrow,
        .panel-title-row span {
          display: block;
          margin-bottom: 14px;
          color: #ff5a2a;
          font-family: var(--font-family-condensed);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        h1 {
          color: #ffffff;
          font-family: var(--font-family-condensed);
          font-size: clamp(48px, 7vw, 104px);
          font-weight: 900;
          line-height: 1;
        }

        .mypage-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .member-grade-badge {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .member-grade-badge.grade-full {
          background: #ff5a2a;
          color: #ffffff;
        }

        .member-grade-badge.grade-general {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #ffffff;
        }

        .member-grade-badge.grade-admin {
          background: #ffd23f;
          color: #111111;
        }

        .mypage-hero p {
          max-width: 760px;
          margin-top: 18px;
          color: #d7d7d7;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.6;
          word-break: keep-all;
        }

        .mypage-hero button,
        .dashboard-form button,
        .bookmark-card button {
          min-height: 44px;
          padding: 0 18px;
          background: #ff5a2a;
          color: #ffffff;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: background var(--transition-smooth);
        }

        .profile-toggle-btn {
          background: transparent !important;
          border: 1px solid #ffffff !important;
          color: #ffffff !important;
        }

        .profile-toggle-btn:hover {
          background: #ffffff !important;
          color: #111111 !important;
        }

        .panel-toggle-btn {
          min-height: 44px;
          padding: 0 18px;
          background: transparent;
          border: 1px solid #ff5a2a;
          color: #ff5a2a;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: background var(--transition-smooth), color var(--transition-smooth);
          white-space: nowrap;
        }

        .panel-toggle-btn:hover {
          background: #ff5a2a;
          color: #ffffff;
        }

        .profile-edit-panel {
          margin-top: 24px;
          padding: 28px;
          background: #1c1c1c;
          border: 1px solid #333333;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .profile-edit-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .profile-edit-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .profile-edit-field label {
          color: #ff5a2a;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .profile-edit-field input {
          height: 46px;
          padding: 0 14px;
          border: 1px solid #3a3a3a;
          background: #111111;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
        }

        .profile-edit-field input:disabled {
          color: #888888;
          cursor: not-allowed;
        }

        .profile-edit-field small {
          color: #888888;
          font-size: 12px;
          font-weight: 700;
        }

        .profile-edit-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .profile-save-btn {
          min-height: 44px;
          padding: 0 20px;
          background: #ff5a2a;
          color: #ffffff;
          font-weight: 900;
          border: none;
          cursor: pointer;
        }

        .profile-save-btn:hover {
          background: #e04a1f;
        }

        .profile-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .profile-msg {
          color: #ff5a2a;
          font-style: normal;
          font-weight: 900;
          font-size: 13px;
        }

        @media (min-width: 640px) {
          .profile-edit-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        .mypage-hero button:hover,
        .dashboard-form button:hover,
        .bookmark-card button:hover {
          background: #e04a1f;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          padding-top: 80px;
          padding-bottom: 120px;
        }

        .panel {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          padding: clamp(24px, 4vw, 56px);
        }

        .panel-title-row {
          margin-bottom: 30px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 18px;
        }

        .panel-title-row strong {
          color: #111111;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: -0.02em;
          font-family: var(--font-family-condensed);
        }

        .bookmark-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .bookmark-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: center;
          border: 1px solid #e6e6e6;
          padding: 24px;
        }

        .bookmark-card img {
          width: 100%;
          height: 120px;
          object-fit: cover;
        }

        .bookmark-card span,
        .reaction-card span,
        .mini-list span,
        .timeline-list span {
          color: #ff5a2a;
          font-size: 12px;
          font-weight: 900;
        }

        .bookmark-card a,
        .reaction-card strong,
        .mini-list strong,
        .timeline-list strong {
          display: block;
          margin: 6px 0;
          color: #161616;
          font-size: 18px;
          font-weight: 900;
          line-height: 1.35;
        }

        .bookmark-card p,
        .timeline-list p {
          color: #666666;
          font-size: 14px;
          line-height: 1.6;
        }

        .bookmark-card button {
          min-height: 34px;
          margin-top: 10px;
          background: #111111;
          font-size: 13px;
        }

        .dashboard-form,
        .mini-list,
        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .dashboard-form input,
        .dashboard-form select,
        .dashboard-form textarea {
          width: 100%;
          border: 1px solid #d8d8d8;
          padding: 13px 14px;
          font: inherit;
          font-weight: 700;
          background: #ffffff;
        }

        .dashboard-form textarea {
          min-height: 118px;
          resize: vertical;
        }

        .dashboard-form em {
          color: #ff5a2a;
          font-style: normal;
          font-weight: 900;
        }

        .source-helper {
          margin-top: -6px;
          color: #777777;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.5;
        }

        .mini-list {
          margin-top: 22px;
          border-top: 1px solid #e0e0e0;
          padding-top: 16px;
        }

        .mini-list div,
        .timeline-list div,
        .reaction-card {
          border: 1px solid #e6e6e6;
          padding: 16px;
        }

        .reaction-card div {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          color: #666666;
          font-size: 14px;
          font-weight: 800;
        }

        .reaction-card b {
          color: #161616;
          margin-right: -10px;
        }

        .empty-state {
          border: 1px dashed #cfcfcf;
          padding: 24px;
          color: #666666;
          font-weight: 800;
          line-height: 1.6;
        }

        .text-link {
          display: inline-flex;
          margin-top: 18px;
          color: #161616;
          font-weight: 900;
          border-bottom: 2px solid #ff5a2a;
        }

        @media (min-width: 980px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .panel.wide {
            grid-column: span 2;
          }

          .bookmark-grid,
          .reaction-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .mypage-hero .dashboard-container {
            align-items: flex-start;
            flex-direction: column;
          }

          .bookmark-card {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </main>
  );
}
