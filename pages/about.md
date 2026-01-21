---
layout: page
title: About
permalink: /about
css: header-highlight
---

{% assign aboutData = site.data.about %}

## Rafayet Hossain

<p class="post-meta">
    <div class="post-tags">
        <a href="#about-me"> About</a> 
        <a href="#skills"> Skills</a>
        <a href="#experience"> Experience</a>
        <a href="#projects"> Projects</a>
        <a href="#education--certs"> Education</a>
        <a href="#resume"> Resume</a>
        <a href="#contact-me"> Contact</a>
    </div>
</p>

### About Me

todo

### Skills

todo

### Experience

todo

### Projects

todo

### Education & Certs

{% assign eduData = aboutData | where: "category", "Education" | first %}
{% assign collegeData = eduData.orgs[0] %}
{% assign codepathData = eduData.orgs[1] %}

- {{ collegeData.name }}
    - B.A in Computer Science, with a Mathematics minor.
    - GPA: {{ collegeData.gpa }}
    - Expected to graduate in {{ collegeData.gradDate }}
    - <details>
        <summary>A list of {{ collegeData.courses.size }} relevant courses I've taken</summary>
        <table>
            <tr>
                <th>Name</th>
                <th>Course Link</th>
                <th>Coursework (if available)</th>
                <th>Semester Taken</th>
            </tr>
            {% for course in collegeData.courses %}
                <tr>
                    <td>{{ course.name }}</td>
                    <td><a href="{{ course.link }}">Link</a></td>
                    <td>
                        {% if course.coursework %}
                            <a href="{{ course.coursework }}">Coursework</a>
                        {% endif %}
                    </td>
                    <td>{{ course.semester }}</td>
                </tr>
            {% endfor %}
        </table>

        </details>
- {{ codepathData.name }} {% for course in codepathData.courses %}
    - **{{ course.name }}** ({{course.completionDate}}) - [Link to Course]({{course.link}}) {% endfor %}

### Resume

If it doesn't show for you, download [here]({{ '/assets/rh-resume.pdf' | prepend: site.baseurl }}).
<iframe src="{{ '/assets/rh-resume.pdf' | prepend: site.baseurl }}" width="100%" style="aspect-ratio: 8.5/11" ></iframe>

### Contact Me

{% assign phoneNum = aboutData | where: "category", "Contact" | first %}

LinkedIn: [rafayeth]({{ site.links.linkedin }})

GitHub: [rafayet-git]({{ site.links.github }})

My E-mail: [rafayet@hos.sh]({{ site.links.email }})

My Phone: {{ phoneNum.phone }}

I strongly prefer text messages over calls. Please notify me first before calling, as I've been receiving a lot of spam recently!

<script src="{{ '/js/tags.js' | prepend: site.baseurl }}"></script>