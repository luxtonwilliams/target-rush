
/* LUXTON ARCADE — MOBILE CONTROLS */
(() => {
  "use strict";

  // This matches the device choice on your homepage.
  const KEY = "luxton_arcade_device_choice_v1";
  let device = null;

  try {
    device = localStorage.getItem(KEY);
  } catch (error) {}

  // People who visit a game directly get an automatic default.
  if (device !== "mobile" && device !== "pc") {
    device = matchMedia("(pointer: coarse)").matches
      ? "mobile"
      : "pc";
  }

  // Do not change desktop gameplay.
  if (device !== "mobile") return;

  const path = location.pathname.toLowerCase();

  // Shared mobile styling.
  const style = document.createElement("style");
  style.textContent = `
    html {
      -webkit-text-size-adjust: 100%;
    }

    body {
      overflow-x: hidden;
      padding-bottom: env(safe-area-inset-bottom);
    }

    button, a {
      touch-action: manipulation;
    }

    button {
      min-height: 48px;
    }

    .stats {
      gap: 6px !important;
    }

    .arena, .game {
      max-width: 100%;
    }

    canvas {
      display: block;
      max-width: 100%;
      touch-action: none;
    }

    /* Bigger Target Rush tap area */
    #target {
      transform: translate(-50%, -50%) scale(1.32) !important;
      touch-action: manipulation;
    }

    /* Bike Rush touch buttons */
    .ride-controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      margin: 14px 0;
    }

    .ride-controls button {
      min-height: 64px;
      min-width: 130px;
      flex: 1 1 130px;
      max-width: 260px;
      font-size: 19px;
    }

    #luxton-jump {
      background: linear-gradient(100deg,#ffbb4e,#ff6b72);
      color: #211124;
      box-shadow: 0 5px 0 #9b422e;
    }

    /* Basketball Rush shooting pad */
    #luxton-shot-pad {
      max-width: 780px;
      margin: 12px auto 16px;
      border: 2px solid #6ae8ff;
      border-radius: 16px;
      padding: 12px 16px 18px;
      background: linear-gradient(130deg,#172e59,#201b50);
      color: white;
      text-align: center;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
      box-shadow: 0 0 20px #04dfff2b;
    }

    #luxton-shot-pad b {
      display: block;
      font: 800 16px system-ui,sans-serif;
    }

    #luxton-shot-pad small {
      display: block;
      font: 13px system-ui,sans-serif;
      color: #b8d6f4;
      margin: 5px 0 10px;
    }

    #luxton-shot-track {
      height: 66px;
      max-width: 420px;
      margin: auto;
      border: 1px dashed #75b5e0;
      border-radius: 12px;
      position: relative;
      background: linear-gradient(90deg,#101a3b,#254a78,#101a3b);
    }

    #luxton-shot-marker {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      font-size: 29px;
      pointer-events: none;
    }

    @media(max-width:500px) {
      .stat {
        padding: 8px 2px !important;
      }

      #target {
        transform: translate(-50%, -50%) scale(1.38) !important;
      }

      #luxton-shot-pad {
        margin: 8px auto 12px;
        padding: 10px 12px 13px;
      }

      #luxton-shot-track {
        height: 72px;
      }
    }
  `;

  document.head.appendChild(style);

  // TARGET RUSH:
  // The larger tap area is handled by CSS above.
  // Its scoring, combos, timer, and best score stay unchanged.
  if (path.includes("/target-rush/")) {
    return;
  }

  // BIKE RUSH:
  // Reuse the game's existing canvas-tap jump action.
  if (path.includes("/bike-rush/")) {
    const controls = document.querySelector(".ride-controls");
    const canvas = document.getElementById("game");
    const overlay = document.getElementById("overlay");

    if (!controls || !canvas || !overlay) return;

    const jump = document.createElement("button");
    jump.id = "luxton-jump";
    jump.type = "button";
    jump.textContent = "⬆️ JUMP";
    jump.setAttribute("aria-label", "Jump or double jump");
    jump.hidden = true;

    controls.appendChild(jump);

    jump.addEventListener("click", () => {
      canvas.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          pointerId: -71,
          pointerType: "touch",
          isPrimary: true
        })
      );
    });

    // Only show JUMP during gameplay.
    const sync = () => {
      jump.hidden = !overlay.classList.contains("hidden");
    };

    new MutationObserver(sync).observe(overlay, {
      attributes: true,
      attributeFilter: ["class"]
    });

    sync();
    return;
  }

  // BASKETBALL RUSH:
  // Add an easier-to-reach shooting area.
  // Shots still depend on swipe direction and timing.
  if (path.includes("/basketball-rush/")) {
    const arena = document.querySelector(".arena");
    const canvas = document.getElementById("game");
    const overlay = document.getElementById("overlay");

    if (!arena || !canvas || !overlay) return;

    const pad = document.createElement("div");
    pad.id = "luxton-shot-pad";

    pad.innerHTML = `
      <b>📱 SWIPE HERE TO SHOOT</b>
      <small>Swipe up and angle toward where the hoop is going</small>
      <div id="luxton-shot-track">
        <span id="luxton-shot-marker">🏀</span>
      </div>
    `;

    arena.insertAdjacentElement("afterend", pad);

    const marker = pad.querySelector("#luxton-shot-marker");
    let start = null;

    // Only show the touch pad while playing.
    const sync = () => {
      pad.hidden = !overlay.classList.contains("hidden");
    };

    new MutationObserver(sync).observe(overlay, {
      attributes: true,
      attributeFilter: ["class"]
    });

    sync();

    pad.addEventListener("pointerdown", event => {
      if (!overlay.classList.contains("hidden") || start) return;

      start = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY
      };

      pad.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    pad.addEventListener("pointermove", event => {
      if (!start || event.pointerId !== start.id) return;

      const dx = Math.max(
        -95, Math.min(95, event.clientX - start.x)
      );

      const dy = Math.max(
        -35, Math.min(35, event.clientY - start.y)
      );

      marker.style.transform =
        "translate(calc(-50% + " + dx +
        "px),calc(-50% + " + dy + "px))";

      event.preventDefault();
    });

    function reset() {
      start = null;
      marker.style.transform = "translate(-50%,-50%)";
    }

    pad.addEventListener("pointercancel", reset);

    pad.addEventListener("pointerup", event => {
      if (!start || event.pointerId !== start.id) return;

      const deltaX = event.clientX - start.x;
      const upward = start.y - event.clientY;

      reset();

      if (
        upward < 20 ||
        !overlay.classList.contains("hidden")
      ) return;

      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      // Turn phone swipes into the same coordinates
      // the game normally receives from the canvas.
      const dx =
        deltaX * (960 / rect.width) * 0.65;

      // Shorter upward swipes are comfortable on phones.
      const up = Math.max(
        45,
        Math.min(270, 145 + (upward - 65) * 0.70)
      );

      const baseX =
        rect.left + rect.width * 480 / 960;

      const baseY =
        rect.top + rect.height * 445 / 540;

      const endX =
        baseX + dx * rect.width / 960;

      const endY =
        baseY - up * rect.height / 540;

      // Send the swipe into the original shooting system.
      // No automatic tracking of the moving hoop.
      const syntheticId = -72;
      const capture = canvas.setPointerCapture;

      canvas.setPointerCapture = function(id) {
        if (id === syntheticId) return;
        return capture.call(this, id);
      };

      const eventFor = (type, x, y) =>
        new PointerEvent(type, {
          bubbles: true,
          cancelable: true,
          pointerId: syntheticId,
          pointerType: "touch",
          isPrimary: true,
          clientX: x,
          clientY: y
        });

      try {
        canvas.dispatchEvent(
          eventFor("pointerdown", baseX, baseY)
        );

        canvas.dispatchEvent(
          eventFor("pointerup", endX, endY)
        );
      } finally {
        canvas.setPointerCapture = capture;
      }

      event.preventDefault();
    });
  }
})();
