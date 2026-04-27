// ===== Typewriter =====
const phrases = [
  "Senior Java Software Engineer | 6+ Years",
  "Cloud-Native • AI/ML Search • Microservices",
  "Building semantic search at HelloFresh",
  "AWS Bedrock • OpenSearch • LangChain4j"
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const el = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    el.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { deleting = true; setTimeout(type, 1800); return; }
    setTimeout(type, 60);
  } else {
    el.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
    setTimeout(type, 30);
  }
}
type();

// ===== Navbar scroll =====
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== Scroll animations =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('animate-in'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

// ===== GitHub Repos =====
const LANG_COLORS = {
  Java: '#b07219', Kotlin: '#A97BFF', Python: '#3572A5',
  JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26',
  'C++': '#f34b7d', null: '#565f89'
};

async function loadRepos() {
  const grid = document.getElementById('repos-grid');
  try {
    const res = await fetch('https://api.github.com/users/mailtoharutyunyan/repos?sort=updated&per_page=30');
    const repos = await res.json();
    const filtered = repos
      .filter(r => r.name !== 'mailtoharutyunyan')
      .slice(0, 12);

    grid.innerHTML = filtered.map(r => `
      <a href="${r.html_url}" target="_blank" class="repo-card glass-card" data-animate>
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

    grid.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  } catch (e) {
    grid.innerHTML = '<p class="repos-loading">Failed to load repositories. Please try again later.</p>';
  }
}
loadRepos();
