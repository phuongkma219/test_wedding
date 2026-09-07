'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Gift, Heart, MapPin, Music2, Pause, Sparkles, X } from 'lucide-react';

const photos = ['/assets/gallery-1.jpg','/assets/gallery-2.jpg','/assets/gallery-3.jpg','/assets/gallery-4.jpg','/assets/gallery-5.jpg','/assets/gallery-6.jpg'];
const wishesSeed = [
  ['Mỹ Linh', 'Chúc hai bạn trăm năm hạnh phúc, vạn sự như ý, một đám cưới thật vui!'],
  ['Trọng Nhân', 'Chúc mừng hai bạn về chung một nhà! Chúc luôn vui vẻ và yêu thương nhau thật nhiều.'],
  ['Phương Vy', 'Chúc Nam và Thanh mãi ngọt ngào như ngày đầu, hạnh phúc trọn đời bên nhau!'],
  ['Hải Đăng', 'Chúc mừng anh chị! Chúc hai người xây dựng tổ ấm thật hạnh phúc và bền lâu.'],
];

function Botanical({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return <img alt="" aria-hidden="true" className={`botanical ${flip ? 'flip' : ''} ${className}`} src="/assets/flower2-decoration.webp" />;
}
function PaperCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`paper-card ${className}`}>{children}</div>;
}
function DateMark() {
  return <div className="date-mark"><div><small>THỨ BẢY</small></div><strong>03</strong><div><small>THÁNG 01</small></div></div>;
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [music, setMusic] = useState(false);
  const [gallery, setGallery] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [rsvp, setRsvp] = useState(false);
  const [gift, setGift] = useState(false);
  const [sent, setSent] = useState(false);
  const [wishes, setWishes] = useState(wishesSeed);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStart = useRef(0);
  const calendarDays = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [opened]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setGallery(null); setRsvp(false); setGift(false); }
      if (gallery !== null && event.key === 'ArrowRight') setGallery((gallery + 1) % photos.length);
      if (gallery !== null && event.key === 'ArrowLeft') setGallery((gallery + photos.length - 1) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gallery]);

  useEffect(() => {
    if (!opened || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const speed = 50;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    let frame = 0;
    let startTime: number | undefined;
    let paused = false;
    let wheelDistance = 0;

    const currentScroll = () => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    const pause = () => { paused = true; };
    const resume = () => {
      startTime = performance.now() - currentScroll() / speed * 1000;
      paused = false;
    };
    const step = (time: number) => {
      if (paused) { frame = requestAnimationFrame(step); return; }
      if (startTime === undefined) startTime = time;
      const nextPosition = (time - startTime) / 1000 * speed;
      window.scrollTo(0, nextPosition);
      const atBottom = currentScroll() + window.innerHeight >= document.documentElement.scrollHeight - 10;
      if (!atBottom) frame = requestAnimationFrame(step);
    };
    const onWheel = (event: WheelEvent) => {
      wheelDistance += Math.abs(event.deltaY);
      if (wheelDistance >= 50) pause();
    };
    const onTouch = () => pause();
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest('img, button, a, input, textarea, select, video, audio, iframe, dialog, [role="dialog"], .modal');
      if (interactive) pause();
      else if (paused) resume();
      else pause();
    };
    const onFocus = (event: FocusEvent) => {
      if ((event.target as HTMLElement).matches('input, textarea, select, [contenteditable="true"]')) pause();
    };

    const timer = window.setTimeout(() => { frame = requestAnimationFrame(step); }, 2000);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('focusin', onFocus);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('click', onClick);
      window.removeEventListener('focusin', onFocus);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [opened]);

  function openInvitation() {
    if (opening) return;
    setOpening(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5;
      audio.play().then(() => setMusic(true)).catch(() => setMusic(false));
    }
    window.setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setOpened(true);
    }, 820);
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setMusic(true)).catch(() => setMusic(false));
    else { audio.pause(); setMusic(false); }
  }

  function changePhoto(direction: number) {
    setZoomed(false);
    setGallery(current => current === null ? null : (current + direction + photos.length) % photos.length);
  }

  function addCalendar() {
    const content = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','DTSTART:20260103T110000Z','DTEND:20260103T140000Z','SUMMARY:Tiệc cưới Hoàng Nam & Phương Thanh','LOCATION:White Palace, 194 Hoàng Văn Thụ, TP. Hồ Chí Minh','END:VEVENT','END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar' }));
    const link = document.createElement('a'); link.href = url; link.download = 'dam-cuoi-hoang-nam-phuong-thanh.ics'; link.click(); URL.revokeObjectURL(url);
  }
  function submitWish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim(); const message = String(data.get('message') || '').trim();
    if (!name || !message) return;
    setWishes([[name, message], ...wishes]); event.currentTarget.reset(); setSent(true); setTimeout(() => setSent(false), 2200);
  }

  return <>
    <main className={`invitation-shell ${opened ? 'is-open' : ''}`}>
      <section className="hero-section section-wide reveal">
        <p className="eyebrow">THE WEDDING OF</p>
        <h1 className="hero-names">Hoàng Nam <span>&</span> Phương Thanh</h1>
        <div className="polaroid-wrap"><div className="tape" /><div className="polaroid"><img src="/assets/couple-main.jpg" alt="Hoàng Nam và Phương Thanh" /></div><img className="frame-overlay" alt="" src="/assets/frame-avatar.webp" /><Botanical className="hero-flower" /><div className="wax-seal"><Heart size={27} strokeWidth={1.4} /></div></div>
      </section>

      <section className="ceremony-section section-wide reveal">
        <PaperCard className="ceremony-card">
          <p className="section-kicker">THÔNG TIN LỄ CƯỚI</p>
          <div className="parents"><div><small>Ông Bà</small><b>Trần Quốc Hưng</b><b>Nguyễn Thị Hồng</b><span>Quận 1, TP. Hồ Chí Minh</span></div><div><small>Ông Bà</small><b>Lê Văn Thành</b><b>Phạm Thị Lan</b><span>Quận 3, TP. Hồ Chí Minh</span></div></div>
          <p className="announcement">TRÂN TRỌNG BÁO TIN<br />LỄ THÀNH HÔN CỦA CON CHÚNG TÔI</p>
          <h2>Đặng Hoàng Nam</h2><em>TRƯỞNG NAM</em><div className="ampersand">&</div><h2>Nguyễn Phương Thanh</h2><em>ÚT NỮ</em>
          <p className="ceremony-copy">LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI<br />TƯ GIA<br /><br />VÀO LÚC</p><div className="big-time">09:00</div><DateMark /><p className="year">2026</p><p className="lunar">(TỨC NGÀY 15 THÁNG 11 NĂM ẤT TỴ)</p>
        </PaperCard><img className="leaf leaf-left" alt="" src="/assets/leaf-background.webp" /><Botanical className="flower-right" />
      </section>

      <section className="gallery-section reveal"><h2 className="section-title">ALBUM ẢNH</h2><div className="gallery-grid">{photos.slice(0, 4).map((photo, index) => <button key={photo} onClick={() => setGallery(index)} aria-label={`Xem ảnh cưới ${index + 1}`}><img src={photo} alt={`Ảnh cưới ${index + 1}`} />{index === 3 && <span>+2</span>}</button>)}</div></section>

      <section className="party-section section-wide reveal"><PaperCard className="party-card">
        <p className="section-kicker">THÔNG TIN TIỆC CƯỚI</p><h2>TIỆC CƯỚI SẼ DIỄN RA VÀO LÚC:</h2><div className="big-time">18:00</div><DateMark /><p className="year">2026</p><p className="lunar">(TỨC NGÀY 15 THÁNG 11 NĂM ẤT TỴ)</p>
        <div className="reception-times"><div><span>ĐÓN KHÁCH</span><b>17:30</b></div><div><span>KHAI TIỆC</span><b>18:00</b></div></div>
        <div className="calendar-box"><h3>Tháng 1 / 2026</h3><div className="weekdays">{['T2','T3','T4','T5','T6','T7','CN'].map(d => <b key={d}>{d}</b>)}</div><div className="calendar-days"><i /><i /><i />{calendarDays.map(d => <span className={d === 3 ? 'chosen' : ''} key={d}>{d}{d === 3 && <Heart size={11} fill="currentColor" />}</span>)}</div></div>
        <button className="text-link" onClick={addCalendar}>Thêm vào lịch</button><button className="primary-button" onClick={() => setRsvp(true)}>XÁC NHẬN THAM DỰ</button>
      </PaperCard><img className="leaf leaf-party" alt="" src="/assets/leaf-background.webp" /><Botanical className="flower-party" /></section>

      <section className="location-section reveal"><h2 className="section-title">TIỆC CƯỚI SẼ TỔ CHỨC TẠI</h2><p>Trung Tâm Hội Nghị White Palace, 194 Hoàng Văn Thụ,<br />Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh</p><iframe title="Bản đồ Trung Tâm Hội Nghị White Palace" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAY8WQxGig6axA_jZil94btO9G6dhsFEKg&q=Trung%20T%C3%A2m%20H%E1%BB%99i%20Ngh%E1%BB%8B%20White%20Palace%2C%20194%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5%2C%20Ph%C6%B0%E1%BB%9Dng%209%2C%20Qu%E1%BA%ADn%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh" /></section>

      <section className="details-section section-wide reveal"><div className="church-wash" /><div className="dress-code"><h2 className="section-title">DRESS CODE</h2><p>Trang phục dự tiệc</p><div className="swatches"><i /><i /><i /><i /></div></div><PaperCard className="timeline-card"><h2 className="section-title">LỊCH TRÌNH NGÀY CƯỚI</h2>{[['17:00','Đón khách',<Gift key="g" />],['18:00','Khai tiệc',<MapPin key="m" />],['18:30','Nghi thức cưới',<Heart key="h" />],['19:00','Cắt bánh & nâng ly',<Sparkles key="s" />],['20:30','Kết thúc tiệc',<Check key="c" />]].map(([time,title,icon]) => <div className="timeline-row" key={String(time)}><b>{time}</b><span>{icon}</span><p>{title}</p></div>)}</PaperCard><Botanical className="flower-timeline" /></section>

      <section className="guestbook-section section-wide reveal"><PaperCard className="guestbook-card"><h2 className="section-title">SỔ LƯU BÚT</h2><form onSubmit={submitWish}><input name="name" aria-label="Tên của bạn" placeholder="Nhập tên*" required /><textarea name="message" aria-label="Lời chúc" placeholder="Nhập lời chúc*" required /><div className="form-foot"><Sparkles size={18} /><button className="primary-button" type="submit">GỬI LỜI CHÚC</button></div>{sent && <p className="success-message">Lời chúc của bạn đã được lưu trên thiết bị này.</p>}</form></PaperCard><img className="leaf leaf-guest" alt="" src="/assets/leaf-background.webp" /><div className="wish-list">{wishes.map(([name,message], index) => <article key={`${name}-${index}`}><header><b>{name}</b><time>21:20 · 03/01/2026</time></header><p>{message}</p></article>)}</div></section>

      <section className="gift-section section-wide reveal"><h2 className="section-title">HỘP QUÀ MỪNG</h2><button className="gift-button" onClick={() => setGift(true)} aria-label="Mở hộp quà mừng"><i className="gift-sparkle sparkle-one">✦</i><i className="gift-sparkle sparkle-two">✦</i><i className="gift-sparkle sparkle-three">✦</i><span className="gift-visual"><img src="/assets/giftbox.webp" alt="" /></span><span className="gift-hint">Nhấn để mở</span></button><p>Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!</p><small>♡ Hoàng Nam & Phương Thanh</small></section>
    </main>

    <audio ref={audioRef} src="/assets/la-anh.mp3" loop preload="auto" data-video-audio="true" data-music-track-id="romantic-012" />
    <div className={`opening-cover ${opening ? 'opening-cover--opening' : ''} ${opened ? 'opening-cover--hidden' : ''}`} aria-hidden={opened}>
      <div className="falling-leaves" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} className={`falling-leaf leaf-${index + 1}`}><svg viewBox="0 0 24 24"><path d="M20.8 3.2C13.6 3 7.2 5.7 4.6 10.4c-1.8 3.3-.8 6.9 1.4 8.6 2.4 1.9 6.4 1.2 8.6-1.5 3.3-4 3.9-9.2 6.2-14.3ZM4.2 20.2c3.2-4.7 7.3-8.3 12.3-10.8" /></svg></span>)}</div>
      <div className="envelope-card"><Botanical className="cover-flower left" /><Botanical className="cover-flower right" flip /><div className="heart-medallion"><Heart fill="white" /></div><h2>Hoàng Nam <small>&</small> Phương Thanh</h2><div className="divider"><i />❦<i /></div><p>3 tháng 1, 2026</p><p>Thân Mời</p><button onClick={openInvitation}>Mở thiệp</button></div>
    </div>
    {opened && <button className={`music-button ${music ? 'is-playing' : ''}`} onClick={toggleMusic} aria-label={music ? 'Tạm dừng nhạc' : 'Phát nhạc'}>{music ? <Music2 size={18} /> : <Pause size={18} />}</button>}

    {gallery !== null && <div className="modal gallery-modal" role="dialog" aria-modal="true" aria-label="Album ảnh cưới" onClick={() => setGallery(null)} onTouchStart={event => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={event => { const delta = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 50) changePhoto(delta > 0 ? -1 : 1); }}>
      <span className="gallery-count">{gallery + 1} / {photos.length}</span><button className="modal-close" onClick={() => setGallery(null)} aria-label="Đóng"><X /></button>
      <div className="gallery-stage" onClick={event => event.stopPropagation()}>
        <button className="gallery-arrow left" onClick={() => changePhoto(-1)} aria-label="Ảnh trước"><ChevronLeft /></button><img className={zoomed ? 'zoomed' : ''} onDoubleClick={() => setZoomed(!zoomed)} src={photos[gallery]} alt={`Ảnh cưới ${gallery + 1}`} /><button className="gallery-arrow right" onClick={() => changePhoto(1)} aria-label="Ảnh sau"><ChevronRight /></button>
      </div>
      <div className="gallery-thumbnails" onClick={event => event.stopPropagation()}>{photos.map((photo, index) => <button key={photo} className={gallery === index ? 'active' : ''} onClick={() => { setGallery(index); setZoomed(false); }} aria-label={`Chuyển đến ảnh ${index + 1}`}><img src={photo} alt="" /></button>)}</div>
    </div>}
    {rsvp && <div className="modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title"><PaperCard className="dialog-card"><button className="dialog-x" onClick={() => setRsvp(false)} aria-label="Đóng"><X /></button><CalendarDays size={24} /><h2 id="rsvp-title">XÁC NHẬN THAM DỰ</h2><p>Niềm vui của chúng mình sẽ trọn vẹn hơn khi có bạn.</p><form onSubmit={(e) => { e.preventDefault(); setRsvp(false); }}><input aria-label="Họ và tên" placeholder="Họ và tên*" required /><select aria-label="Xác nhận tham dự" defaultValue="yes"><option value="yes">Mình sẽ tham dự</option><option value="no">Mình rất tiếc không thể tham dự</option></select><select aria-label="Số khách" defaultValue="1"><option value="1">1 khách</option><option value="2">2 khách</option><option value="3">3 khách</option></select><button className="primary-button" type="submit">GỬI XÁC NHẬN</button></form></PaperCard></div>}
    {gift && <div className="modal" role="dialog" aria-modal="true" aria-labelledby="gift-title"><PaperCard className="dialog-card gift-dialog"><button className="dialog-x" onClick={() => setGift(false)} aria-label="Đóng"><X /></button><Gift size={28} /><h2 id="gift-title">HỘP QUÀ MỪNG</h2><p>Sự hiện diện của bạn đã là món quà quý giá nhất.</p><div className="bank-card"><b>CHÚ RỂ · ĐẶNG HOÀNG NAM</b><span>Ngân hàng ABC</span><strong>0123 456 789</strong></div><div className="bank-card"><b>CÔ DÂU · NGUYỄN PHƯƠNG THANH</b><span>Ngân hàng XYZ</span><strong>9876 543 210</strong></div></PaperCard></div>}
  </>;
}
