---
layout: post
title: Searching for the ultimate CMS (for my site)
date: 2025-07-17
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

### CMS 1. TinaCMS 

I have first heard of this CMS from this site's theme author, but that was back when it was still called Forestry.io. I liked the documentation and was hoping to use the special visual editing feature they offered inside the CMS.

However, I have faced some issues when using it. One being that the visual editing feature never worked properly for me, which I'm pretty sure was either a config issue or was never fully compatible. 

Also, I faced issues with creating new posts - more specifically, setting the file name and the yaml headers properly. One example is setting the `layout` element to be "post" by default, while also hiding it from the tina UI. I expect this to always put "post" on all new posts, but instead it just doesn't put the layout at all. Any other way to circumvent this would require me to input it myself anyway. Another example is with setting the date, which would always post the full datetime format, no matter what options I put. 

I decided that there's no point in using a CMS like this if it required that much manual intervention. It just wasn't a use case for me.

### CMS 2. Decap CMS
### CMS 3. Sveltia CMS (currently using)
### It's still not very good.
### Other CMS that I have considered
