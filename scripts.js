/* UFaaS — Global JS (no backend) */
/* Mobile nav toggle (optional enhancement-ready) */
document.addEventListener('click', (e) => {
  const t = e.target;
  if (t.matches('[data-toggle-nav]')) {
    document.querySelector('.nav').classList.toggle('open');
  }
});

/* Smooth scroll on in-page anchors (native CSS also enabled) */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  });
});

/* Simple client-side search + filter for card grids
   Usage: add data-section="products" or "blog" on the container.
   Cards must include data-tags and data-title attributes.
*/
function setupSearchAndFilters(sectionId){
  const root = document.querySelector(`[data-section="${sectionId}"]`);
  if(!root) return;
  const input = root.querySelector('[data-role="search-input"]');
  const pills = Array.from(root.querySelectorAll('[data-role="filter-pill"]'));
  const cards = Array.from(root.querySelectorAll('[data-role="card"]'));

  let activeFilter = 'all';
  function apply(){
    const q = (input?.value || '').trim().toLowerCase();
    cards.forEach(card=>{
      const title = (card.getAttribute('data-title')||'').toLowerCase();
      const tags = (card.getAttribute('data-tags')||'').toLowerCase();
      const matchesText = !q || title.includes(q) || tags.includes(q);
      const matchesFilter = activeFilter==='all' || tags.split(',').map(s=>s.trim()).includes(activeFilter);
      card.style.display = (matchesText && matchesFilter) ? '' : 'none';
    });
  }

  if (input){
    input.addEventListener('input', apply);
  }

  pills.forEach(p=>{
    p.addEventListener('click', ()=>{
      pills.forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      activeFilter = p.getAttribute('data-filter') || 'all';
      apply();
    });
  });

  apply(); // initial run
}

/* Initialize where present */
setupSearchAndFilters('products');
setupSearchAndFilters('blog');

/* Lightweight intersection animation */
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  revealEls.forEach(el=>{
    el.style.transform='translateY(16px)';
    el.style.opacity='0';
    el.style.transition='all .6s ease';
    io.observe(el);
  });
}
