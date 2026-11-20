
/*
  LUXTON ARCADE — LOCAL ANALYTICS

  Records estimated engaged time in games.
  Data stays on this browser.
  No account, email, or outside service.
*/

(() => {
  "use strict";

  const match = location.pathname
    .toLowerCase()
    .match(/\/games\/([a-z-]+)(?:\/|$)/);

  if (!match) return;

  const id = match[1];

  const KEY =
    "luxton_arcade_local_analytics_v1";

  function today() {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function read() {
    try {
      const value = JSON.parse(
        localStorage.getItem(KEY)
      );

      return value &&
        typeof value === "object" &&
        !Array.isArray(value)
          ? value
          : {};

    } catch {
      return {};
    }
  }

  const data = read();
  const now = Date.now();

  if (!data.visitorId) {
    data.visitorId =
      "LOCAL-" +
      (
        crypto.randomUUID
          ? crypto.randomUUID()
              .slice(0, 8)
              .toUpperCase()
          : Math.random()
              .toString(36)
              .slice(2, 10)
              .toUpperCase()
      );
  }

  if (!data.firstSeen) {
    data.firstSeen = now;
  }

  if (
    !data.games ||
    typeof data.games !== "object"
  ) {
    data.games = {};
  }

  const game = data.games[id] || {
    firstSeen: now,
    lastSeen: now,
    seconds: 0,
    sessions: 0,
    days: {}
  };

  if (
    !game.days ||
    typeof game.days !== "object"
  ) {
    game.days = {};
  }

  game.firstSeen =
    game.firstSeen || now;

  game.sessions =
    Math.max(
      0,
      Number(game.sessions) || 0
    ) + 1;

  game.lastSeen = now;

  const initialDay = today();

  if (!game.days[initialDay]) {
    game.days[initialDay] = {
      seconds: 0,
      sessions: 0
    };
  }

  game.days[initialDay].sessions =
    (Number(
      game.days[initialDay].sessions
    ) || 0) + 1;

  data.games[id] = game;
  data.lastSeen = now;

  function save() {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify(data)
      );
    } catch {}
  }

  save();

  let lastTick = Date.now();
  let lastInteraction = Date.now();

  function touch() {
    lastInteraction = Date.now();
  }

  for (
    const event of [
      "pointerdown",
      "keydown",
      "wheel",
      "touchstart"
    ]
  ) {
    window.addEventListener(
      event,
      touch,
      { passive: true }
    );
  }

  function tick() {
    const n = Date.now();

    const delta = Math.max(
      0,
      Math.min(
        6,
        (n - lastTick) / 1000
      )
    );

    lastTick = n;

    // Count time only when:
    // - Tab is visible
    // - Browser window is focused
    // - Player interacted within 60 seconds
    //
    // This is an estimate of engagement,
    // not confirmed active in-game time.

    if (
      !document.hidden &&
      document.hasFocus() &&
      n - lastInteraction < 60000
    ) {
      const day = today();

      if (!game.days[day]) {
        game.days[day] = {
          seconds: 0,
          sessions: 0
        };
      }

      game.days[day].seconds =
        (Number(
          game.days[day].seconds
        ) || 0) + delta;

      game.seconds =
        (Number(game.seconds) || 0) +
        delta;
    }

    game.lastSeen = n;
    data.lastSeen = n;

    save();
  }

  setInterval(tick, 5000);

  window.addEventListener(
    "pagehide",
    tick
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      lastTick = Date.now();

      if (!document.hidden) {
        lastInteraction = Date.now();
      }
    }
  );

})();

// Load username setup in all nine games.
// Keep all the existing analytics code above.

(() => {
  const script = document.createElement("script");

  script.src = "../../arcade-identity.js";

  document.body.appendChild(script);
})();
