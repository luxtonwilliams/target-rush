
/*
  LUXTON ARCADE — MOBILE FULLSCREEN PLAY
  Shared upgrade for all nine Rush games.

  Does not change gameplay, coins, shops, or saves.
*/

(() => {
  "use strict";

  if (window.__luxtonMobilePlay) return;
  window.__luxtonMobilePlay = true;

  const slug = (
    location.pathname.toLowerCase()
      .match(/\/games\/([^/]+)/) || []
  )[1];

  const config = {
    "target-rush": {
      area: "#arena"
    },
    "bike-rush": {
      area: ".game",
      controls: ".controls"
    },
    "basketball-rush": {
      area: ".arena",
      controls: "#luxton-shot-pad, .controls"
    },
    "castle-rush": {
      area: ".arena",
      controls: ".controls"
    },
    "fishing-rush": {
      area: ".scene",
      controls: ".controls"
    },
    "mining-rush": {
      area: ".viewport",
      controls: ".controls"
    },
    "space-rush": {
      area: ".frame",
      controls: ".controls"
    },
    "golf-rush": {
      area: ".stage",
      controls: ".control-panel"
    },
    "crab-rush": {
      area: ".arena",
      controls: ".controls"
    }
  }[slug];

  if (!config) return;

  const area = document.querySelector(config.area);

  if (!area) return;

  const gameCanvas = area.querySelector("canvas");

  // =======================================
  // MOBILE STYLING
  // =======================================

  const style = document.createElement("style");

  style.textContent = `

    .lxa-play-launch {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 9px;
      flex-wrap: wrap;
      margin: 9px 0 11px;
    }

    .lxa-play-launch button {
      border: 2px solid #91edff;
      border-radius: 11px;
      background: linear-gradient(
        110deg,#1a7397,#313d95
      );
      color: #fff;
      font: 900 14px system-ui,sans-serif;
      min-height: 48px;
      padding: 11px 17px;
      box-shadow: 0 4px 15px #0006;
      cursor: pointer;
      touch-action: manipulation;
    }

    .lxa-play-launch small {
      color: #b8e9ff;
      font: 600 12px system-ui,sans-serif;
    }

    canvas,
    .arena,
    .game,
    .scene,
    .viewport,
    .frame,
    .stage,
    #arena {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }

    canvas {
      -webkit-user-drag: none;
      touch-action: none;
    }

    button {
      touch-action: manipulation;
    }

    body.lxa-play-on {
      overflow: hidden !important;
    }

    body.lxa-play-on .lxa-play-launch {
      visibility: hidden;
    }

    /* Fullscreen outer window */

    #lxa-play-shell {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100dvh;
      max-width: none;
      max-height: none;
      background: #071328;
      color: #fff;
      z-index: 2147483000;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin: 0;
      padding:
        env(safe-area-inset-top,0px)
        env(safe-area-inset-right,0px)
        env(safe-area-inset-bottom,0px)
        env(safe-area-inset-left,0px);
      box-sizing: border-box;
    }

    #lxa-play-shell:fullscreen {
      width: 100vw;
      height: 100dvh;
      background: #071328;
    }

    /* Small top toolbar */

    #lxa-play-shell .lxa-play-head {
      flex: 0 0 auto;
      min-height: 42px;
      background: #142f50;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 7px;
      padding: 3px 10px;
      border-bottom: 1px solid #437ea0;
      font: 800 12px system-ui,sans-serif;
    }

    #lxa-play-shell .lxa-head-actions {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    #lxa-play-shell .lxa-head-actions button {
      background: #21496f;
      border: 1px solid #84bfd3;
      color: #fff;
      font: 800 12px system-ui,sans-serif;
      min-height: 34px;
      border-radius: 9px;
      padding: 5px 12px;
      cursor: pointer;
    }

    #lxa-play-shell .lxa-head-actions button.lxa-close {
      background: #8b304e;
      border-color: #e59fae;
    }

    /* Landscape gameplay layout */

    #lxa-play-shell .lxa-play-body {
      display: flex;
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      flex-direction: row;
      align-items: stretch;
      justify-content: center;
      gap: 7px;
      padding: 5px;
    }

    #lxa-play-shell .lxa-play-stage {
      display: flex;
      flex: 1 1 auto;
      min-width: 0;
      min-height: 0;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    #lxa-play-shell
    .lxa-play-stage > .lxa-moved-game {
      position: relative !important;
      display: block !important;
      flex: none !important;
      max-width: 100% !important;
      max-height: 100% !important;
      min-width: 0 !important;
      min-height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      overflow: hidden;
    }

    #lxa-play-shell .lxa-play-stage canvas {
      display: block !important;
      max-width: none !important;
      max-height: none !important;
      width: 100% !important;
      height: 100% !important;
      aspect-ratio: auto !important;
      object-fit: fill !important;
      touch-action: none !important;
    }

    /* Touch controls on the right */

    #lxa-play-shell .lxa-play-control {
      flex: 0 0 min(29vw,250px);
      width: min(29vw,250px);
      min-width: 145px;
      min-height: 0;
      max-height: 100%;
      overflow: auto;
      overscroll-behavior: contain;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 4px;
    }

    #lxa-play-shell .lxa-play-control:empty {
      display: none;
    }

    #lxa-play-shell
    .lxa-play-control > .lxa-moved-controls {
      width: 100% !important;
      max-width: 100% !important;
      max-height: none !important;
      min-width: 0 !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 5px !important;
      padding: 5px !important;
    }

    #lxa-play-shell .lxa-play-control button {
      min-width: 48px;
      min-height: 43px;
      font-size: clamp(12px,2.2vmin,17px);
      padding: 6px 9px;
      flex-shrink: 0;
      touch-action: manipulation;
    }

    #lxa-play-shell .lxa-play-control .touch {
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 5px;
    }

    #lxa-play-shell .lxa-play-control .touch button {
      min-height: 61px;
      flex: 1;
    }

    #lxa-play-shell .lxa-play-control .dpad {
      margin: auto;
    }

    #lxa-play-shell .lxa-play-control p,
    #lxa-play-shell .lxa-play-control .help {
      display: none !important;
    }

    #lxa-play-shell .lxa-play-control select,
    #lxa-play-shell
    .lxa-play-control input[type=range] {
      max-width: 100%;
      min-height: 34px;
    }

    #lxa-play-shell .lxa-play-control label {
      max-width: 100%;
      font-size: 12px;
    }

    /* Basketball shooting pad */

    #lxa-play-shell #luxton-shot-pad {
      padding: 6px !important;
    }

    #lxa-play-shell #luxton-shot-track {
      max-width: 100% !important;
      height: 90px !important;
      touch-action: none;
    }

    /* Rotate-phone message */

    #lxa-play-shell .lxa-rotate-tip {
      display: none;
      text-align: center;
      background: #51422e;
      color: #ffe8b0;
      padding: 5px;
      font: 800 12px system-ui,sans-serif;
    }

    /* Portrait fallback */

    @media (orientation:portrait) {

      #lxa-play-shell .lxa-play-body {
        flex-direction: column;
        gap: 4px;
      }

      #lxa-play-shell .lxa-play-control {
        width: 100%;
        flex: 0 0 auto;
        max-height: 32%;
        min-width: 0;
        flex-direction: row;
        overflow: auto;
      }

      #lxa-play-shell
      .lxa-play-control > .lxa-moved-controls {
        justify-content: center !important;
      }

      #lxa-play-shell .lxa-rotate-tip {
        display: block;
      }
    }

    /* Small landscape phones */

    @media
    (max-height:450px)
    and
    (orientation:landscape) {

      #lxa-play-shell .lxa-play-head {
        min-height: 34px;
      }

      #lxa-play-shell .lxa-head-actions button {
        min-height: 29px;
        padding: 3px 8px;
      }

      #lxa-play-shell .lxa-play-control button {
        min-height: 39px;
      }
    }

    @media (prefers-reduced-motion:reduce) {
      #lxa-play-shell * {
        transition: none !important;
      }
    }
  `;

  document.head.appendChild(style);

  // =======================================
  // BLOCK ACCIDENTAL IMAGE SELECTION
  // =======================================

  for (
    const target of [area, gameCanvas].filter(Boolean)
  ) {
    target.addEventListener(
      "dragstart",
      e => e.preventDefault()
    );

    target.addEventListener(
      "contextmenu",
      e => e.preventDefault()
    );

    target.addEventListener(
      "selectstart",
      e => e.preventDefault()
    );

    target.addEventListener(
      "dblclick",
      e => e.preventDefault()
    );
  }

  // =======================================
  // CREATE FULLSCREEN BUTTON
  // =======================================

  const launch = document.createElement("div");
  launch.className = "lxa-play-launch";

  const hint = document.createElement("small");
  hint.textContent =
    "📱 Rotate sideways for bigger controls";

  const open = document.createElement("button");
  open.type = "button";

  open.textContent =
    "⛶ FULLSCREEN / LANDSCAPE";

  open.setAttribute(
    "aria-label",
    "Expand game to landscape fullscreen"
  );

  launch.append(hint, open);

  area.parentNode.insertBefore(launch, area);

  // =======================================
  // FULLSCREEN STATE
  // =======================================

  let shell = null;
  let anchors = [];
  let resizeObserver = null;
  let closeRequested = false;

  // Return game elements to their
  // original positions when exiting.

  function restore() {
    if (!shell || closeRequested) return;

    closeRequested = true;

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    for (const item of anchors.reverse()) {
      if (item.anchor.parentNode) {
        item.anchor.replaceWith(item.element);
      }

      item.element.classList.remove(item.tag);

      item.element.removeAttribute(
        "data-lxa-moved"
      );

      if (item.element === area) {
        area.style.removeProperty("width");
        area.style.removeProperty("height");
        area.style.removeProperty("max-width");
        area.style.removeProperty("max-height");
      }
    }

    anchors = [];

    shell.remove();
    shell = null;

    document.body.classList.remove(
      "lxa-play-on"
    );

    try {
      if (
        screen.orientation &&
        screen.orientation.unlock
      ) {
        screen.orientation.unlock();
      }
    } catch (e) {}

    closeRequested = false;
  }

  // Temporarily move the existing game.
  // The original game element is NOT copied
  // or recreated, so its event listeners stay.

  function moved(element, slot, tag) {
    if (!element || slot.contains(element)) {
      return;
    }

    const anchor = document.createComment(
      "Luxton play original position"
    );

    element.parentNode.insertBefore(
      anchor,
      element
    );

    element.classList.add(tag);

    element.dataset.lxaMoved = "1";

    anchors.push({
      element,
      anchor,
      tag
    });

    slot.appendChild(element);
  }

  // Keep original game proportions.
  // Don't stretch or distort the canvas.

  function layout() {
    if (!shell) return;

    const slot = shell.querySelector(
      ".lxa-play-stage"
    );

    const w = Math.max(
      1,
      slot.clientWidth - 3
    );

    const h = Math.max(
      1,
      slot.clientHeight - 3
    );

    const ratio =
      gameCanvas &&
      gameCanvas.width &&
      gameCanvas.height
        ? gameCanvas.width / gameCanvas.height
        : null;

    const aw = ratio
      ? Math.min(w, h * ratio)
      : w;

    const ah = ratio
      ? Math.min(h, aw / ratio)
      : h;

    area.style.setProperty(
      "width",
      Math.floor(aw) + "px",
      "important"
    );

    area.style.setProperty(
      "height",
      Math.floor(ah) + "px",
      "important"
    );

    area.style.setProperty(
      "max-width",
      "none",
      "important"
    );

    area.style.setProperty(
      "max-height",
      "none",
      "important"
    );
  }

  // =======================================
  // EXIT FULLSCREEN
  // =======================================

  function exit() {
    if (!shell) return;

    if (
      document.fullscreenElement === shell &&
      document.exitFullscreen
    ) {
      document.exitFullscreen()
        .catch(() => restore());

    } else if (
      document.webkitFullscreenElement &&
      document.webkitExitFullscreen
    ) {
      document.webkitExitFullscreen();

    } else {
      restore();
    }
  }

  // =======================================
  // ENTER FULLSCREEN
  // =======================================

  async function enter() {
    if (shell) return;

    shell = document.createElement("section");

    shell.id = "lxa-play-shell";

    shell.setAttribute(
      "role",
      "region"
    );

    shell.setAttribute(
      "aria-label",
      "Expanded game view"
    );

    shell.innerHTML = `
      <div class="lxa-play-head">
        <span>
          🎮 LUXTON ARCADE · BIG SCREEN
        </span>

        <div class="lxa-head-actions">
          <button
            type="button"
            class="lxa-close"
          >
            ✕ EXIT
          </button>
        </div>
      </div>

      <div class="lxa-play-body">
        <div class="lxa-play-stage"></div>
        <div class="lxa-play-control"></div>
      </div>

      <div class="lxa-rotate-tip">
        ↻ Rotate your phone sideways
        for a bigger game
      </div>
    `;

    document.body.appendChild(shell);

    document.body.classList.add(
      "lxa-play-on"
    );

    const stage = shell.querySelector(
      ".lxa-play-stage"
    );

    const controlsSlot = shell.querySelector(
      ".lxa-play-control"
    );

    let controls = config.controls
      ? document.querySelector(config.controls)
      : null;

    // If controls are already inside the game,
    // leave them there.

    if (
      controls &&
      area.contains(controls)
    ) {
      controls = null;
    }

    moved(
      area,
      stage,
      "lxa-moved-game"
    );

    if (controls) {
      moved(
        controls,
        controlsSlot,
        "lxa-moved-controls"
      );
    }

    shell.querySelector(".lxa-close")
      .addEventListener(
        "click",
        exit
      );

    // Keep layout responsive after rotation.

    resizeObserver =
      typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(layout)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(stage);
      resizeObserver.observe(shell);
    }

    layout();

    // Request native fullscreen when supported.
    // iPhone Safari may reject this request;
    // the expanded layout still works as a fallback.

    try {
      if (
        typeof shell.requestFullscreen ===
        "function"
      ) {
        await shell.requestFullscreen();

      } else if (
        typeof shell.webkitRequestFullscreen ===
        "function"
      ) {
        await shell.webkitRequestFullscreen();
      }

      // Try landscape orientation lock.

      if (
        screen.orientation &&
        typeof screen.orientation.lock ===
        "function" &&
        document.fullscreenElement
      ) {
        try {
          await screen.orientation.lock(
            "landscape"
          );
        } catch (e) {}
      }

    } catch (e) {
      // Keep expanded mode if native fullscreen
      // is blocked by the browser.
    }

    layout();
  }

  // =======================================
  // EVENTS
  // =======================================

  open.addEventListener(
    "click",
    enter
  );

  document.addEventListener(
    "fullscreenchange",
    () => {
      if (
        shell &&
        !document.fullscreenElement
      ) {
        restore();
      } else {
        layout();
      }
    }
  );

  document.addEventListener(
    "webkitfullscreenchange",
    () => {
      if (
        shell &&
        !document.webkitFullscreenElement &&
        !document.fullscreenElement
      ) {
        restore();
      } else {
        layout();
      }
    }
  );

  window.addEventListener(
    "resize",
    layout
  );

  window.addEventListener(
    "orientationchange",
    layout
  );

  window.addEventListener(
    "keydown",
    e => {
      if (
        e.key === "Escape" &&
        shell &&
        !document.fullscreenElement
      ) {
        exit();
      }
    }
  );

})();
