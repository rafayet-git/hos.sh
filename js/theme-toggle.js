document.getElementById('theme-toggle').addEventListener('click', function () {
  var el = document.documentElement;
  var current = el.dataset.theme ||
    (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  var next = current === 'dark' ? 'light' : 'dark';
  el.dataset.theme = next;
  el.dataset.bsTheme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
  document.dispatchEvent(new Event('themechange'));
});
