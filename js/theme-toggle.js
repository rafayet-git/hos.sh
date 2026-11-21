// Dark/light toggle. Preference is stored in localStorage and applied early in head.html.
var themeButton = document.getElementById('theme-toggle');

function activeTheme() {
  return document.documentElement.dataset.theme ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

function updateThemeButton() {
  var dark = activeTheme() === 'dark';
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeButton.addEventListener('click', function () {
  var el = document.documentElement;
  var next = activeTheme() === 'dark' ? 'light' : 'dark';

  function apply() {
    el.dataset.theme = next;
    el.dataset.bsTheme = next;
    updateThemeButton();
    document.dispatchEvent(new Event('themechange'));
  }

  // Crossfade
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.startViewTransition && !reduceMotion) {
    document.startViewTransition(apply);
  } else {
    apply();
  }

  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Keep the icon right if the OS theme changes while no preference is saved.
matchMedia('(prefers-color-scheme: light)').addEventListener('change', updateThemeButton);
updateThemeButton();
