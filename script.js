(function () {
  const tabs = document.querySelector('.tabs');
  const tabButtons = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  let currentTab = 'kyojin';

  function switchTab(target) {
    if (target === currentTab) return;

    const prevPanel = document.querySelector(`.panel--${currentTab}`);
    const nextPanel = document.querySelector(`.panel--${target}`);

    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === target;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    tabs.dataset.active = target;
    document.body.dataset.activeApp = target;

    if (prevPanel) {
      prevPanel.classList.remove('active');
      prevPanel.classList.add('exit-left');
      prevPanel.hidden = true;
    }

    if (nextPanel) {
      nextPanel.hidden = false;
      nextPanel.classList.remove('exit-left');
      requestAnimationFrame(() => {
        nextPanel.classList.add('active');
        animateStats(nextPanel);
      });
    }

    currentTab = target;
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));

    btn.addEventListener('keydown', (e) => {
      const tabsArr = Array.from(tabButtons);
      const idx = tabsArr.indexOf(btn);
      let nextIdx;

      if (e.key === 'ArrowRight') {
        nextIdx = (idx + 1) % tabsArr.length;
      } else if (e.key === 'ArrowLeft') {
        nextIdx = (idx - 1 + tabsArr.length) % tabsArr.length;
      } else {
        return;
      }

      e.preventDefault();
      tabsArr[nextIdx].focus();
      switchTab(tabsArr[nextIdx].dataset.tab);
    });
  });

  function animateStats(panel) {
    panel.querySelectorAll('.stat__value').forEach((el) => {
      const raw = el.dataset.count;
      if (raw == null || raw === '' || Number.isNaN(parseFloat(raw))) {
        el.textContent = raw || '—';
        return;
      }
      const target = parseFloat(raw);
      const isDecimal = el.dataset.decimal === 'true';
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;

        el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);

        if (progress < 1) requestAnimationFrame(tick);
      }

      el.textContent = isDecimal ? '0.0' : '0';
      requestAnimationFrame(tick);
    });
  }

  animateStats(document.querySelector('.panel.active'));

  document.body.dataset.activeApp = 'kyojin';

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.hero__logo-wrap, .apps').forEach((el) => {
    observer.observe(el);
  });
})();
