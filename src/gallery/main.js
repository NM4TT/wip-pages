const filterTabs = document.querySelectorAll('.filter-tab');
const conceptCards = document.querySelectorAll('.concept-card');
const stageIframe = document.getElementById('stage-iframe');
const activeBadge = document.getElementById('active-badge');
const activeTitle = document.getElementById('active-title');
const activeDesc = document.getElementById('active-desc');
const openStandaloneLink = document.getElementById('open-standalone-link');
const vpBtns = document.querySelectorAll('.vp-btn');
const iframeViewportFrame = document.getElementById('iframe-viewport-frame');
const iframeStageContainer = document.querySelector('.iframe-stage-container');

function selectConceptCard(card) {
  if (!card) return;
  conceptCards.forEach((c) => c.classList.remove('active'));
  card.classList.add('active');

  const url = card.dataset.url;
  const badge = card.dataset.badge;
  const title = card.dataset.title;
  const desc = card.dataset.desc;

  if (stageIframe && stageIframe.getAttribute('src') !== url) {
    stageIframe.setAttribute('src', url);
  }
  if (activeBadge) activeBadge.textContent = badge;
  if (activeTitle) activeTitle.textContent = title;
  if (activeDesc) activeDesc.textContent = desc;
  if (openStandaloneLink) openStandaloneLink.setAttribute('href', url);
}

// Card click listeners
conceptCards.forEach((card) => {
  const previewWin = card.querySelector('.card-preview-window');
  const selectBtn = card.querySelector('.select-concept-btn');

  if (previewWin) {
    previewWin.addEventListener('click', () => {
      selectConceptCard(card);
      document.getElementById('stage-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  if (selectBtn) {
    selectBtn.addEventListener('click', () => {
      selectConceptCard(card);
      document.getElementById('stage-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
});

// Category filtering
filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    let firstVisible = null;

    conceptCards.forEach((card) => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match && !firstVisible) {
        firstVisible = card;
      }
    });

    if (firstVisible && !firstVisible.classList.contains('active')) {
      selectConceptCard(firstVisible);
    }
  });
});

// Responsive Viewport Switcher (Desktop 100% / Tablet 768px / Mobile 390px)
vpBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    vpBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const width = btn.dataset.vp;
    if (iframeViewportFrame) {
      iframeViewportFrame.style.width = width;
    }
    if (iframeStageContainer) {
      iframeStageContainer.classList.toggle('framed', width !== '100%');
    }
  });
});
