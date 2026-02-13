---
layout: post
title: Searching for the ultimate CMS (for my site)
date: 2025-07-18
tags: blog
---
For the past few weeks, I've been looking for a proper way to manage files and pages in this very site, without the need of managing the source code every time. 

Of course, I could always do things the manual way, by manually setting the filename, headers, and writing all the markdown in plain text. But that requires some tedious work, and could end up with mistakes or inconsistencies (though I sometimes still have to do this, more on that later).  

Then I've heard about how you could reduce the tediousness through a **content management system (CMS)**. Basically a way for me to create and edit posts through a fancy GUI instead of having to stare at a text editor the entire time. 

In order to choose one however, I had some requirements in mind:

1. Doesn't require me to host my site anywhere else - Github pages is already good enough.
2. Doesn't require me to make new accounts IF the only use of the account is to run the CMS (so stuff like Netlify and Cloudflare is fine).
3. Isn't paid or doesn't have a horrible rate limit for free users.   
4. Can be run locally. Being able to use it online is nice, but not really needed.
5. Isn't outdated, hasn't gotten updates in the past year.

This has eliminated about 90% of CMS that I have found online. I have tested out the ones that fit, with varying degrees of failure and success.

---

### CMS 1. TinaCMS 

I have first heard of this CMS from this site's theme author, but that was back when it was still called Forestry.io. I liked the documentation and was hoping to use the special visual editing feature they offered inside the CMS.

However, I have faced some issues when using it. One being that the visual editing feature never worked properly for me, which I'm pretty sure was either a config issue or was never fully compatible. 

Also, I faced issues with creating new posts - more specifically, setting the file name and the yaml headers properly. One example is setting the `layout` element to be "post" by default, while also hiding it from the tina UI. I expect this to always put "post" on all new posts, but instead it just doesn't put the layout at all. Any other way to circumvent this would require me to input it myself anyway. Another example is with setting the date, which would always post the full datetime format, no matter what options I put. 

I decided that there's no point in using a CMS like this if it required that much manual intervention. It just wasn't a use case for me.

---

### CMS 2. Decap CMS

I've seen how much Decap/Netlify CMS gets mentioned every time I research this topic, meaning that it must be one of the more popular choices. I decided to try it out.

Surprisingly it is very simple. They provide the files, and the config does not take that many lines to write unlike Tina. 

However, the issue came when trying to test the CMS locally. I could not do that, as I needed to connect to a backend in order to save any changes. One of the main options given was called Netlify Identity, however that required me to host my website to Netlify which I do not want to do. Another option was to authenticate using a Github account, but I couldn't figure out how to do this past making an OAuth app. 

I feel like Decap would've been a solid choice, if they made it easier to use it outside of Netlify. The documentation regarding this is sparse, and I would have to figure things on my own.

---

### CMS 3. Sveltia CMS (currently using)

I found out about Sveltia CMS as a drop-in replacement for Decap. Literally all I needed to do was replace a single line containing the javascript.

The experience has been much better simply because I was able to finally use it. It runs locally with a Chromium-based browser, so I could easily test if things work properly without pushing to github. 

I also managed to get it to authenticate with a Github account, using Sveltia's own [CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth). This required me to host the auth server on Cloudflare myself. I followed the guide exactly as provided except for step 2, because I had to make a Github application instead of a standard OAuth app. The process is mainly the same, with the extra caveat being the permissions. Just set read and write permissions to "Content" in _Repository Permissions_.

---

### The search is still ongoing

While I mentioned using Sveltia CMS, it is very far from perfect. My favorite part is the media manager, which allows me to upload & download files on different directories, even if they are subdirectories of each other. This means i can edit my assets/ folder and assets/posts/ folders separately.

![Showcase of assets folder versus posts](/assets/posts/CMSfolders.png)

However, my least favorite part is the post editor. It is a very basic markdown editor with no special features. Code blocks do not show syntax highlighting, no matter what language I put on them. LaTeX/MathJax does not display at all. Also, Liquid and HTML (which Jekyll supports) does not get processed, which is expected but annoying if i wanted to edit the main pages.

Because of this, I am still looking for better ways to manage my content in this site. I might need to find a way to modify Sveltia, switch to a different CMS, or perhaps develop my own solution.  In any case, if anyone has any suggestions, feel free to share it!
