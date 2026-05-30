/* ==============================================
   СТАНЦИЯ АС-1 — MAIN.JS
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ——————————————————————————————
     HERO TEXT REVEAL
  —————————————————————————————— */
  const lines = document.querySelectorAll('.line-inner');
  setTimeout(() => {
    lines.forEach((line, i) => {
      const delay = parseInt(line.dataset.delay || 0);
      setTimeout(() => {
        line.classList.add('visible');
      }, delay);
    });
  }, 200);

  /* ——————————————————————————————
     HOTSPOT DATA
  —————————————————————————————— */
  const hotspotData = {
    1: {
      num: '01',
      title: 'Кабеленесущая цепь (Energy Chain)',
      desc: 'Направляет все кабели и шланги вдоль вертикальной оси. Предотвращает перегиб при движении каретки, обеспечивает ресурс более 5 млн циклов.',
      specs: ['Производитель: Igus / аналог', 'Шаг звена: 25 мм', 'Рабочий ход: до 400 мм']
    },
    2: {
      num: '02',
      title: 'Лазерный маркиратор',
      desc: 'Компактный волоконный маркиратор наносит серийные номера, QR-коды и логотипы. Управляется через интерфейс RS-232 или USB напрямую от ПЛК.',
      specs: ['Тип: волоконный / CO₂', 'Интерфейс: RS-232 / USB', 'Управление: от ПЛК-контроллера']
    },
    3: {
      num: '03',
      title: 'Вертикальная ось / Каретка (Z)',
      desc: 'Линейные направляющие с шарико-винтовой парой (ШВП) обеспечивают плавное и воспроизводимое позиционирование по оси Z с точностью до 0.05 мм.',
      specs: ['Точность: ±0.05 мм', 'Ход: до 400 мм', 'Привод: шаговый мотор + ШВП']
    },
    4: {
      num: '04',
      title: 'ПЛК и электронный модуль',
      desc: 'Программируемый логический контроллер (ПЛК) координирует все узлы: драйвер двигателя, маркиратор, датчики. Программа по стандарту IEC 61131-3.',
      specs: ['Напряжение: 24 В DC', 'Язык: Ladder / ST (IEC 61131-3)', 'Индикация: RGB LED статус']
    },
    5: {
      num: '05',
      title: 'Клеммный блок / I/O интерфейс',
      desc: 'DIN-рейка с клеммниками Phoenix Contact. Подключение датчиков конечного положения, аварийного стопа, внешних исполнительных устройств. Цветовая маркировка цепей.',
      specs: ['Монтаж: DIN-рейка', 'Стандарт: Phoenix Contact', 'Цепи: силовые + сигнальные']
    }
  };

  /* ——————————————————————————————
     HOTSPOT INTERACTIONS
  —————————————————————————————— */
  const card = document.getElementById('tooltipCard');
  const tcNum = document.getElementById('tcNum');
  const tcTitle = document.getElementById('tcTitle');
  const tcDesc = document.getElementById('tcDesc');
  const tcSpecs = document.getElementById('tcSpecs');
  const tcClose = document.getElementById('tcClose');

  let activeHotspot = null;

  document.querySelectorAll('.hotspot').forEach(hs => {
    hs.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = hs.dataset.node;
      const data = hotspotData[id];
      if (!data) return;

      if (activeHotspot === id) {
        closeCard();
        return;
      }

      activeHotspot = id;

      // Remove active from all hotspots
      document.querySelectorAll('.hotspot').forEach(h => h.style.setProperty('--active', '0'));
      hs.style.setProperty('--active', '1');
      hs.querySelector('.hs-dot').style.background = '#3af0c0';
      hs.querySelector('.hs-dot').style.boxShadow = '0 0 20px #3af0c0';

      tcNum.textContent = data.num;
      tcTitle.textContent = data.title;
      tcDesc.textContent = data.desc;

      tcSpecs.innerHTML = '';
      data.specs.forEach(s => {
        const div = document.createElement('div');
        div.className = 'tc-spec-item';
        div.textContent = s;
        tcSpecs.appendChild(div);
      });

      card.classList.add('active');
    });
  });

  tcClose.addEventListener('click', closeCard);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCard();
  });

  window.addEventListener('scroll', () => {
    if (activeHotspot !== null) closeCard();
  }, { passive: true });

  function closeCard() {
    card.classList.remove('active');
    activeHotspot = null;
    document.querySelectorAll('.hotspot .hs-dot').forEach(dot => {
      dot.style.background = '';
      dot.style.boxShadow = '';
    });
  }

  /* ——————————————————————————————
     SCROLL REVEAL
  —————————————————————————————— */
  const revealEls = document.querySelectorAll('.about-title, .about-text, .cta-btn, .comp-title, .comp-card, .spec-row, .specs-title, .footer-title, .footer-year, .footer-dept');

  revealEls.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60 * (entry.target.dataset.revealIndex || 0));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.revealIndex = i % 6;
    revealObserver.observe(el);
  });

  /* ——————————————————————————————
     STAT COUNTER ANIMATION
  —————————————————————————————— */
  const statBlocks = document.querySelectorAll('.stat-block');
  statBlocks.forEach((block, i) => {
    block.style.setProperty('--i', i);
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const numEl = entry.target.querySelector('.stat-num');
        const target = parseFloat(numEl.dataset.count);
        const isDecimal = target < 1;
        const duration = 1400;
        const startTime = performance.now();

        const update = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          numEl.textContent = isDecimal ? current.toFixed(2) : Math.round(current);

          if (progress < 1) requestAnimationFrame(update);
          else numEl.textContent = isDecimal ? target.toFixed(2) : target;
        };

        requestAnimationFrame(update);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statBlocks.forEach(block => counterObserver.observe(block));

  /* ——————————————————————————————
     SUBTLE PARALLAX ON HERO IMAGE
  —————————————————————————————— */
  const heroImg = document.querySelector('.hero-img');
  const imgFrame = document.querySelector('.img-frame');

  if (heroImg) {
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        heroImg.style.transform = `scale(1.04) translate(${dx * -6}px, ${dy * -6}px)`;
        ticking = false;
      });
    });
  }

  /* ——————————————————————————————
     COMP CARD STAGGER
  —————————————————————————————— */
  const compCards = document.querySelectorAll('.comp-card');
  const compObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.cardIdx || 0);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 80);
        compObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  compCards.forEach((card, i) => {
    card.dataset.cardIdx = i;
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    compObserver.observe(card);
  });

  /* ——————————————————————————————
     SPEC ROW STAGGER
  —————————————————————————————— */
  const specRows = document.querySelectorAll('.spec-row');
  const specObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.specIdx || 0);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, idx * 60);
        specObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  specRows.forEach((row, i) => {
    row.dataset.specIdx = i;
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    row.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    specObserver.observe(row);
  });

  /* ——————————————————————————————
     SECTION LABEL REVEAL
  —————————————————————————————— */
  const sectionLabels = document.querySelectorAll('.section-label');
  const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        labelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sectionLabels.forEach(label => {
    label.style.opacity = '0';
    label.style.transform = 'translateX(-16px)';
    label.style.transition = 'opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s';
    labelObserver.observe(label);
  });

  /* ——————————————————————————————
     GLITCH EFFECT ON HERO TITLE (subtle)
  —————————————————————————————— */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    let glitchInterval = null;

    const startGlitch = () => {
      if (glitchInterval) return;
      let count = 0;
      glitchInterval = setInterval(() => {
        const off = Math.random() * 4 - 2;
        heroTitle.style.textShadow = `${off}px 0 0 rgba(58,240,192,0.4), ${-off}px 0 0 rgba(200,240,64,0.3)`;
        count++;
        if (count > 3) {
          clearInterval(glitchInterval);
          glitchInterval = null;
          heroTitle.style.textShadow = '';
        }
      }, 80);
    };

    // Trigger glitch occasionally
    setInterval(() => {
      if (Math.random() > 0.65) startGlitch();
    }, 4500);
  }

  /* ——————————————————————————————
     SMOOTH ANCHOR SCROLL
  —————————————————————————————— */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ——————————————————————————————
     IMAGE LOAD GUARD
  —————————————————————————————— */
  const stationImg = document.getElementById('stationImg');
  if (stationImg) {
    stationImg.addEventListener('error', () => {
      // Fallback if image not found
      stationImg.closest('.img-frame').style.background = '#1a1a1a';
    });
  }

});
