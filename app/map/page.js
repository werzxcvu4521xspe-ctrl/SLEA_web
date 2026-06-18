import Link from 'next/link';

const MOCK_MAP_PLACES = [
  { id: '1', name: '디저트 카페 도원', category: 'F&B', address: '세종시 조치원읍 으뜸길 12', coords: '조치원역 인근' },
  { id: '2', name: '조치원 브루어리', category: 'Culture', address: '세종시 조치원읍 양조장길 45', coords: '조치원여고 인근' },
  { id: '3', name: '한옥 찻집 단차', category: 'F&B', address: '세종시 금남면 한옥마을길 7', coords: '금남면사무소 인근' },
  { id: '4', name: '공방 세종', category: 'Craft', address: '세종시 연서면 봉암길 88', coords: '봉암리 마을회관 인근' },
  { id: '5', name: '로컬허브 나성', category: 'Space', address: '세종시 나성로 123', coords: '나성동 백화점 부지 앞' },
  { id: '6', name: '밀마루 베이커리', category: 'F&B', address: '세종시 아름동 보듬3로 8', coords: '아름동 복합커뮤니티센터 인근' }
];

export default function MapPage() {
  return (
    <div className="map-page-wrapper container">
      <div className="map-header">
        <span className="badge badge-emerald">Sejong Local Map</span>
        <h2>세종 로컬 맵 허브</h2>
        <p>세종시 곳곳에 숨어 있는 로컬 브랜드와 크리에이터 공간의 위치 정보입니다.</p>
      </div>

      <div className="map-layout">
        {/* Left: Mock Interactive Map */}
        <div className="map-display glass-panel">
          <div className="map-graphic-bg">
            <div className="map-landmark jochiwon" data-label="조치원읍">
              <span className="dot"></span>
              <span className="lbl">Jochiwon</span>
            </div>
            <div className="map-landmark naseong" data-label="나성동">
              <span className="dot"></span>
              <span className="lbl">Naseong</span>
            </div>
            <div className="map-landmark geumnam" data-label="금남면">
              <span className="dot"></span>
              <span className="lbl">Geumnam</span>
            </div>
            
            <div className="pins-container">
              <div className="pin-marker p1">📍</div>
              <div className="pin-marker p2">📍</div>
              <div className="pin-marker p3">📍</div>
              <div className="pin-marker p4">📍</div>
              <div className="pin-marker p5">📍</div>
              <div className="pin-marker p6">📍</div>
            </div>
          </div>
          <div className="map-legend">
            <span>💡 마커(📍)를 클릭하여 상세 창업가 스토리 및 로드맵으로 바로 이동할 수 있습니다.</span>
          </div>
        </div>

        {/* Right: List of Places with addresses */}
        <div className="places-sidebar glass-panel">
          <h3 className="sidebar-title">등록된 로컬 공간 목록</h3>
          <div className="places-list">
            {MOCK_MAP_PLACES.map((place) => (
              <div key={place.id} className="sidebar-place-item">
                <div className="place-item-header">
                  <span className="badge badge-apply">{place.category}</span>
                  <Link href={`/archive/${place.id}`} className="place-name-link">
                    {place.name}
                  </Link>
                </div>
                <p className="place-addr">{place.address}</p>
                <span className="place-coords-note">🎯 {place.coords}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
