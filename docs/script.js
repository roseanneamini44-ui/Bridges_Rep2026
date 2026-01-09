// Keep interactive behaviors: theme toggle, smooth scroll, and collapsible cards (remove modal/form code)
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Set initial theme: prefer stored, else system preference
  const stored = localStorage.getItem('site-theme');
  if(stored) {
    if(stored === 'dark') root.classList.add('dark');
  } else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    root.classList.add('dark');
  }
  updateThemeButton();

  themeToggle && themeToggle.addEventListener('click', ()=>{
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
    updateThemeButton();
  });

  function updateThemeButton(){
    const isDark = root.classList.contains('dark');
    if(themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle && themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  // Collapsible cards (keyboard accessible)
  document.querySelectorAll('.card.collapsible').forEach(card => {
    card.addEventListener('click', ()=> card.classList.toggle('open'));
    card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('open'); } });
  });
})();
