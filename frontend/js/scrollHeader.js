let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    // At the top
    header.classList.remove('header-hidden');
    header.classList.add('header-visible');
    return;
  }

  if (currentScroll > lastScroll && currentScroll > 100) {
    // Scrolling DOWN & past 100px
    header.classList.add('header-hidden');
    header.classList.remove('header-visible');
  } else {
    // Scrolling UP
    header.classList.remove('header-hidden');
    header.classList.add('header-visible');
  }

  lastScroll = currentScroll;
});