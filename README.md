# My project portfolio

A personal website that shows my programming projects and the development log behind each one.

It's plain HTML, CSS and JavaScript: no installs, no build step. All the content lives in two files in the `data` folder, so adding a project never means touching the layout code.

```
index.html          home page: intro, featured projects, latest log entries, about, contact
projects.html       every project, with a filter by language/tool
project.html        one project's full page, opened as project.html?id=<project id>
data/site-info.js   ← your name, intro, about text, skills, contact
data/projects.js    ← your projects and their dev logs
images/             ← screenshots and photos
css/style.css       colours, fonts and layout
js/site.js          builds the pages from the data files (you rarely need to touch this)
```

---

## 1. Look at it

Double-click `index.html` and it opens in your browser. After you edit a data file, save it and refresh the page (F5).

The orange **Setup** bar at the top means example content is still in the site. It disappears once you've changed your name and removed every `example: true` line.

## 2. Add your own information

Open `data/site-info.js` in a code editor (VS Code works well) and change the text inside the quotes: your name, the one-line headline, intro, About paragraphs, facts and skills.

Formatting you can use in any text:

| You type | You get |
|---|---|
| `**important**` | **important** |
| `*word*` | *word* (in the headline it's also coloured) |
| `` `code` `` | `code` |
| `[my GitHub](https://github.com/me)` | a link |

## 3. Add your projects

Open `data/projects.js`. Each `{ ... }` block is one project. The three included projects are **examples**: read them to see the format, then replace them with your own work.

To add a project, copy a whole block, from its `{` to its closing `},`, then change the details. The comment at the top of the file explains every field. The important ones:

- `id`: a short name for the link, letters and dashes only (`"weather-app"`)
- `start` / `end`: `"2025-09"`. Leave out `end` while you're still working on it.
- `problem`: why you built it
- `goals`: what you set out to do. Mark each one `done: true` or `done: false`.
- `log`: the development log
- `challenges`, `learned`, `next`

### Writing a dev-log entry

```js
{
  date: "2026-03-02",
  phase: "Fix",                       // Plan, Design, Build, Test, Fix or Reflect
  title: "Fixed the score not saving",
  hours: 2,                           // optional
  body: `
    What happened, what you tried, and what finally worked.

    A blank line starts a new paragraph.
    - Lines starting with a dash
    - become a bullet list
  `,
  image: "images/my-game/score-bug.png",   // optional
  caption: "The score reset to 0 after every level",
  code: {                                   // optional
    file: "game.py",
    text: `
      def save_score(score):
          ...
    `,
  },
},
```

Entries are sorted by date for you, so you can add them in any order.

### Adding screenshots

1. Make a folder for the project, e.g. `images/my-game/`.
2. Put your images in it. Keep each file under about 500 KB; PNG or JPG are both fine.
3. Use `cover: "images/my-game/cover.png"` for the card picture, and `image:` on log entries.

Projects without a `cover` get colourful generated art, so you don't need a screenshot for every project.

### When something breaks

If a page shows **"Couldn't read data/projects.js"**, there's a small typo in that file. Usually it's one of these:

- a missing comma between two items or two projects
- a missing closing quote `"` or backtick `` ` ``
- using a backtick inside a `` `...` `` block (write `` \` `` instead)

Press **F12** and open the **Console** tab; it shows the line number.

## 4. Tips for a strong dev log

Admissions readers can see finished projects anywhere. What this site adds is *how you work*.

- **Write entries while you build**, not afterwards. Dates and honest details are convincing.
- **Include the failures.** "It crashed, here's why, here's how I fixed it" shows more skill than "it worked".
- **Show evidence**: a screenshot, a short code snippet, a number ("explored 40% fewer cells").
- **Say what you'd do differently** in a Reflect entry.
- **Quality over quantity.** Three well-documented projects beat ten thin ones.
- **Be accurate about teamwork and help.** Use `role` to say what *you* did on a team project.

## 5. Put it online for free (GitHub Pages)

1. Create a free account at [github.com](https://github.com).
2. Create a new **public** repository named `your-username.github.io`, using your actual username.
3. On the repository page, choose **Add file → Upload files** and drag in everything in this folder (`index.html`, `projects.html`, `project.html`, `favicon.svg`, and the `css`, `js`, `data` and `images` folders). Click **Commit changes**.
4. Wait a minute, then visit `https://your-username.github.io`.

To update the site later, upload the changed files again the same way.

## Privacy

This site will be public. Don't put your home address, phone number or other personal details on it. Use an email address you're comfortable sharing publicly. If you're under 18, decide with a parent or guardian how much to share, such as whether to name your school or city.
