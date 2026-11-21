// Dark/light toggle. Preference is stored in localStorage and applied early in head.html.
var themeButton = document.getElementById('theme-toggle');

function activeTheme() {
  return document.documentElement.dataset.theme ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}

// Show the icon for the theme you'll switch to: sun while dark, moon while light.
function updateThemeButton() {
  var dark = activeTheme() === 'dark';
  themeButton.textContent = dark ? '🌓' : '🌗';
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeButton.addEventListener('click', function () {
  var el = document.documentElement;
  var next = activeTheme() === 'dark' ? 'light' : 'dark';
  el.dataset.theme = next;
  el.dataset.bsTheme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  updateThemeButton();
  document.dispatchEvent(new Event('themechange'));
});

// Keep the icon right if the OS theme changes while no preference is saved.
matchMedia('(prefers-color-scheme: light)').addEventListener('change', updateThemeButton);
updateThemeButton();
