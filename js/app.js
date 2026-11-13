(() => {
  const header = document.querySelector('#site-header');
  const progress = document.querySelector('#reading-progress');
  const nav = document.querySelector('#site-nav');
  const navToggle = document.querySelector('#nav-toggle');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const updatePageState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;

    progress.style.width = `${ratio * 100}%`;
    header.classList.toggle('scrolled', scrollTop > 24);

    let currentId = '';
    for (const section of sections) {
      if (scrollTop >= section.offsetTop - 180) currentId = section.id;
    }

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updatePageState();
      ticking = false;
    });
  }, { passive: true });

  const closeNavigation = () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(willOpen));
    nav.classList.toggle('open', willOpen);
    document.body.classList.toggle('nav-open', willOpen);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeNavigation));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  const copyButton = document.querySelector('#copy-citation');
  const citationCode = document.querySelector('#citation-code');

  const copyCitation = async () => {
    const text = citationCode.textContent.trim();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citationCode);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeAllRanges();
    }

    copyButton.textContent = copyButton.dataset.copiedLabel;
    window.setTimeout(() => {
      copyButton.textContent = copyButton.dataset.copyLabel;
    }, 1800);
  };

  copyButton.addEventListener('click', copyCitation);
  document.querySelector('#year').textContent = new Date().getFullYear();

  updatePageState();
})();
