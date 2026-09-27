/**
 * Re:Connect - 동창회 초대장 인터랙티브 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initPhotoSlider();
  initCountdown();
  initMap();
  initRSVP();
  initShareAndCopy();
  initBgm();
  initScrollHint();
});

/* ==========================================================================
   1. 배경 파티클 (빛망울 & 꽃잎 효과)
   ========================================================================== */
function initParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;

  const particleCount = 18;
  const colors = [
    'rgba(245, 230, 186, 0.7)',
    'rgba(197, 155, 39, 0.4)',
    'rgba(255, 255, 255, 0.8)',
    'rgba(235, 180, 180, 0.4)'
  ];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 8 + 4; // 4px ~ 12px
    const left = Math.random() * 100;   // 0% ~ 100%
    const duration = Math.random() * 8 + 8; // 8s ~ 16s
    const delay = Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.background = color;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }
}

/* ==========================================================================
   2. [사진 섹션] - 한 장씩 부드럽게 넘기는 슬라이더 애니메이션
   ========================================================================== */
function initPhotoSlider() {
  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const indicators = document.querySelectorAll('.indicator');
  const pageCounter = document.getElementById('pageCounter');
  const autoplayBtn = document.getElementById('autoplayBtn');
  const sliderContainer = document.getElementById('photoSlider');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isAutoplay = true;
  let autoplayTimer = null;
  const slideInterval = 3500; // 3.5초 간격

  // 슬라이드 업데이트
  function updateSlider(index, animate = true) {
    currentIndex = (index + totalSlides) % totalSlides;

    if (animate) {
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      track.style.transition = 'none';
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // 인디케이터 갱신
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === currentIndex);
    });

    // 슬라이드 활성화 클래스
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    // 페이지 번호 갱신
    if (pageCounter) {
      pageCounter.textContent = `${currentIndex + 1} / ${totalSlides}`;
    }
  }

  // 다음 / 이전
  function nextSlide() {
    updateSlider(currentIndex + 1);
  }

  function prevSlide() {
    updateSlider(currentIndex - 1);
  }

  // 자동 재생 제어
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, slideInterval);
    if (autoplayBtn) {
      autoplayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      autoplayBtn.setAttribute('title', '자동 재생 일시정지');
    }
    isAutoplay = true;
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    if (autoplayBtn) {
      autoplayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      autoplayBtn.setAttribute('title', '자동 재생 시작');
    }
    isAutoplay = false;
  }

  // 버튼 이벤트
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      if (isAutoplay) startAutoplay(); // 타이머 리셋
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      if (isAutoplay) startAutoplay();
    });
  }

  // 인디케이터 클릭
  indicators.forEach(ind => {
    ind.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.target.dataset.index, 10);
      updateSlider(targetIdx);
      if (isAutoplay) startAutoplay();
    });
  });

  // 자동재생 토글 버튼
  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      if (isAutoplay) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // 모바일 터치 스와이프 제스처 지원
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  sliderContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = true;
  }, { passive: true });

  sliderContainer.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // 가로 스와이프 감지 (세로 스크롤과 구분)
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      if (isAutoplay) startAutoplay();
    }
    isSwiping = false;
  }, { passive: true });

  // 마우스 호버 시 자동 재생 일시 정지 (PC 환경 배려)
  sliderContainer.addEventListener('mouseenter', () => {
    if (isAutoplay && autoplayTimer) clearInterval(autoplayTimer);
  });

  sliderContainer.addEventListener('mouseleave', () => {
    if (isAutoplay) startAutoplay();
  });

  // 라이트박스 확대 보기 기능
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    const capTitle = slide.querySelector('.slide-caption h3')?.textContent || '';
    if (img && lightboxModal && lightboxImg) {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) lightboxCaption.textContent = capTitle;
        lightboxModal.classList.add('active');
      });
    }
  });

  if (lightboxClose && lightboxModal) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 초기화 및 자동재생 시작
  updateSlider(0, false);
  startAutoplay();
}

/* ==========================================================================
   3. [카운트다운 섹션] - 실시간 카운트다운 애니메이션 (2032.10.1 17:00:00)
   ========================================================================== */
function initCountdown() {
  // 행사 일시: 2032년 10월 1일 17:00:00 (한국 시간 KST = UTC+9)
  const targetDate = new Date('2032-10-01T17:00:00+09:00').getTime();

  const ddayPill = document.getElementById('ddayPill');
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');
  const addToCalBtn = document.getElementById('addToCalBtn');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  let lastValues = { d: '', h: '', m: '', s: '' };

  function padZero(num) {
    return String(Math.floor(num)).padStart(2, '0');
  }

  function triggerNumAnimation(el) {
    el.style.transform = 'scale(1.15)';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 200);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (ddayPill) ddayPill.textContent = '🎉 D-DAY 행사 진행 중!';
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // D-Day 뱃지 갱신
    if (ddayPill) {
      ddayPill.textContent = `D - ${days.toLocaleString()}`;
    }

    // 일/시/분/초 값 갱신 및 변경 시 애니메이션
    const strDays = String(days);
    const strHours = padZero(hours);
    const strMinutes = padZero(minutes);
    const strSeconds = padZero(seconds);

    if (strDays !== lastValues.d) {
      daysEl.textContent = strDays;
      triggerNumAnimation(daysEl);
      lastValues.d = strDays;
    }

    if (strHours !== lastValues.h) {
      hoursEl.textContent = strHours;
      triggerNumAnimation(hoursEl);
      lastValues.h = strHours;
    }

    if (strMinutes !== lastValues.m) {
      minutesEl.textContent = strMinutes;
      triggerNumAnimation(minutesEl);
      lastValues.m = strMinutes;
    }

    if (strSeconds !== lastValues.s) {
      secondsEl.textContent = strSeconds;
      triggerNumAnimation(secondsEl);
      lastValues.s = strSeconds;
    }
  }

  // 캘린더 추가 기능 (Google Calendar URL)
  if (addToCalBtn) {
    addToCalBtn.addEventListener('click', () => {
      const title = encodeURIComponent('[동창회] Re:Connect 동창회');
      const details = encodeURIComponent('세월이 흘러도 변하지 않는 우리들의 이야기, Re:Connect 동창회\n장소: 창경궁');
      const location = encodeURIComponent('창경궁 (서울특별시 종로구 창경궁로 185)');
      const dates = '20321001T080000Z/20321001T120000Z'; // UTC 기준 (한국 17:00 ~ 21:00)
      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
      window.open(calUrl, '_blank');
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   4. [지도 섹션] - 300x300픽셀 "창경궁" 구글 위치 지도
   ========================================================================== */
function initMap() {
  const googleMapUrl = 'https://www.google.com/maps/search/?api=1&query=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C+%EC%A2%85%EB%A1%9C%EA%B5%AC+%EC%B0%BD%EA%B2%BD%EA%B5%81%EB%A1%9C+185+%EC%B0%BD%EA%B2%BD%EA%B5%81';
  const googleRouteUrl = 'https://www.google.com/maps/dir/?api=1&destination=%EC%B0%BD%EA%B2%BD%EA%B5%81';

  const mainLink = document.getElementById('googleMapMainLink');
  const routeLink = document.getElementById('googleRouteLink');

  if (mainLink) mainLink.href = googleMapUrl;
  if (routeLink) routeLink.href = googleRouteUrl;
}

/* ==========================================================================
   5. RSVP 및 방명록 기능
   ========================================================================== */
function initRSVP() {
  const form = document.getElementById('rsvpForm');
  const feedList = document.getElementById('feedList');
  const guestCountEl = document.getElementById('guestCount');
  const radioCards = document.querySelectorAll('.radio-card');

  if (!form || !feedList) return;

  // 기본 초기 방명록 데이터
  const defaultMessages = [
    {
      name: '김민준 (08학번)',
      status: 'attend',
      statusText: '참석',
      msg: '오랜만에 다들 볼 생각에 벌써부터 설레네요! 창경궁에서 꼭 만나요~',
      time: '2026.09.25'
    },
    {
      name: '이지원 (09학번)',
      status: 'attend',
      statusText: '참석',
      msg: '벌써 이렇게 시간이 흘렀다니 믿기지 않네요. Re:Connect 기대됩니다!',
      time: '2026.09.26'
    }
  ];

  // 로컬 스토리지 불러오기
  let storedMessages = [];
  try {
    const raw = localStorage.getItem('reconnect_rsvps');
    storedMessages = raw ? JSON.parse(raw) : defaultMessages;
  } catch (e) {
    storedMessages = defaultMessages;
  }

  function renderGuestbook() {
    feedList.innerHTML = '';
    if (guestCountEl) {
      guestCountEl.textContent = storedMessages.length;
    }

    storedMessages.forEach(item => {
      const card = document.createElement('div');
      card.className = 'guest-card';
      card.innerHTML = `
        <div class="guest-header">
          <span class="guest-name">${escapeHtml(item.name)}</span>
          <span class="guest-status-badge ${item.status}">${item.statusText}</span>
        </div>
        <p class="guest-msg">${escapeHtml(item.msg || '소중한 마음으로 함께합니다.')}</p>
        <span class="guest-time">${item.time}</span>
      `;
      feedList.appendChild(card);
    });
  }

  // 라디오 카드 UI 토글
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // 제출 이벤트
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('guestName');
    const msgInput = document.getElementById('guestMessage');
    const statusRadio = form.querySelector('input[name="attendStatus"]:checked');

    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();
    const status = statusRadio ? statusRadio.value : 'attend';
    const statusText = status === 'attend' ? '참석' : '불참';

    if (!name) return;

    const today = new Date();
    const timeStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    const newEntry = {
      name,
      status,
      statusText,
      msg,
      time: timeStr
    };

    storedMessages.unshift(newEntry);
    try {
      localStorage.setItem('reconnect_rsvps', JSON.stringify(storedMessages));
    } catch (err) {}

    renderGuestbook();
    showToast('참석 등록 및 메시지가 전송되었습니다!');

    // 폼 리셋
    form.reset();
    radioCards.forEach(c => c.classList.remove('selected'));
    if (radioCards[0]) {
      radioCards[0].classList.add('selected');
      radioCards[0].querySelector('input').checked = true;
    }
  });

  renderGuestbook();
}

/* ==========================================================================
   6. 공유 및 주소 복사 기능
   ========================================================================== */
function initShareAndCopy() {
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const addressText = document.getElementById('addressText');
  const shareLinkBtn = document.getElementById('shareLinkBtn');
  const shareKakaoBtn = document.getElementById('shareKakaoBtn');

  // 주소 복사
  if (copyAddressBtn && addressText) {
    copyAddressBtn.addEventListener('click', () => {
      const address = addressText.textContent.trim();
      copyToClipboard(address, '창경궁 주소가 복사되었습니다.');
    });
  }

  // 링크 복사
  if (shareLinkBtn) {
    shareLinkBtn.addEventListener('click', () => {
      const currentUrl = window.location.href;
      copyToClipboard(currentUrl, '초대장 링크가 클립보드에 복사되었습니다.');
    });
  }

  // 카카오톡 공유
  if (shareKakaoBtn) {
    shareKakaoBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Re:Connect 동창회 초대장',
          text: '세월이 흘러도 변하지 않는 우리들의 이야기, Re:Connect 동창회에 초대합니다.\n2032.10.1 (토) 오후 5시 창경궁',
          url: window.location.href
        }).catch(() => {});
      } else {
        const text = `[Re:Connect 동창회 초대장]\n2032.10.1 (토) 오후 5시 창경궁\n${window.location.href}`;
        copyToClipboard(text, '초대장 공유 메시지가 복사되었습니다. 카카오톡에 붙여넣어 공유하세요!');
      }
    });
  }
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      fallbackCopyText(text, successMsg);
    });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('복사에 실패했습니다. 직접 복사해주세요.');
  }
  document.body.removeChild(textArea);
}

function showToast(msg) {
  const toast = document.getElementById('toastMessage');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function escapeHtml(string) {
  if (!string) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(string));
  return div.innerHTML;
}

/* ==========================================================================
   7. 은은한 BGM (Web Audio Synth - 잔잔하고 아늑한 멜로디 루프)
   ========================================================================== */
function initBgm() {
  const bgmBtn = document.getElementById('bgmToggleBtn');
  if (!bgmBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let synthInterval = null;

  // 감성적인 펜타토닉/메이저 아르페지오 음계 주파수 (C Major 9)
  const notes = [
    261.63, // C4
    329.63, // E4
    392.00, // G4
    493.88, // B4
    523.25, // C5
    587.33, // D5
    659.25  // E5
  ];

  function playNote(freq, time, duration = 1.2) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.04, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {}
  }

  function startMusic() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlaying = true;
    bgmBtn.classList.add('playing');
    showToast('🎵 배경 음악이 재생됩니다.');

    let step = 0;
    const melodyPattern = [0, 2, 4, 3, 1, 4, 5, 2];

    synthInterval = setInterval(() => {
      if (!isPlaying || !audioCtx) return;
      const noteIdx = melodyPattern[step % melodyPattern.length];
      const freq = notes[noteIdx % notes.length];
      playNote(freq, audioCtx.currentTime);
      step++;
    }, 600);
  }

  function stopMusic() {
    isPlaying = false;
    bgmBtn.classList.remove('playing');
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    showToast('배경 음악이 일시정지되었습니다.');
  }

  bgmBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}

/* ==========================================================================
   8. 스크롤 힌트 클릭
   ========================================================================== */
function initScrollHint() {
  const hint = document.querySelector('.scroll-down-hint');
  const invSection = document.getElementById('invitation');
  if (hint && invSection) {
    hint.addEventListener('click', () => {
      invSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}
