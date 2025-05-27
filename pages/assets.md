---
layout: page
title: Asset Directory
permalink: /assets/
---

# Public Assets

<ul>
{% assign asset_files = site.static_files | where_exp: "file", "file.path contains '/assets/'" %}
{% for file in asset_files %}
  <li><a href="{{ file.path | relative_url }}">{{ file.name }}</a></li>
{% endfor %}
</ul>