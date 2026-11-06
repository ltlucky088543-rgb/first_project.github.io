/*
  ABOUT YOU
  ─────────
  Everything about you that appears on the site. Change the text inside the quotes.
  Formatting you can use in any text:  **bold**   *italic*   `code`   [link text](https://...)
  Keep each item's comma at the end of the line.
*/
window.SITE = {
  name: "Your Name",
  initials: "YN",                                   // shown in the square logo
  role: "Student developer · Canada",               // small line above the headline

  // Words between *stars* are highlighted in the accent colour.
  headline: "I build software to *understand* how things work.",
  intro:
    "I'm a student who learns by making things: web apps, games, and small electronics projects. " +
    "Every project here comes with a dated development log that shows how I planned it, what broke, how I fixed it, and what I learned.",

  email: "you@example.com",
  links: [
    { label: "GitHub", url: "https://github.com/your-username" },
    // { label: "LinkedIn", url: "https://www.linkedin.com/in/your-name" },
  ],

  // About section. Each string is one paragraph.
  about: [
    "This is where your story goes. Explain how you got into programming: a class, a game you wanted to mod, a problem you wanted to solve, a family member who showed you something.",
    "Then describe what you enjoy most about building things, and what you want to study at university. Keep it short and specific. A real detail is more memorable than a general claim.",
  ],

  facts: [
    { label: "School", value: "Your school name" },
    { label: "Grade", value: "Your grade and graduation year" },
    { label: "Location", value: "City, Province" },
    { label: "Interests", value: "Computer science, engineering" },
  ],

  skills: [
    { group: "Languages", items: ["Python", "JavaScript", "HTML & CSS", "C++ (Arduino)"] },
    { group: "Tools", items: ["Git & GitHub", "VS Code", "Pygame", "Arduino IDE"] },
    { group: "Currently learning", items: ["Java", "Data structures"] },
  ],

  contactTitle: "Let's talk",
  contactText: "Questions about a project? I'm happy to walk through how I built it, or show a live demo.",
};
