/*
  YOUR PROJECTS
  ─────────────
  Each { ... } block is one project. To add a project, copy a whole block
  (from its opening { to its closing },) and change the details.

  The three projects below are EXAMPLES (example: true). They show the format.
  Replace them with your own work, and delete the `example: true` line, before you share the site.

  Project fields (all optional except id and title):
    id          short name used in the link, letters and dashes only: "my-game"
    title       project name
    summary     one or two sentences shown on the project card
    status      "Completed" or "In progress" (leave out `end` while in progress)
    start, end  "2025-09" or "2025-09-14"
    role        "Solo project", "Team of 3: I wrote the backend", ...
    hours       rough total hours you spent
    tags        languages and tools you used
    featured    true = show on the home page
    hidden      true = hide it while it's still a draft
    cover       a screenshot, e.g. "images/my-game/cover.png" (otherwise colourful art is generated)
    hue         0–360, colour of the generated art
    links       { demo: "...", code: "...", video: "..." }
    problem     why you built it
    goals       list of { text: "...", done: true/false, note: "optional" }
    log         the development log (see below)
    challenges  list of { problem: "...", solution: "..." }
    learned     list of things you learned
    next        list of things you'd add next

  Each log entry:
    { date: "2025-09-14", phase: "Build", title: "...", body: "...",
      hours: 3,                                            (optional)
      image: "images/...", caption: "...",                 (optional)
      code: { file: "main.py", text: `...` } }             (optional)

  phase is one of: Plan, Design, Build, Test, Fix, Reflect
  In body text, a blank line starts a new paragraph and lines starting with "- " become a list.
*/
window.PROJECTS = [
  {
    id: "focus-timer",
    example: true,
    featured: true,
    title: "Focus Timer",
    summary:
      "A distraction-free study timer that tracks focus sessions and shows weekly progress. I built it after noticing how often I lost focus during homework.",
    status: "Completed",
    start: "2025-09",
    end: "2025-11",
    role: "Solo project",
    hours: 38,
    tags: ["JavaScript", "HTML", "CSS", "Canvas"],
    hue: 14,
    links: {
      code: "https://github.com/your-username/focus-timer",
    },

    problem: `
      I kept picking up my phone during homework. Most timer apps I tried were full of ads or needed an account,
      and none of them showed whether I was actually getting better at focusing.

      I wanted a simple timer that runs in the browser, works offline, and keeps a private record of my study sessions.
    `,

    goals: [
      { text: "Start, pause and reset a 25-minute focus timer", done: true },
      { text: "Keep accurate time even when the tab is in the background", done: true },
      { text: "Save sessions without needing an account", done: true },
      { text: "Show a chart of focus time for the last 7 days", done: true },
      { text: "Sync sessions between devices", done: false, note: "needs a server, so I left it for later" },
    ],

    log: [
      {
        date: "2025-09-06",
        phase: "Plan",
        title: "Defining the problem",
        body: `
          I wrote down exactly what bothered me about existing apps and turned it into a short list of requirements.
          I chose plain HTML, CSS and JavaScript so I would learn how things work without a framework hiding the details.

          I also decided the first version only needs **one** feature: a timer that works. Everything else can wait.
        `,
      },
      {
        date: "2025-09-09",
        phase: "Design",
        title: "Sketching the interface",
        body: `
          I drew three layouts on paper and asked two friends which one felt calmest. Both picked the one with a
          single big countdown and nothing else on screen, so I went with that.
        `,
      },
      {
        date: "2025-09-14",
        phase: "Build",
        title: "First working timer",
        hours: 4,
        body: `
          Got a countdown working with \`setInterval\`, subtracting one second on every tick. Start, pause and reset all work.
          That evening I used it for my own homework, which felt great.
        `,
      },
      {
        date: "2025-09-21",
        phase: "Fix",
        title: "The timer was running slow",
        hours: 3,
        body: `
          During a real study session, my 25-minute timer finished almost two minutes late. After some research I learned
          that browsers slow down timers in background tabs to save battery, so counting ticks is unreliable.

          The fix was to stop counting. Instead, I save the exact time the session should end and work out the
          remaining time from the clock on every tick. Now it stays accurate even when the tab is hidden.
        `,
        code: {
          file: "timer.js",
          text: `
            // Before: counted ticks, which ran slow in background tabs.
            // After: remember when the session should end, and check the clock.
            function start(minutes) {
              endTime = Date.now() + minutes * 60 * 1000;
              timerId = setInterval(tick, 250);
            }

            function tick() {
              const remaining = Math.max(0, endTime - Date.now());
              render(remaining);
              if (remaining === 0) finish();
            }
          `,
        },
      },
      {
        date: "2025-10-04",
        phase: "Build",
        title: "Saving sessions and a weekly chart",
        hours: 6,
        body: `
          Each finished session is now saved with \`localStorage\`, so no account is needed. I drew a bar chart of the
          last 7 days on a \`<canvas>\`, which taught me a lot about coordinates and scaling for high-resolution screens.
        `,
      },
      {
        date: "2025-10-18",
        phase: "Test",
        title: "One week of user testing",
        body: `
          Five classmates used the timer for a week and filled out a short form. The main findings:

          - The end-of-session sound was far too loud in a quiet library
          - Three people wanted keyboard shortcuts
          - Nobody used the settings page, so I simplified it

          I added a volume slider and made the space bar start and pause the timer.
        `,
      },
      {
        date: "2025-11-08",
        phase: "Reflect",
        title: "Looking back",
        body: `
          This was the first project I finished and then used every day. If I started again, I would test with real
          people much earlier. One week of feedback changed more than a month of my own guesses.
        `,
      },
    ],

    challenges: [
      {
        problem: "The timer drifted by up to two minutes when the tab was in the background.",
        solution: "Store the end time, and calculate the remaining time from the clock on each tick instead of counting ticks.",
      },
      {
        problem: "The chart looked blurry on high-resolution screens.",
        solution: "Scale the canvas by `window.devicePixelRatio` and draw at the larger size.",
      },
      {
        problem: "Clearing browser data deleted every saved session.",
        solution: "Added buttons to export sessions to a file and import them again.",
      },
    ],

    learned: [
      "How browser timers really work, and why `setInterval` shouldn't be trusted for exact timing.",
      "Drawing graphics with the Canvas API, including on high-resolution screens.",
      "Real users find problems you would never think of, so testing early saves time.",
      "Keeping a dev log made it much easier to remember why I made each decision.",
    ],

    next: [
      "A dark mode that follows the system setting",
      "Make it installable as an app (a Progressive Web App)",
    ],
  },

  {
    id: "maze-solver",
    example: true,
    featured: true,
    title: "Maze Solver Visualizer",
    summary:
      "A Python program that generates random mazes and animates how BFS and A* search for the shortest path, so the two algorithms can be compared side by side.",
    status: "Completed",
    start: "2026-01",
    end: "2026-04",
    role: "Solo project · grew out of a computer science class unit",
    hours: 46,
    tags: ["Python", "Pygame", "Algorithms"],
    hue: 218,
    links: {
      code: "https://github.com/your-username/maze-solver",
    },

    problem: `
      In computer science class we learned about search algorithms, but it was hard to picture what an algorithm is
      actually *doing*. I wanted to watch it happen step by step, and to answer a real question:
      is A* really faster than breadth-first search, and by how much?
    `,

    goals: [
      { text: "Generate a random maze of any size", done: true },
      { text: "Animate BFS and A* exploring the maze", done: true },
      { text: "Let the user draw extra walls with the mouse", done: true },
      { text: "Measure how many cells each algorithm explores", done: true },
      { text: "Add weighted terrain and Dijkstra's algorithm", done: false, note: "planned for version 2" },
    ],

    log: [
      {
        date: "2026-01-10",
        phase: "Plan",
        title: "Research before code",
        body: `
          I spent the first week reading about graph search and working through small examples by hand on grid paper.
          Tracing BFS on a 5×5 grid helped me understand the queue far better than reading code did.
        `,
      },
      {
        date: "2026-01-17",
        phase: "Design",
        title: "Planning the program structure",
        body: `
          I split the program into three parts: a \`Grid\` class that stores cells and walls, the algorithms (which know
          nothing about drawing), and the Pygame code that draws everything. Keeping the algorithms separate meant I
          could test them without opening a window.
        `,
      },
      {
        date: "2026-01-31",
        phase: "Build",
        title: "Generating mazes",
        hours: 5,
        body: `
          I used the recursive backtracker method: start at a cell, move to a random unvisited neighbour, knock down the
          wall between them, and back up whenever you reach a dead end. My first version used recursion and worked
          well for small mazes.
        `,
      },
      {
        date: "2026-02-07",
        phase: "Fix",
        title: "Crash on large mazes",
        hours: 2,
        body: `
          A 60×60 maze crashed with \`RecursionError: maximum recursion depth exceeded\`. Python limits recursion to about
          1,000 calls by default, and a large maze can go thousands of cells deep.

          I rewrote the generator to keep its own stack (a list) instead of using recursion. Same algorithm, no limit.
        `,
        code: {
          file: "maze.py",
          text: `
            def generate_maze(grid, start):
                """Recursive backtracker, rewritten with a stack so big mazes don't crash."""
                stack = [start]
                start.visited = True
                while stack:
                    cell = stack[-1]
                    options = [n for n in grid.neighbours(cell) if not n.visited]
                    if not options:
                        stack.pop()  # dead end: back up
                        continue
                    nxt = random.choice(options)
                    grid.remove_wall(cell, nxt)
                    nxt.visited = True
                    stack.append(nxt)
          `,
        },
      },
      {
        date: "2026-02-28",
        phase: "Build",
        title: "Animating BFS and A*",
        hours: 8,
        body: `
          Both algorithms now run one step per frame, so you can watch the search spread out. Explored cells turn blue
          and the final path turns orange. For A*, I used Manhattan distance as the heuristic, since you can only move
          up, down, left or right.
        `,
      },
      {
        date: "2026-03-21",
        phase: "Test",
        title: "Running an experiment",
        hours: 4,
        body: `
          I wrote a script that ran both algorithms on 200 random mazes and recorded how many cells each one explored.
          Both always found paths of the same length, which confirmed that my A* was correct.

          The surprise: on open grids A* explored about **40% fewer** cells, but on perfect mazes the difference was only
          around 10%. When there is only one route, the heuristic often points straight at a wall, so A* ends up
          exploring most of the dead ends anyway.
        `,
      },
      {
        date: "2026-04-11",
        phase: "Reflect",
        title: "What the numbers taught me",
        body: `
          I expected A* to win easily everywhere. Running a real experiment showed me that the best algorithm depends on
          the problem, which I would never have learned just by reading about it. I presented the results to my class.
        `,
      },
    ],

    challenges: [
      {
        problem: "Large mazes crashed with a `RecursionError`.",
        solution: "Replaced recursion with an explicit stack, so maze size is limited only by memory.",
      },
      {
        problem: "The window froze while an algorithm was searching.",
        solution: "Turned each algorithm into a Python generator that `yield`s after every step, so the main loop can draw a frame in between.",
      },
      {
        problem: "It was hard to tell whether my A* was actually correct.",
        solution: "Compared its path length with BFS, which always finds a shortest path, on hundreds of random mazes.",
      },
    ],

    learned: [
      "How BFS, A* and heuristics work, and why A* with a good heuristic still finds a shortest path.",
      "Python generators, and how to keep a program responsive during a long task.",
      "Separating logic from drawing makes code much easier to test.",
      "How to design a fair experiment and report the results honestly, including the surprising ones.",
    ],

    next: [
      "Weighted terrain (mud, water) and Dijkstra's algorithm",
      "A web version in JavaScript so anyone can try it without installing Python",
    ],
  },

  {
    id: "plant-monitor",
    example: true,
    featured: true,
    title: "Smart Plant Monitor",
    summary:
      "An Arduino device that measures soil moisture and lights an LED when my plants need water. Currently adding Wi-Fi logging.",
    status: "In progress",
    start: "2026-08",
    role: "Solo project",
    hours: 22,
    tags: ["Arduino", "C++", "Electronics"],
    hue: 142,
    links: {},

    problem: `
      I forget to water the plants in my room, and by the time the leaves droop it's too late. I wanted a small device
      that tells me when the soil is getting dry, and I wanted to learn how software talks to real hardware.
    `,

    goals: [
      { text: "Read soil moisture and light levels", done: true },
      { text: "Turn on a warning LED when the soil is dry", done: true },
      { text: "Run for weeks without the sensor wearing out", done: true },
      { text: "Log readings over Wi-Fi and show them on a chart", done: false, note: "in progress" },
      { text: "Fit everything into a 3D-printed case", done: false },
    ],

    log: [
      {
        date: "2026-08-15",
        phase: "Plan",
        title: "Choosing parts",
        body: `
          I compared a few sensors and settled on an Arduino Uno, a soil moisture sensor, a light sensor and an LED,
          for under $30 in total. I drew the circuit on paper before connecting anything.
        `,
      },
      {
        date: "2026-08-23",
        phase: "Build",
        title: "First readings",
        hours: 3,
        body: `
          Wired up the sensors on a breadboard and printed the values to the Serial Monitor. Watching the number change
          when I pushed the sensor into wet soil was a great moment.
        `,
      },
      {
        date: "2026-09-12",
        phase: "Fix",
        title: "The sensor stopped working",
        body: `
          After about two weeks the readings started drifting, and the sensor's metal prongs were visibly corroded.
          I learned that this kind of resistive sensor passes current through the soil, which slowly eats away the metal.

          I replaced it with a capacitive sensor, which has no exposed metal, and now only power it for a moment when
          taking a reading.
        `,
      },
      {
        date: "2026-09-27",
        phase: "Test",
        title: "Calibrating the sensor",
        hours: 3,
        body: `
          Raw readings are just numbers from 0 to 1023, so I measured the sensor in dry air and in a glass of water and
          used those as 0% and 100%. Then I compared my percentages with how the soil actually felt over a week to pick
          a good "needs water" threshold.
        `,
        code: {
          file: "plant_monitor.ino",
          text: `
            const int DRY = 520;  // reading in dry air
            const int WET = 260;  // reading in a glass of water

            int moisturePercent() {
              long total = 0;
              for (int i = 0; i < 10; i++) {  // average 10 readings to smooth out noise
                total += analogRead(A0);
                delay(10);
              }
              int raw = total / 10;
              return constrain(map(raw, DRY, WET, 0, 100), 0, 100);
            }
          `,
        },
      },
      {
        date: "2026-10-12",
        phase: "Build",
        title: "Starting on Wi-Fi logging",
        hours: 4,
        body: `
          I'm moving the project to an ESP32 board, which has built-in Wi-Fi, so the device can send a reading every
          15 minutes and I can see a chart over time. So far it connects to Wi-Fi; sending the data is next.
        `,
      },
    ],

    challenges: [
      {
        problem: "The first sensor corroded after two weeks in the soil.",
        solution: "Switched to a capacitive sensor and only power it while taking a reading.",
      },
      {
        problem: "Readings jumped around a lot from one second to the next.",
        solution: "Take ten readings in a row and use the average.",
      },
    ],

    learned: [
      "How analog sensors turn physical things into numbers, and why calibration matters.",
      "Basic circuits: voltage, resistors, and why an LED always needs a resistor.",
      "Hardware problems can look like software bugs. Sometimes the fix is a different part, not different code.",
    ],

    next: [
      "Send readings over Wi-Fi and show them on a web chart",
      "Design and 3D-print a waterproof case",
    ],
  },
];
