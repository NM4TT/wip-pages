import gsap from 'gsap';

/**
 * Target launch timestamp resolution (strictly build/source-controlled, never from URL):
 * 1. Environment variable: VITE_LAUNCH_DATE (from .env or CLI build arg)
 * 2. HTML attribute: <main data-target="2026-12-01T00:00:00">
 * 3. Default fallback: 3 days, 14 hours, 30 minutes from load
 */
function resolveTargetTimestamp() {
  const mainEl = document.querySelector('.placeholder-page');
  const rawDate =
    import.meta.env.VITE_LAUNCH_DATE?.trim() ||
    mainEl?.dataset.target?.trim();

  if (rawDate) {
    const parsed = Date.parse(rawDate);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return Date.now() + (3 * 86400 + 14 * 3600 + 30 * 60) * 1000;
}

const targetTimestamp = resolveTargetTimestamp();

const units = {
  days: { cx: 84, current: null },
  hours: { cx: 180, current: null },
  mins: { cx: 276, current: null },
  secs: { cx: 372, current: null },
};

// Initialize DOM references and hinge origins for all 4 modules
for (const [key, cfg] of Object.entries(units)) {
  cfg.baseTop = document.getElementById(`${key}-base-top`);
  cfg.baseBot = document.getElementById(`${key}-base-bot`);
  cfg.upperText = document.getElementById(`${key}-upper-text`);
  cfg.lowerText = document.getElementById(`${key}-lower-text`);
  cfg.flapUpper = `#${key}-flap-upper`;
  cfg.flapLower = `#${key}-flap-lower`;

  gsap.set(cfg.flapUpper, { scaleY: 1, svgOrigin: `${cfg.cx} 111` });
  gsap.set(cfg.flapLower, { scaleY: 0, svgOrigin: `${cfg.cx} 111` });
}

function setUnitImmediate(key, val) {
  const u = units[key];
  u.current = val;
  if (u.baseTop) u.baseTop.textContent = val;
  if (u.baseBot) u.baseBot.textContent = val;
  if (u.upperText) u.upperText.textContent = val;
  if (u.lowerText) u.lowerText.textContent = val;
  gsap.set(u.flapUpper, { scaleY: 1 });
  gsap.set(u.flapLower, { scaleY: 0 });
}

function flipUnitTo(key, nextVal) {
  const u = units[key];
  if (u.current === null) {
    setUnitImmediate(key, nextVal);
    return;
  }
  if (u.current === nextVal) return;

  const prevVal = u.current;
  u.current = nextVal;

  if (u.baseTop) u.baseTop.textContent = nextVal;
  if (u.baseBot) u.baseBot.textContent = prevVal;
  if (u.upperText) u.upperText.textContent = prevVal;
  if (u.lowerText) u.lowerText.textContent = nextVal;

  const tl = gsap.timeline();
  tl.set(u.flapUpper, { scaleY: 1 });
  tl.set(u.flapLower, { scaleY: 0 });

  tl.to(u.flapUpper, {
    scaleY: 0,
    duration: 0.2,
    ease: 'power2.in',
  });

  tl.to(u.flapLower, {
    scaleY: 1,
    duration: 0.24,
    ease: 'back.out(1.3)',
    onComplete: () => {
      if (u.baseBot) u.baseBot.textContent = nextVal;
    },
  });
}

function computeRemainingParts() {
  const diffSec = Math.max(0, Math.floor((targetTimestamp - Date.now()) / 1000));
  const d = Math.min(99, Math.floor(diffSec / 86400));
  const h = Math.floor((diffSec % 86400) / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;

  return {
    days: String(d).padStart(2, '0'),
    hours: String(h).padStart(2, '0'),
    mins: String(m).padStart(2, '0'),
    secs: String(s).padStart(2, '0'),
  };
}

// Initial render
const initial = computeRemainingParts();
setUnitImmediate('days', initial.days);
setUnitImmediate('hours', initial.hours);
setUnitImmediate('mins', initial.mins);
setUnitImmediate('secs', initial.secs);

// Live 1-second mechanical tick
setInterval(() => {
  const next = computeRemainingParts();
  flipUnitTo('days', next.days);
  flipUnitTo('hours', next.hours);
  flipUnitTo('mins', next.mins);
  flipUnitTo('secs', next.secs);
}, 1000);
