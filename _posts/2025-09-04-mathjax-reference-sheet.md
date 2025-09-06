---
layout: post
title: Mathjax Reference Sheet
date: 2025-09-04
tags: mathjax
---
MathJax is a very neat tool when it comes to writing math equations on Markdown (with a compatible note-taking app like Marktext, Logseq or Obsidian). I use it when taking notes for my college courses, instead of trying to write everything on pen and paper. However there's a lot of syntax and functions baked into it, and It's not really possible to remember it all. So I assembled this page to put down equations that I most commonly use, as well as some resources that have much more info than what this page provides. 

### Resources

Showing this first because it's probably the first thing you'd want to check out before you scroll further.

- [MathJax Basic Tutorial and Quick Reference Sheet](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference) - The de-facto thread that contains almost everything you need to know, divided by topic. It's extensive and very long.
- [Detexify](https://detexify.kirelabs.org/classify.html) - I found this site from the aforementioned thread, and it's pretty neat. Lets you draw a symbol so that you can get the Mathjax operation for it.
- [LaTeX Mathematical Symbols](https://www.cmor-faculty.rice.edu/\\\~heinken/latex/symbols.pdf) - Contains most of the commonly used symbols and functions
- [Easy Copy MathJax](https://easy-copy-mathjax.nakaken88.com/en/) - A list of common single & multi-line equations that you can easily copy & paste, based on topic. I found this useful especially with the [matrix](https://easy-copy-mathjax.nakaken88.com/en/matrix/) section.

### Formatting

> I provide source code, but you can also right click on an equation to get the functions as well. 

$ a^2 = C_1cos(wt) \rightarrow sin(a)^2_5 $ is `a^2 = C_1cos(wt) \rightarrow sin(a)^2_5`{:.language-latex .highlight}

$\sum_{i=1}^{n} $ is `\sum_{i=1}^{n}`{:.language-latex .highlight}

$\frac{x}{y}$ is `\frac{x}{y}`{:.language-latex .highlight}

$\underrightarrow{R_1 \leftrightarrow R_2}$ for arrows under equations: `$\underrightarrow{R_1 \leftrightarrow R_2}$`{:.language-latex .highlight}

`\\\\` starts a new line.

Putting square brackets after `\\\\` adds spacing between lines: `\\\\[10px]`

`\hspace{10px}`{:.language-latex .highlight} adds spacing inside lines, useful for left/right aligning.

Here is all of it combined:

```latex
a^2 + b^2 \hspace{10cm}  \\[20px]
c^2 \hspace{5cm} +d^3
```

You can use `\left` and `\right` to put brackets to scale an equation:

$$
S = \left\{ \begin{bmatrix}
x\\
2x+1
\end{bmatrix} \mid x \text{ is a real number} \right\}
$$

```latex
S = \left\{ \begin{bmatrix}
x\\
2x+1
\end{bmatrix} \mid x \text{ is a real number} \right\}
```

### Common equations

**Cases:**

$$
\begin{cases}
x_1+2x_2-3x_3 = -4 \\
x_1+4x_2-2x_3 = 6 \\
3x_1 -2x_2+2x_3=8
\end{cases}
\begin{bmatrix}
3 & -2 & 4 \\
-2 & 5 & -6 \\
0 & 2 & 7
\end{bmatrix}
$$

```latex
\begin{cases}
x_1+2x_2-3x_3 = -4 \\
x_1+4x_2-2x_3 = 6 \\
3x_1 -2x_2+2x_3=8
\end{cases}
```

**Matrices:**

$$
\begin{bmatrix}
3 & -2 & 4 \\
-2 & 5 & -6 \\
0 & 2 & 7
\end{bmatrix}
$$

```latex
\begin{bmatrix}
3 & -2 & 4 \\
-2 & 5 & -6 \\
0 & 2 & 7
\end{bmatrix}
```

Replace `bmatrix` with `vmatrix` for vertical matrices:

$$
\begin{vmatrix}
  a_{21}&a_{22}\\
a_{31}&a_{32}
\end{vmatrix}
$$

You can also make this using the standard `array`, using `left` and `right` operators. This is useful if you want a formatting like an augmented matrix:

$$
\left[
\begin{array}{cc|c}
  1&2&3\\
  0&0&-6\\
  0&4&4\\
\end{array}
\right|
$$

```latex
\left[
\begin{array}{cc|c}
  1&2&3\\
  0&0&-6\\
  0&4&4\\
\end{array}
\right|
```

**Tables:**

$$
\begin{array}{r|lll}
 & x & y & \text{Available} \\
\hline
\text{Time} & 12 & 3 & 120 \\
\text{Cost} & 0.2 & 0.4 & 4 \\
\text{Profit} & 2 & 1 & 
\end{array}
$$

```latex
\begin{array}{r|lll}
 & x & y & \text{Available} \\
\hline
\text{Time} & 12 & 3 & 120 \\
\text{Cost} & 0.2 & 0.4 & 4 \\
\text{Profit} & 2 & 1 & 
\end{array}
```