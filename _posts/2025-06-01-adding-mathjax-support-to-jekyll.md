---
layout: post
title: Adding Mathjax Support to Jekyll
date: 2025-06-01
tags: blog mathjax
---

I've figured out how to implement Mathjax into my website.

If you do not know, Mathjax is basically used to display $\LaTeX$ equations in Markdown, websites, or anything that supports javascript. It came really useful when writing notes for most of my math classes, especially with markdown editors such as [MarkText](https://github.com/marktext/marktext).

Adding the script itself is simple, it's just a one-liner into my external javascript file:
```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
``` 

However it doesn't exactly work as I expected it to out-of-the-box, as using the `$` and `$$` syntaxes did not work. It turns out that by default it uses a completely different syntax, but I can actually customize this behavior by adding a script before it:
```html
<script>
window.MathJax = {
    tex: {
        inlineMath: [['\\(','\\)'], ['$', '$']],
        displayMath: [['\\[','\\]'], ['$$','$$']],
    },
    options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
    }
};
</script>
```
The skipHtmlTags help make sure that Mathjax doesn't mess up with other parts of the site, like code blocks and whatnot.

Here's a test with an inline equation: $ x^2 + y^2 = z^2 $

Some equations on display blocks:

$$ 
x + x^2
$$

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$$

$$
\vec{\nabla} \times \vec{F} =
            \left( \frac{\partial F_z}{\partial y} - \frac{\partial F_y}{\partial z} \right) \mathbf{i}
          + \left( \frac{\partial F_x}{\partial z} - \frac{\partial F_z}{\partial x} \right) \mathbf{j}
          + \left( \frac{\partial F_y}{\partial x} - \frac{\partial F_x}{\partial y} \right) \mathbf{k}
$$

There is one issue however, which is that multi-line math blocks do not work (with `\\\\`). The SSE here should be in two lines.

$$
SSE =  \sum(y_i -\hat{y_i})^2 \\ 
SSE =  \sum(y_i - (b_0 + \beta x_i))^2
$$

I think the only way to circumvent this issue is by encasing it in a function, I chose to do it with `\begin{align*}`

$$
\begin{align*}
SSE &=  \sum(y_i -\hat{y_i})^2 \\
SSE &=  \sum(y_i - (b_0 + \beta x_i))^2 
\end{align*}
$$

Aside from that, horizontal spacing (`\hspace{20cm}`) and vertical spacing `\\\\[1cm]` seem to work fine.

$$x = {-b \pm \sqrt{b^2-4ac} \over 2a} \hspace{20cm} $$

$$
\begin{align*}
x \cap x &=  x \\[1cm]
x \cap z &=  y
\end{align*}
$$

Additionally, I found this CSS rule which allows you to move the equations to the left instead of it being centered.

```css
mjx-container[display="true"] {
  justify-content: flex-start !important;
  text-align: left !important;
}
```

---

#### References:

- [LaTeX Math Magic](https://cwoebker.com/posts/latex-math-magic)
- [Add Mathjax Support to Jekyll and Hugo](https://www.bodunhu.com/blog/posts/add-mathjax-support-to-jekyll-and-hugo/)
