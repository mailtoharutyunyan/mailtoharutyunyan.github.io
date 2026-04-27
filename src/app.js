// ===== Typewriter =====
const phrases = [
  "Senior Java Software Engineer | 6+ Years",
  "Cloud-Native • AI/ML Search • Microservices",
  "Building semantic search at HelloFresh",
  "AWS Bedrock • OpenSearch • LangChain4j"
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const twEl = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    twEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { deleting = true; setTimeout(type, 2000); return; }
    setTimeout(type, 55);
  } else {
    twEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
    setTimeout(type, 25);
  }
}
type();

// ===== Navbar scroll =====
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Scroll Reveal (IntersectionObserver) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger children with delay
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('animate-in'), delay);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-animate]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 80}ms`;
  revealObserver.observe(el);
});

// ===== Spotlight Card Effect (mouse tracking) =====
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// ===== GitHub Repos =====
const LANG_COLORS = {
  Java: '#b07219', Kotlin: '#A97BFF', Python: '#3572A5',
  JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26',
  'C++': '#f34b7d', CSS: '#563d7c'
};

async function loadRepos() {
  const grid = document.getElementById('repos-grid');
  try {
    const res = await fetch('https://api.github.com/users/mailtoharutyunyan/repos?sort=updated&per_page=30');
    const repos = await res.json();
    const filtered = repos.filter(r => r.name !== 'mailtoharutyunyan').slice(0, 12);

    grid.innerHTML = filtered.map(r => `
      <a href="${r.html_url}" target="_blank" rel="noopener" class="repo-card spotlight-card" data-animate>
        <div class="repo-name">
          <i class="fas fa-book-bookmark"></i> ${r.name}
        </div>
        <div class="repo-desc">${r.description || 'No description provided'}</div>
        <div class="repo-meta">
          ${r.language ? `<span><span class="repo-lang-dot" style="background:${LANG_COLORS[r.language] || '#565f89'}"></span>${r.language}</span>` : ''}
          <span><i class="fas fa-star"></i> ${r.stargazers_count}</span>
          <span><i class="fas fa-code-fork"></i> ${r.forks_count}</span>
        </div>
      </a>
    `).join('');

    // Re-register spotlight + reveal on dynamic cards
    grid.querySelectorAll('.spotlight-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });
    grid.querySelectorAll('[data-animate]').forEach(el => {
      revealObserver.observe(el);
    });
  } catch (e) {
    grid.innerHTML = '<p class="repos-loading">Failed to load repositories.</p>';
  }
}
loadRepos();

// ===== Parallax Aurora Blobs on scroll =====
const blobs = document.querySelectorAll('.aurora-blob');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      blobs.forEach((blob, i) => {
        const speed = (i + 1) * 0.03;
        blob.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});
