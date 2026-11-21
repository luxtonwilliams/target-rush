
/*
 LUXTON ARCADE — PLAYER USERNAMES + GIFTS

 No external apps.
 Usernames are stored in the browser.
 Gift links open a personalized popup.
 Existing codes handle redemption.
*/

(() => {
  "use strict";

  if (window.__luxtonIdentityV1) return;
  window.__luxtonIdentityV1 = true;

  const NAME_KEY =
    "luxton_arcade_username_v1";

  const normalize = value =>
    String(value || "").trim();

  const valid = value =>
    /^[A-Za-z0-9_]{3,18}$/.test(
      normalize(value)
    );

  function readName() {
    try {
      return normalize(
        localStorage.getItem(NAME_KEY)
      );
    } catch {
      return "";
    }
  }

  // =====================================
  // USERNAME + GIFT POPUP STYLING
  // =====================================

  const css = document.createElement("style");

  css.textContent = `
    #lx-player-chip {
      display:inline-flex;
      align-items:center;
      gap:6px;
      margin:10px 6px;
      padding:9px 12px;
      border:1px solid #75c9e6;
      border-radius:10px;
      background:#1b4666;
      color:white;
      font:800 13px system-ui,sans-serif;
      cursor:pointer;
      touch-action:manipulation;
    }

    #lx-identity-modal {
      position:fixed;
      inset:0;
      z-index:2147483640;
      background:#041326e9;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:16px;
      font-family:system-ui,Arial,sans-serif;
      color:#effaff;
    }

    #lx-identity-modal * {
      box-sizing:border-box;
    }

    #lx-identity-card {
      width:min(440px,100%);
      max-height:94dvh;
      overflow:auto;
      background:linear-gradient(
        145deg,#143e62,#1a274e
      );
      border:2px solid #8be1ed;
      border-radius:18px;
      padding:22px;
      box-shadow:0 15px 60px #000a;
    }

    #lx-identity-card h2 {
      margin:0 0 10px;
      color:#fff2b6;
      font-size:23px;
    }

    #lx-identity-card p {
      font-size:13px;
      line-height:1.55;
      color:#d3eaff;
    }

    #lx-identity-card label {
      display:block;
      font-size:13px;
      font-weight:800;
      margin:15px 0 5px;
    }

    #lx-identity-card input {
      width:100%;
      min-height:45px;
      border-radius:10px;
      border:1px solid #9ec8e4;
      background:#091f3d;
      color:white;
      padding:10px;
      font-size:16px;
    }

    #lx-identity-card button {
      border:0;
      border-radius:10px;
      min-height:44px;
      padding:10px 14px;
      background:#8cf0d5;
      color:#0e3043;
      font:900 14px system-ui,sans-serif;
      cursor:pointer;
      touch-action:manipulation;
    }

    #lx-identity-card button.secondary {
      background:#2d5178;
      color:white;
      border:1px solid #81b4dc;
    }

    #lx-identity-card .lx-buttons {
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:15px;
    }

    #lx-identity-card .lx-error {
      min-height:18px;
      color:#ffb7ad;
      font-size:13px;
      font-weight:700;
    }

    #lx-identity-card .lx-gift-code {
      font:900 22px ui-monospace,monospace;
      letter-spacing:1px;
      text-align:center;
      padding:14px;
      border-radius:10px;
      border:1px dashed #b5dfff;
      background:#102f4d;
      color:#fff3bc;
      overflow-wrap:anywhere;
    }

    #lx-identity-card button:focus-visible,
    #lx-player-chip:focus-visible {
      outline:3px solid #ffe8a4;
      outline-offset:2px;
    }
  `;

  document.head.appendChild(css);

  let modal = null;
  let chip = null;

  // =====================================
  // COMMON POPUP HELPERS
  // =====================================

  function button(
    label,
    onClick,
    secondary = false
  ) {
    const b = document.createElement("button");

    b.type = "button";
    b.textContent = label;

    if (secondary) {
      b.className = "secondary";
    }

    b.addEventListener("click", onClick);

    return b;
  }

  function closeModal() {
    if (modal) modal.remove();
    modal = null;
  }

  function openModal(title) {
    closeModal();

    modal = document.createElement("div");
    modal.id = "lx-identity-modal";

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", title);

    const card = document.createElement("div");
    card.id = "lx-identity-card";

    const heading = document.createElement("h2");
    heading.textContent = title;

    card.append(heading);
    modal.append(card);
    document.body.append(modal);

    return card;
  }

  function paragraph(card, value) {
    const p = document.createElement("p");
    p.textContent = value;
    card.append(p);
    return p;
  }

  function updateChip() {
    if (!chip) return;

    chip.textContent =
      "👤 " + readName() + " · Edit";
  }

  // =====================================
  // USERNAME SETUP
  // =====================================

  function usernameEditor(required = false) {
    const card = openModal(
      required
        ? "🎮 Choose a player username"
        : "👤 Change player username"
    );

    paragraph(
      card,
      "Pick a nickname to use on this browser. " +
      "Please don't use your full real name " +
      "or email address."
    );

    const form = document.createElement("form");

    const label = document.createElement("label");
    label.htmlFor = "lx-username-input";
    label.textContent = "Your username";

    const input = document.createElement("input");

    input.id = "lx-username-input";
    input.maxLength = 18;
    input.placeholder = "Example: RocketPlayer7";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.value = readName();

    const hint = document.createElement("p");
    hint.textContent =
      "3–18 characters: letters, numbers, " +
      "or underscores. Usernames aren't " +
      "globally unique or verified.";
    hint.style.fontSize = "12px";

    const error = document.createElement("p");
    error.className = "lx-error";

    const save = document.createElement("button");
    save.type = "submit";
    save.textContent = "✅ Save username";

    form.append(
      label,
      input,
      hint,
      error,
      save
    );

    form.addEventListener("submit", event => {
      event.preventDefault();

      const name = normalize(input.value);

      if (!valid(name)) {
        error.textContent =
          "Use 3–18 letters, numbers, " +
          "or underscores.";
        return;
      }

      if (
        /^(admin|moderator|system|staff|support)$/i
          .test(name)
      ) {
        error.textContent =
          "Please choose a different username.";
        return;
      }

      try {
        localStorage.setItem(NAME_KEY, name);
      } catch {
        error.textContent =
          "Browser storage is unavailable.";
        return;
      }

      updateChip();
      closeModal();
      showGiftIfPresent();
    });

    card.append(form);

    if (!required) {
      const row = document.createElement("div");
      row.className = "lx-buttons";

      row.append(
        button(
          "Cancel",
          () => {
            closeModal();
            showGiftIfPresent();
          },
          true
        )
      );

      card.append(row);
    }

    input.focus();
  }

  // =====================================
  // EXISTING ARCADE CODES
  // =====================================

  const GIFT_CODES = new Set([
    "CRABROYAL",
    "CRABNEON",
    "CRABTIDE",
    "CRABSHELLS",
    "STARSHIP",
    "PUTTPARTY",
    "DIGDEEP",
    "ARCADEVIP",

    "PRISMRIDER",
    "STARHELMET",
    "SOLARBIKE",

    "ALIENPILOT",
    "GALAXYACE",
    "HYPERENGINE",
    "LASERLAB",

    "CRYSTALCANNON",
    "FROSTFORT",
    "IRONFORT",

    "COSMICDUNK",
    "FLAMEHOOPS",

    "CRYSTALROD",
    "SAILAWAY",
    "LEGENDLURE",
    "MOONLAGOON",

    "METEORPUTT",
    "RAINBOWPUTT",
    "PROGOLF",
    "HAZARDSAFE",

    "ROBOPET",
    "GEMMOLE",
    "MEGADRILL",
    "VAULTVISION"
  ]);

  function clearGiftFromAddress() {
    const url = new URL(location.href);

    url.searchParams.delete("gift");
    url.searchParams.delete("to");

    history.replaceState(
      null,
      "",
      url.pathname + url.search + url.hash
    );
  }

  // =====================================
  // GIFT POPUP
  // =====================================

  function showGiftIfPresent() {
    const form =
      document.getElementById("codeForm");

    // Only the homepage has code redemption.
    if (!form) return;

    const url = new URL(location.href);

    const code = normalize(
      url.searchParams.get("gift")
    ).toUpperCase();

    const target = normalize(
      url.searchParams.get("to")
    );

    if (
      !code ||
      !target ||
      !valid(target) ||
      !GIFT_CODES.has(code)
    ) {
      return;
    }

    if (!valid(readName())) return;

    const matched =
      readName().toLowerCase() ===
      target.toLowerCase();

    const card = openModal(
      "🎁 You have an Arcade gift!"
    );

    paragraph(
      card,
      "A gift link was prepared for " +
      "username: " + target
    );

    const codeBox =
      document.createElement("div");

    codeBox.className = "lx-gift-code";
    codeBox.textContent = code;

    card.append(codeBox);

    if (!matched) {
      paragraph(
        card,
        "You're using the nickname " +
        readName() +
        ". This link is addressed to another " +
        "nickname. Usernames don't verify identity."
      );
    } else {
      paragraph(
        card,
        "Hi " + readName() +
        "! Tap Redeem to claim this code " +
        "in your current browser."
      );
    }

    const actions =
      document.createElement("div");

    actions.className = "lx-buttons";

    if (matched) {
      actions.append(
        button("🎟️ Redeem gift", () => {
          const redeemForm =
            document.getElementById("codeForm");

          const redeemInput =
            document.getElementById("codeInput");

          if (!redeemForm || !redeemInput) {
            return;
          }

          redeemInput.value = code;

          clearGiftFromAddress();
          closeModal();

          if (
            typeof redeemForm.requestSubmit ===
            "function"
          ) {
            redeemForm.requestSubmit();
          } else {
            redeemForm.querySelector(
              'button[type="submit"],button'
            )?.click();
          }
        })
      );

    } else {
      actions.append(
        button(
          "👤 Switch username",
          () => usernameEditor(false)
        )
      );
    }

    actions.append(
      button(
        "Not now",
        () => {
          clearGiftFromAddress();
          closeModal();
        },
        true
      )
    );

    card.append(actions);
  }

  // =====================================
  // START PLAYER SYSTEM
  // =====================================

function start() {

  // Show the username button, but do NOT force a
  // visitor to create a username on page load.

  chip = button(
    "👤 Player",
    () => usernameEditor(false)
  );

  chip.id = "lx-player-chip";

  const footer = document.querySelector("footer");

  if (footer) {
    footer.append(chip);
  } else {
    chip.style.cssText =
      "position:fixed;right:12px;bottom:12px;" +
      "z-index:2147482000";
    document.body.append(chip);
  }

  function updateGuestChip() {
    chip.textContent = valid(readName())
      ? "👤 " + readName() + " · Edit"
      : "👤 Guest · Choose username";
  }

  updateGuestChip();

  const isGamePage =
    /\/games\/[a-z-]+\/?/i.test(location.pathname);

  // Controls that begin or actively play games.
  const playControls = [
    "#startBtn",
    "#start",
    "#again",
    "#go",
    "#playBtn",
    "#classicBtn",
    "#champBtn",
    "#action",
    "#mine",
    "#shoot",
    "#fire",
    "#jumpBtn",
    "#pinchBtn",
    "#jump",
    "#lift",
    "button[data-action='start']",
    "button[data-act='start']",
    "button[data-dir]"
  ].join(",");

  let asking = false;

  function askForUsername() {
    if (asking) return;

    asking = true;
    usernameEditor(false);

    // Visitors can cancel and continue browsing.
    // After saving, click Play again.
    const modal = document.getElementById(
      "lx-identity-modal"
    );

    if (modal) {
      const observer = new MutationObserver(() => {
        if (!document.getElementById(
          "lx-identity-modal"
        )) {
          asking = false;
          updateGuestChip();
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true
      });
    }
  }

  function protectPlay(event) {
    if (valid(readName())) return;

    const target = event.target;

    if (!(target instanceof Element)) return;

    // Never block the username popup itself.
    if (target.closest("#lx-identity-modal")) return;

    let wantsToPlay = false;

    if (isGamePage) {
      wantsToPlay = !!target.closest(playControls);
    } else {
      wantsToPlay = !!target.closest(
        "a[data-game], #randomBtn"
      );
    }

    if (!wantsToPlay) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    askForUsername();
  }

  // Intercept game launches and game controls.
  document.addEventListener(
    "pointerdown",
    protectPlay,
    true
  );

  document.addEventListener(
    "click",
    protectPlay,
    true
  );

  // Protect keyboard controls used for gameplay.
  if (isGamePage) {
    window.addEventListener("keydown", event => {
      if (valid(readName())) return;

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest(
          "input, textarea, select, #lx-identity-modal"
        )
      ) return;

      if (
        ["Space", "ArrowUp", "ArrowDown",
         "ArrowLeft", "ArrowRight"].includes(event.code)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        askForUsername();
      }
    }, true);
  }

  // Gift links may still display for existing players.
  if (valid(readName())) {
    showGiftIfPresent();
  }
}
 start();
  }

})();
