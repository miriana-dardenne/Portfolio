// Header background on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  siteNav.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    siteNav.classList.remove('open');
  });
});

// Scroll-spy: highlight active nav link for sections present on the current page
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
if (sections.length){
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector('.nav-link[href$="#' + id + '"]');
      if (!link) return;
      if (entry.isIntersecting){
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}

// Subtle network canvas — only runs on pages that have it (the homepage hero)
const canvas = document.getElementById('network-canvas');
if (canvas){
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let w, h;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.max(28, Math.floor((w * h) / 42000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    }));
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++){
      for (let j = i + 1; j < nodes.length; j++){
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140){
          ctx.strokeStyle = 'rgba(156,61,71,' + (1 - dist / 140) * 0.35 + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes){
      ctx.fillStyle = 'rgba(239,228,208,0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  window.addEventListener('resize', resize);
  if (!prefersReducedMotion){
    draw();
  }
}

// Stack technique : flèches gauche / droite
const stackViewport = document.getElementById('stackViewport');
if (stackViewport){
  const prev = document.querySelector('.stack-prev');
  const next = document.querySelector('.stack-next');
  const step = () => {
    const card = stackViewport.querySelector('.stack-card');
    return card ? card.offsetWidth + 30 : 280;
  };
  const update = () => {
    prev.disabled = stackViewport.scrollLeft <= 2;
    next.disabled = stackViewport.scrollLeft + stackViewport.clientWidth >= stackViewport.scrollWidth - 2;
  };
  prev.addEventListener('click', () => stackViewport.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => stackViewport.scrollBy({ left: step(), behavior: 'smooth' }));
  stackViewport.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// Onglet OpenClassrooms : ouvre / ferme le classeur de certifications
const ocCard = document.getElementById('ocCard');
if (ocCard){
  const ocPanel = document.getElementById('ocPanel');
  const ocToggle = document.getElementById('ocToggle');
  const ocLogo = document.getElementById('ocLogo');
  const ocLabel = ocToggle.querySelector('.oc-toggle-label');
  const setOpen = (open) => {
    ocCard.classList.toggle('open', open);
    ocPanel.classList.toggle('open', open);
    ocPanel.setAttribute('aria-hidden', String(!open));
    ocToggle.setAttribute('aria-expanded', String(open));
    ocLogo.setAttribute('aria-expanded', String(open));
    ocLabel.textContent = open ? 'Fermer le classeur' : 'Ouvrir le classeur';
  };
  const toggle = () => setOpen(!ocCard.classList.contains('open'));
  ocToggle.addEventListener('click', toggle);
  ocLogo.addEventListener('click', toggle);
  ocLogo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
  });
}
