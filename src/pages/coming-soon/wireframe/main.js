import gsap from 'gsap';

const sections = ['#wf-nav', '#wf-hero-copy', '#wf-hero-media', '#wf-card-1', '#wf-card-2', '#wf-card-3'];

const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });

// Initial state: empty artboard inside browser window
tl.set(sections, { opacity: 0, y: 8 });
tl.set('#wf-hero-media', { scale: 0.92, svgOrigin: '262 140' });
tl.set('#wf-cursor', { x: 180, y: 240, opacity: 0 });

// 1. Cursor enters and places Navigation Bar
tl.to('#wf-cursor', {
  x: 112,
  y: 82,
  opacity: 1,
  duration: 0.45,
  ease: 'power2.out',
});
tl.to(
  '#wf-nav',
  {
    opacity: 1,
    y: 0,
    duration: 0.35,
    ease: 'power2.out',
  },
  '-=0.1'
);

// 2. Cursor moves to Hero Text & places Headline + CTA
tl.to('#wf-cursor', {
  x: 124,
  y: 166,
  duration: 0.45,
  ease: 'power2.inOut',
});
tl.to(
  '#wf-hero-copy',
  {
    opacity: 1,
    y: 0,
    duration: 0.38,
    ease: 'power2.out',
  },
  '-=0.12'
);

// 3. Cursor moves to Hero Media Box & snaps image wireframe into place
tl.to('#wf-cursor', {
  x: 268,
  y: 145,
  duration: 0.45,
  ease: 'power2.inOut',
});
tl.to(
  '#wf-hero-media',
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.4,
    ease: 'back.out(1.4)',
  },
  '-=0.1'
);

// 4. Cursor sweeps across bottom row placing Card 1, Card 2, Card 3
const cardTargets = [
  { id: '#wf-card-1', cx: 118, cy: 224 },
  { id: '#wf-card-2', cx: 206, cy: 224 },
  { id: '#wf-card-3', cx: 295, cy: 224 },
];

for (const card of cardTargets) {
  tl.to('#wf-cursor', {
    x: card.cx,
    y: card.cy,
    duration: 0.32,
    ease: 'power2.inOut',
  });
  tl.to(
    card.id,
    {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'back.out(1.3)',
    },
    '-=0.08'
  );
}

// 5. Cursor steps aside so completed webpage wireframe is clearly visible
tl.to('#wf-cursor', {
  x: 336,
  y: 248,
  opacity: 0,
  duration: 0.45,
  ease: 'power2.inOut',
});

// Hold completed layout
tl.to({}, { duration: 1.5 });

// Clean fade out to restart construction cycle
tl.to(sections, {
  opacity: 0,
  y: -4,
  duration: 0.4,
  stagger: 0.04,
  ease: 'power1.in',
});
