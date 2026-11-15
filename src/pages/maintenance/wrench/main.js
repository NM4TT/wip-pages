import gsap from 'gsap';

// Both #hex-nut and #wrench-pivot share local origin (0, 0)
gsap.set('#hex-nut', { rotation: 0, svgOrigin: '0 0' });
gsap.set('#wrench-pivot', { rotation: 0, svgOrigin: '0 0' });
gsap.set('#wrench-slide', { x: 38 });

const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });

// 1. Slide wrench jaws onto hex nut flats
tl.to('#wrench-slide', {
  x: 0,
  duration: 0.45,
  ease: 'power2.out',
});

// 2. First tightening stroke: turn wrench + nut 60deg clockwise together
tl.to(
  ['#wrench-pivot', '#hex-nut'],
  {
    rotation: '+=60',
    duration: 0.85,
    ease: 'power2.inOut',
  },
  '+=0.1'
);

// 3. Withdraw wrench jaws slightly to reposition for next flat
tl.to(
  '#wrench-slide',
  {
    x: 38,
    duration: 0.35,
    ease: 'power2.inOut',
  },
  '+=0.12'
);

// 4. Swing wrench back -60deg to starting angle while nut remains tightened
tl.to('#wrench-pivot', {
  rotation: 0,
  duration: 0.5,
  ease: 'power2.inOut',
});

// 5. Slide wrench jaws back onto the next pair of hex flats
tl.to('#wrench-slide', {
  x: 0,
  duration: 0.4,
  ease: 'power2.out',
});

// 6. Second tightening stroke: turn wrench + nut another 60deg clockwise
tl.to(
  ['#wrench-pivot', '#hex-nut'],
  {
    rotation: '+=60',
    duration: 0.85,
    ease: 'power2.inOut',
  },
  '+=0.1'
);

// 7. Withdraw wrench & reset to start position for next cycle
tl.to(
  '#wrench-slide',
  {
    x: 38,
    duration: 0.4,
    ease: 'power2.inOut',
  },
  '+=0.15'
);

tl.to('#wrench-pivot', {
  rotation: 0,
  duration: 0.5,
  ease: 'power2.inOut',
});
