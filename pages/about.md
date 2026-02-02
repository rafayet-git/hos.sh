---
layout: page
title: About
permalink: /about
css: header-highlight
ext_css: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css
---

## Rafayet Hossain

<p class="post-meta">
    <div class="post-tags">
        <a href="#about-me"> About</a> |
        <a href="#skills"> Skills</a> |
        <a href="#experience"> Experience</a> |
        <a href="#projects"> Projects</a> |
        <a href="#education--certs"> Education</a> |
        <a href="#resume"> Resume</a> |
        <a href="#contact-me"> Contact</a>
    </div>
</p>

### About Me

I like to learn about new stuff every day, whether it be about newly released frameworks and tools, trending topics in Comp Sci, or simply picking up new hobbies. 

I enjoy building stuff with what I learned, turning concepts into full-stack projects, solving technical and security problems in multiple ways, and speeding up workflows to improve my own productivity. One of my earliest methods of learning involved taking physical things apart and putting them back together, so I knew what each part's role was to make the whole thing work. I find satisfaction in exploring various fields in CS to learn what I can do better in my own work.

My interests span across web dev, cybersecurity, networking, and virtualization. I'm also into archiving and preserving data, because you'll never know if something you've downloaded might become lost media. I also enjoy building mechanical keyboards, cycling to new areas around NYC, and woodworking (where I somehow managed to make my own desk).

I'm also using this page to give more insights to what I've built or accomplished, farther than what my resume will tell. If you have any other questions, feel free to reach out!


### Skills

{% assign skillsData = site.data.about | where: "category", "Skills" | first %}

{% for skillGroup in skillsData.skills %}
- <details open>
    <summary>{{ skillGroup.name }}</summary>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; padding: 12px;">
        {% for skill in skillGroup.list %}
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            {% if skill.plain %}
            <i class="{{ skill.icon }}" style="font-size: 32px; margin-bottom: 4px;"></i>
            {% else %}
            <img src="{{ skill.icon }}" alt="{{ skill.name }}" style="width: 32px; height: 32px; margin-bottom: 4px;" />
            {% endif %}
            <span style="font-size: 0.75em;">{{ skill.name }}</span>
        </div>
        {% endfor %}
    </div>
    </details>

{% endfor %}

### Experience

{% assign expData = site.data.about | where: "category", "Experience" | first %}

{% for job in expData.jobs %}
- **{{ job.name }}** - *{{ job.position }}*  
  {{ job.time }} {% for note in job.notes %}
  - {{ note }} {% endfor %}

{% endfor %}

### Projects

{% assign projectData = site.data.about | where: "category", "Projects" | first %}

{% for project in projectData.projects %}
- <details>
    <summary><strong>{{ project.name }}</strong> - <em>{{ project.sub }}</em></summary>
    <div>
      <small class="text-muted"><em>{{ project.skills }}</em></small><br>
      {% for link in project.links %}{% if forloop.first == false %} | {% endif %}<a href="{{ link.url }}">{{ link.name }}</a>{% endfor %}
      <ul>
        {% for note in project.notes %}
        <li>{{ note }}</li>
        {% endfor %}
      <img src="{{ '/assets/projects/' | append: project.name | append: '.png' | prepend: site.baseurl }}">

      </ul>
    </div>
  </details>

{% endfor %}

### Education & Certs

{% assign eduData = site.data.about | where: "category", "Education" | first %}
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
    - **{{ course.name }}** ({{course.completion_date}}) - [Link to Course]({{course.link}}) {% endfor %}

### Resume

If it doesn't show for you, download [here]({{ '/assets/rh-resume.pdf' | prepend: site.baseurl }}).
<iframe src="{{ '/assets/rh-resume.pdf' | prepend: site.baseurl }}" width="100%" style="aspect-ratio: 8.5/11" ></iframe>

### Contact Me

{% assign phoneNum = site.data.about | where: "category", "Contact" | first %}

- LinkedIn: [rafayeth]({{ site.links.linkedin }})

- GitHub: [rafayet-git]({{ site.links.github }})

- My E-mail: [rafayet@hos.sh]({{ site.links.email }})

- My Phone: {{ phoneNum.phone }}

I strongly prefer text messages over calls. Please notify me first before calling, as I've been receiving a lot of spam recently!

<script src="{{ '/js/tags.js' | prepend: site.baseurl }}"></script>