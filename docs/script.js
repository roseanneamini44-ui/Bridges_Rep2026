// Interactive behaviors: theme toggle, modal, smooth scroll, collapsible cards, simple form handling
(function(){
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const modal = document.getElementById('modal');
  const openApply = document.getElementById('openApply');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelForm = document.getElementById('cancelForm');
  const applyForm = document.getElementById('applyForm');
  const formMessage = document.getElementById('formMessage');

  // Set initial theme: prefer stored, else system preference
  const stored = localStorage.getItem('site-theme');
  if(stored) {
    if(stored === 'dark') root.classList.add('dark');
  } else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    root.classList.add('dark');
  }
  updateThemeButton();

  themeToggle.addEventListener('click', ()=>{
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
    updateThemeButton();
  });

  function updateThemeButton(){
    const isDark = root.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-pressed', String(isDark));
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

  // Modal open/close with basic focus management
  openApply && openApply.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); });
  closeModalBtn && closeModalBtn.addEventListener('click', ()=> closeModal());
  cancelForm && cancelForm.addEventListener('click', ()=> closeModal());
  modal && modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

  function openModal(){
    modal.setAttribute('aria-hidden', 'false');
    // save previously focused element to restore later
    modal.__previouslyFocused = document.activeElement;
    // focus first input
    const first = modal.querySelector('input,textarea,button');
    first && first.focus();
    // trap focus
    document.addEventListener('focus', trapFocus, true);
  }
  function closeModal(){
    modal.setAttribute('aria-hidden', 'true');
    formMessage.textContent = '';
    document.removeEventListener('focus', trapFocus, true);
    // restore focus
    try{ modal.__previouslyFocused && modal.__previouslyFocused.focus(); }catch(e){}
  }
  function trapFocus(e){
    if(modal.getAttribute('aria-hidden') === 'false' && !modal.contains(e.target)){
      e.stopPropagation();
      // move focus back into modal
      const first = modal.querySelector('input,textarea,button,a,select');
      first && first.focus();
    }
  }

  // Close on Escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false'){
      closeModal();
    }
  });

  // Collapsible cards (keyboard accessible)
  document.querySelectorAll('.card.collapsible').forEach(card => {
    card.addEventListener('click', ()=> card.classList.toggle('open'));
    card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('open'); } });
  });

  // Simple fake form submission
  applyForm && applyForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(applyForm);
    formMessage.textContent = 'Submitting...';
    // Simulate async submit
    setTimeout(()=>{
      formMessage.textContent = 'Thanks! Your application has been received.';
      applyForm.reset();
      setTimeout(closeModal, 1100);
    }, 900);
  });
})();
