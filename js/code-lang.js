// Give each code block a header bar with the language name and a copy button.
document.querySelectorAll('div.highlighter-rouge').forEach(function (el) {
  var m = el.className.match(/language-(\S+)/);
  var lang = m && m[1] !== 'text' && m[1] !== 'plaintext' ? m[1] : '';

  var header = document.createElement('div');
  header.className = 'code-header';

  var label = document.createElement('span');
  label.className = 'code-lang';
  label.textContent = lang;

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-code';
  btn.textContent = 'copy';
  btn.addEventListener('click', function () {
    var code = el.querySelector('pre code') || el.querySelector('pre');
    navigator.clipboard.writeText(code.innerText).then(function () {
      btn.textContent = 'copied!';
    }, function () {
      btn.textContent = 'failed';
    }).finally(function () {
      setTimeout(function () { btn.textContent = 'copy'; }, 1500);
    });
  });

  header.appendChild(label);
  header.appendChild(btn);
  el.insertBefore(header, el.firstChild);
});
