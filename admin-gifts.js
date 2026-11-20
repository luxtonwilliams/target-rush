
/*
 LUXTON ARCADE — ADMIN GIFT CENTER V2

 Adds gift links, Gift buttons, and Copy buttons
 to your existing Codes dashboard.

 Links must be sent manually.
 No external services are used.
*/

(() => {
  "use strict";

  if (window.__luxtonAdminGiftsV2) return;
  window.__luxtonAdminGiftsV2 = true;

  const USER_KEY =
    "luxton_arcade_username_v1";

  const LOG_KEY =
    "luxton_arcade_gift_links_v1";

  // 8 original codes + 24 Rare Rewards.

  const codeRows = [
    ["CRABROYAL", "Crab Rush · Royal Tide Crab"],
    ["CRABNEON", "Crab Rush · Neon Wave Crab"],
    ["CRABTIDE", "Crab Rush · Tidal Claws"],
    ["CRABSHELLS", "Crab Rush · 35 shells"],
    ["STARSHIP", "Space Rush · 60 coins"],
    ["PUTTPARTY", "Golf Rush · 50 coins"],
    ["DIGDEEP", "Mining Rush · 80 coins"],
    ["ARCADEVIP", "Arcade · VIP badge"],

    ["PRISMRIDER", "Bike Rush · Prism Bike"],
    ["STARHELMET", "Bike Rush · Star Head"],
    ["SOLARBIKE", "Bike Rush · Solar Bike"],

    ["ALIENPILOT", "Space Rush · Alien Explorer"],
    ["GALAXYACE", "Space Rush · Galaxy X"],
    ["HYPERENGINE", "Space Rush · Hyperdrive"],
    ["LASERLAB", "Space Rush · Star Amplifier"],

    ["CRYSTALCANNON", "Castle Rush · Piercing Shot"],
    ["FROSTFORT", "Castle Rush · Frost + Shield"],
    ["IRONFORT", "Castle Rush · Reinforced Walls"],

    ["COSMICDUNK", "Basketball · Cosmic Ball"],
    ["FLAMEHOOPS", "Basketball · Fire Ball"],

    ["CRYSTALROD", "Fishing Rush · Crystal Rod"],
    ["SAILAWAY", "Fishing Rush · Sailboat"],
    ["LEGENDLURE", "Fishing Rush · Lure + Bait"],
    ["MOONLAGOON", "Fishing Rush · Moonlight Lagoon"],

    ["METEORPUTT", "Golf Rush · Meteor Ball"],
    ["RAINBOWPUTT", "Golf Rush · Rainbow Ball"],
    ["PROGOLF", "Golf Rush · Aim + Putter"],
    ["HAZARDSAFE", "Golf Rush · Hazard Insurance"],

    ["ROBOPET", "Mining Rush · Robo-Miner"],
    ["GEMMOLE", "Mining Rush · Gem Mole"],
    ["MEGADRILL", "Mining Rush · Mega Drill"],
    ["VAULTVISION", "Mining Rush · Vault Detector"]
  ];

  const view = document.getElementById("view");
  const app = document.getElementById("app");

  if (!view || !app) return;

  // =====================================
  // ADMIN GIFT CENTER STYLING
  // =====================================

  const css = document.createElement("style");

  css.textContent = `
    #lx-gift-builder {
      background:linear-gradient(
        135deg,#1d4a64,#263c62
      );
      border-color:#86bad2;
    }

    #lx-gift-builder .lx-gift-grid {
      display:grid;
      grid-template-columns:1fr 1fr auto;
      gap:10px;
      align-items:end;
      margin-top:12px;
    }

    #lx-gift-builder label {
      display:block;
      font-size:12px;
      font-weight:750;
      color:#e2f1ff;
    }

    #lx-gift-builder input,
    #lx-gift-builder select {
      width:100%;
      height:43px;
      margin-top:5px;
      background:#0b2540;
      color:white;
      border:1px solid #88bfd8;
      border-radius:9px;
      padding:8px;
    }

    #lx-gift-builder button {
      min-height:42px;
    }

    #lx-gift-output {
      margin-top:15px;
      padding:12px;
      border-radius:10px;
      background:#112b43;
      border:1px solid #60aeb3;
    }

    #lx-gift-output[hidden] {
      display:none!important;
    }

    #lx-gift-output input {
      font-size:12px;
    }

    #lx-gift-builder .lx-gift-notice {
      font-size:12px;
      line-height:1.6;
      color:#deebf5;
    }

    #lx-gift-builder .lx-gift-error {
      color:#ffc2b3;
      min-height:17px;
      font-size:12px;
    }

    #lx-gift-builder .lx-gift-actions {
      display:flex;
      gap:9px;
      flex-wrap:wrap;
      margin-top:9px;
    }

    #lx-gift-builder .lx-gift-history {
      font-size:12px;
      line-height:1.65;
      color:#dce8f8;
      margin-top:10px;
    }

    button.lx-gift-row {
      background:#254c62;
      color:#fff;
      border:1px solid #7cb0bf;
      border-radius:7px;
      padding:5px 8px;
      font:800 11px system-ui;
      cursor:pointer;
      margin-left:8px;
    }

    @media(max-width:700px) {
      #lx-gift-builder .lx-gift-grid {
        grid-template-columns:1fr;
      }

      #lx-gift-builder input,
      #lx-gift-builder select {
        min-width:0;
      }
    }
  `;

  document.head.append(css);

  // =====================================
  // HELPERS
  // =====================================

  function readLog() {
    try {
      const data = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );

      return Array.isArray(data)
        ? data
        : [];

    } catch {
      return [];
    }
  }

  function el(tag, content, className) {
    const node = document.createElement(tag);

    if (content !== undefined) {
      node.textContent = content;
    }

    if (className) {
      node.className = className;
    }

    return node;
  }

  function inputField(labelText, control) {
    const wrapper =
      document.createElement("label");

    wrapper.textContent = labelText;
    wrapper.append(control);

    return wrapper;
  }

  async function copyText(
    text,
    field,
    feedback
  ) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(text);

      feedback.textContent =
        "✅ Link copied. Share it with the player.";

    } catch {
      field.focus();
      field.select();

      feedback.textContent =
        "Copy the selected link using Ctrl+C " +
        "or Copy on your phone.";
    }
  }

  // =====================================
  // BUILD GIFT INTERFACE
  // =====================================

  function mountGiftBuilder() {
    if (
      app.hidden ||
      !document.getElementById("codeSearch") ||
      document.getElementById("lx-gift-builder")
    ) {
      return;
    }

    const section =
      document.createElement("section");

    section.id = "lx-gift-builder";
    section.className = "panel";

    section.append(
      el(
        "h2",
        "🎁 Gift a secret code to a player"
      )
    );

    section.append(
      el(
        "p",
        "Enter the player's nickname and " +
        "choose any existing code. They'll " +
        "get a gift pop-up when they open " +
        "your link."
      )
    );

    const form =
      document.createElement("form");

    form.className = "lx-gift-grid";

    const to =
      document.createElement("input");

    to.type = "text";
    to.placeholder = "Example: RocketPlayer7";
    to.maxLength = 18;
    to.autocomplete = "off";
    to.required = true;

    const select =
      document.createElement("select");

    select.required = true;
    select.setAttribute(
      "aria-label",
      "Gift code to send"
    );

    for (const [code, description] of codeRows) {
      const option =
        document.createElement("option");

      option.value = code;

      option.textContent =
        code + " — " + description;

      select.append(option);
    }

    const submit = el(
      "button",
      "🎁 Create Gift Link",
      "btn"
    );

    submit.type = "submit";

    form.append(
      inputField("Player username", to),
      inputField("Code to give", select),
      submit
    );

    section.append(form);

    const error = el(
      "p",
      "",
      "lx-gift-error"
    );

    error.setAttribute("role", "status");

    section.append(error);

    // ===================================
    // OUTPUT: SHAREABLE GIFT LINK
    // ===================================

    const output = el("div");
    output.id = "lx-gift-output";
    output.hidden = true;

    const title = el(
      "strong",
      "Your gift link is ready"
    );

    const urlField =
      document.createElement("input");

    urlField.type = "text";
    urlField.readOnly = true;

    urlField.setAttribute(
      "aria-label",
      "Gift URL to share"
    );

    const actions = el(
      "div",
      undefined,
      "lx-gift-actions"
    );

    const copy = el(
      "button",
      "📋 Copy Gift Link",
      "btn"
    );

    copy.type = "button";

    const share = el(
      "button",
      "↗ Share",
      "btn alt"
    );

    share.type = "button";

    const feedback = el(
      "p",
      "",
      "lx-gift-notice"
    );

    actions.append(copy, share);

    output.append(
      title,
      urlField,
      actions,
      feedback
    );

    section.append(output);

    share.hidden =
      typeof navigator.share !== "function";

    copy.addEventListener("click", () => {
      copyText(
        urlField.value,
        urlField,
        feedback
      );
    });

    share.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: "Luxton Arcade gift",
          text:
            "A gift for your Arcade username!",
          url: urlField.value
        }).catch(() => {});
      }
    });

    section.append(
      el(
        "p",
        "This isn't a push notification or " +
        "private account message. Send the " +
        "link yourself. Anyone with the link " +
        "can see its code, and usernames " +
        "aren't verified.",
        "lx-gift-notice"
      )
    );

    // ===================================
    // GIFT LINK HISTORY
    // ===================================

    const historyBox = el(
      "div",
      undefined,
      "lx-gift-history"
    );

    section.append(historyBox);

    function renderHistory() {
      const log = readLog();

      historyBox.replaceChildren();

      historyBox.append(
        el(
          "strong",
          "Links prepared on this browser: " +
          log.length
        )
      );

      for (
        const item of log.slice(-5).reverse()
      ) {
        historyBox.append(
          el(
            "div",
            item.to + " · " +
            item.code + " · " +
            new Date(
              item.at
            ).toLocaleDateString() +
            " · Delivery not verified"
          )
        );
      }
    }

    // ===================================
    // GENERATE LINK ON SUBMIT
    // ===================================

    form.addEventListener(
      "submit",
      event => {
        event.preventDefault();

        const name = to.value.trim();

        if (
          !/^[A-Za-z0-9_]{3,18}$/.test(name)
        ) {
          error.textContent =
            "Use a username with 3–18 letters, " +
            "numbers, or underscores.";
          return;
        }

        const code = select.value;

        if (
          !codeRows.some(
            row => row[0] === code
          )
        ) {
          return;
        }

        // Root homepage from /admin/
        const link = new URL(
          "../",
          location.href
        );

        link.searchParams.set(
          "gift",
          code
        );

        link.searchParams.set(
          "to",
          name
        );

        link.hash = "codes";

        const log = readLog();

        log.push({
          to: name,
          code,
          at: Date.now()
        });

        try {
          localStorage.setItem(
            LOG_KEY,
            JSON.stringify(
              log.slice(-200)
            )
          );
        } catch {
          error.textContent =
            "Could not save gift history.";
        }

        urlField.value = link.href;

        feedback.textContent =
          "For @" + name +
          ": copy and send this link.";

        output.hidden = false;

        renderHistory();

        output.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      }
    );

    renderHistory();

    // ===================================
    // ADD TO EXISTING CODES SCREEN
    // ===================================

    const catalogPanel =
      document.getElementById(
        "codeSearch"
      ).closest(".panel");

    view.insertBefore(
      section,
      catalogPanel
    );

    // ===================================
    // ADD GIFT + COPY BUTTONS TO ROWS
    // ===================================

    for (
      const row of catalogPanel.querySelectorAll(
        "tbody tr"
      )
    ) {
      const cell = row.querySelector("td");

      if (!cell) continue;

      const code = cell.textContent.trim();

      if (
        !codeRows.some(
          item => item[0] === code
        )
      ) {
        continue;
      }

      const gift = el(
        "button",
        "🎁 Gift",
        "lx-gift-row"
      );

      gift.type = "button";

      gift.addEventListener(
        "click",
        () => {
          select.value = code;

          section.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          to.focus();
        }
      );

      const copyCode = el(
        "button",
        "📋 Copy",
        "lx-gift-row"
      );

      copyCode.type = "button";

      copyCode.addEventListener(
        "click",
        async () => {
          try {
            await navigator.clipboard.writeText(
              code
            );

            copyCode.textContent =
              "✓ Copied";

          } catch {
            copyCode.textContent =
              "Select code to copy";
          }
        }
      );

      cell.append(
        gift,
        copyCode
      );
    }
  }

  // =====================================
  // SHOW USERNAME IN USERS TAB
  // =====================================

  function updateUsers() {
    if (
      app.hidden ||
      !/Users/i.test(
        document.getElementById(
          "pageTitle"
        )?.textContent || ""
      )
    ) {
      return;
    }

    const row = view.querySelector(
      ".panel table tbody tr"
    );

    if (
      !row ||
      row.dataset.lxPlayerEnhanced
    ) {
      return;
    }

    const nickname =
      localStorage.getItem(USER_KEY) ||
      "No username selected";

    if (row.cells.length >= 3) {
      row.cells[1].textContent =
        nickname + " (local nickname)";

      row.cells[2].textContent =
        "Not collected";
    }

    row.dataset.lxPlayerEnhanced = "yes";
  }

  // =====================================
  // WATCH ADMIN PAGE NAVIGATION
  // =====================================

  function sync() {
    if (app.hidden) return;

    if (
      document.getElementById("codeSearch")
    ) {
      mountGiftBuilder();
    } else {
      updateUsers();
    }
  }

  const observer =
    new MutationObserver(sync);

  observer.observe(
    view,
    { childList: true }
  );

  observer.observe(
    app,
    {
      attributes: true,
      attributeFilter: ["hidden"]
    }
  );

  sync();

})();
