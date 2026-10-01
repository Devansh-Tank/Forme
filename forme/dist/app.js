const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const parallaxViewport = window.matchMedia('(min-width: 768px)');
const revealTargets = [];
const siteHeader = document.querySelector('header');
const heroSection = document.querySelector('.hero');
const headerSpace = document.createElement('div');
headerSpace.className = 'header-space';
siteHeader.before(headerSpace);
headerSpace.append(siteHeader);
function sizeHeaderSpace() {
  const padding = innerWidth <= 640 ? 48 : 60;
  headerSpace.style.height = `${Math.max(siteHeader.querySelector('.brand').getBoundingClientRect().height, siteHeader.querySelector('nav').getBoundingClientRect().height) + padding}px`;
}
sizeHeaderSpace();
siteHeader.classList.add('floating-header');
addEventListener('resize', sizeHeaderSpace);
if ('ResizeObserver' in window) {
  const headerObserver = new ResizeObserver(sizeHeaderSpace);
  headerObserver.observe(siteHeader.querySelector('.brand'));
  headerObserver.observe(siteHeader.querySelector('nav'));
}
if (!motionPreference.matches) heroSection.classList.add('hero-arrival');
// Animate readable groups, keeping headings intact for assistive technology.
document.querySelectorAll('.reveal').forEach(group => {
  group.classList.remove('reveal');
  const heading = group.querySelector('h2');
  if (!heading) {
    group.classList.add('reveal-item');
    revealTargets.push(group);
    return;
  }
  const lines = [document.createElement('span')];
  Array.from(heading.childNodes).forEach(node => {
    if (node.nodeName === 'BR') {
      lines.at(-1).append(document.createTextNode(' '));
      lines.push(document.createElement('span'));
    } else lines.at(-1).append(node);
  });
  heading.replaceChildren(...lines);
  lines.forEach((line, index) => {
    line.className = 'heading-line reveal-item';
    line.style.setProperty('--reveal-delay', `${index * 85}ms`);
    revealTargets.push(line);
  });
  group.querySelectorAll('.eyebrow, .studio-copy, .text-link, .principles > div, .contact-intro > p:not(.eyebrow), .section-heading > p').forEach(element => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', element.matches('.eyebrow') ? '0ms' : '120ms');
    revealTargets.push(element);
  });
});
let revealObserver;
if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
}
function configureReveals() {
  document.documentElement.classList.toggle('motion', !motionPreference.matches && !!revealObserver);
  if (motionPreference.matches) {
    revealObserver?.disconnect();
    revealTargets.forEach(element => element.classList.add('visible'));
  } else revealTargets.filter(element => !element.classList.contains('visible')).forEach(element => revealObserver?.observe(element));
}
configureReveals();
motionPreference.addEventListener('change', configureReveals);
// Keyboard navigation must never land on an invisible reveal.
document.addEventListener('focusin', event => {
  const item = event.target.closest('.reveal-item');
  if (item) item.classList.add('visible');
});

const progressLine = document.createElement('div');
progressLine.className = 'reading-progress';
progressLine.setAttribute('aria-hidden', 'true');
document.body.append(progressLine);
const projectImages = Array.from(document.querySelectorAll('.project-image'));
let scrollFrame = 0;
function renderScrollMotion() {
  scrollFrame = 0;
  siteHeader.classList.toggle('is-compact', heroSection.getBoundingClientRect().bottom <= headerSpace.offsetHeight);
  const scrollableHeight = document.documentElement.scrollHeight - innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, scrollY / scrollableHeight)) : 0;
  progressLine.style.transform = `scaleX(${progress})`;
  const parallax = !motionPreference.matches && parallaxViewport.matches;
  document.documentElement.classList.toggle('parallax', parallax);
  projectImages.forEach(frame => {
    if (!parallax) { frame.style.removeProperty('--image-drift'); return; }
    const rect = frame.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const position = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
    frame.style.setProperty('--image-drift', `${((position - 0.5) * rect.height * 0.05).toFixed(2)}px`);
  });
}
function scheduleScrollMotion() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(renderScrollMotion);
}
addEventListener('scroll', scheduleScrollMotion, { passive: true });
addEventListener('resize', scheduleScrollMotion);
motionPreference.addEventListener('change', scheduleScrollMotion);
parallaxViewport.addEventListener('change', scheduleScrollMotion);
if ('ResizeObserver' in window) new ResizeObserver(scheduleScrollMotion).observe(document.body);
scheduleScrollMotion();

// Preserve native disclosure semantics, adding interruptible height animation.
const disclosureStates = new Map();
document.querySelectorAll('.project details').forEach(details => {
  const summary = details.querySelector('summary');
  const content = details.querySelector('.project-description');
  const state = { animation: null, target: details.open, finish: null };
  disclosureStates.set(details, state);
  state.finish = () => {
    if (state.animation) {
      state.animation.onfinish = null;
      state.animation.cancel();
      state.animation = null;
    }
    details.open = state.target;
    details.style.removeProperty('height');
    details.style.removeProperty('overflow');
    details.removeAttribute('data-expanded');
    content.inert = false;
    scheduleScrollMotion();
  };
  summary.addEventListener('click', event => {
    if (motionPreference.matches || !details.animate) return;
    event.preventDefault();
    const startHeight = details.getBoundingClientRect().height;
    state.target = state.animation ? !state.target : !details.open;
    if (state.animation) { state.animation.onfinish = null; state.animation.cancel(); }
    details.style.height = '';
    details.open = true;
    const endHeight = state.target ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height;
    details.dataset.expanded = String(state.target);
    content.inert = !state.target;
    details.style.overflow = 'hidden';
    state.animation = details.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }
    );
    state.animation.onfinish = state.finish;
  });
  details.addEventListener('toggle', scheduleScrollMotion);
});
function finishDisclosures() {
  disclosureStates.forEach(state => { if (state.animation) state.finish(); });
}
motionPreference.addEventListener('change', finishDisclosures);
addEventListener('resize', finishDisclosures);
let brief = '';
const form = document.getElementById('enquiry');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  brief = `FORME — Sample commission brief\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('type')}\n\n${data.get('message')}\n\nCreated on the FORME demonstration website. No enquiry has been sent.`;
  document.getElementById('form-result').hidden = false;
});
form.addEventListener('input', () => { document.getElementById('form-result').hidden = true; brief = ''; });
document.getElementById('download-brief').addEventListener('click', () => {
  if (!brief) return;
  const url = URL.createObjectURL(new Blob([brief], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = 'forme-commission-brief.txt'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// The original image remains visible until the silent video is ready.
const heroVideo = document.getElementById('hero-video');
const heroMotion = document.getElementById('hero-motion');
// Reveal once, including when autoplay is unavailable; loops never replay the caption.
let captionRevealed = false;
function revealHeroCaption() {
  if (captionRevealed) return;
  captionRevealed = true;
  heroSection.classList.add('caption-ready');
}
setTimeout(revealHeroCaption, 1800);
function updateMotionLabel() {
  const text = heroVideo.paused ? 'Play video' : 'Pause video';
  heroMotion.textContent = text;
  heroMotion.setAttribute('aria-label', heroVideo.paused ? 'Play background video' : 'Pause background video');
}
function configureHeroMotion() {
  if (motionPreference.matches) {
    heroSection.classList.remove('hero-arrival');
    revealHeroCaption();
    heroVideo.pause();
    heroVideo.classList.remove('is-ready');
    heroMotion.hidden = true;
    return;
  }
  heroMotion.hidden = false;
  if (!heroVideo.getAttribute('src')) heroVideo.src = heroVideo.dataset.src;
  heroVideo.muted = true;
  heroVideo.play().catch(() => { updateMotionLabel(); revealHeroCaption(); });
}
heroVideo.addEventListener('playing', () => {
  heroVideo.classList.add('is-ready');
  revealHeroCaption();
  updateMotionLabel();
});
heroVideo.addEventListener('pause', updateMotionLabel);
heroVideo.addEventListener('error', () => {
  heroVideo.classList.remove('is-ready');
  heroMotion.hidden = true;
  revealHeroCaption();
});
heroMotion.addEventListener('click', () => {
  if (heroVideo.paused) heroVideo.play().catch(updateMotionLabel);
  else heroVideo.pause();
});
motionPreference.addEventListener('change', configureHeroMotion);
configureHeroMotion();
