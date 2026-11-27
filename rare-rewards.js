
/*
  LUXTON ARCADE — RARE REWARD CODES

  24 codes that unlock equipment, vehicles,
  pets, special items, and abilities.

  No Crab Rush codes. No coin-only rewards.
  No changes to existing game logic or saves.
*/

(() => {
  "use strict";

  if (window.__luxtonRareRewards) return;
  window.__luxtonRareRewards = true;

  const KEY = "luxton_arcade_codes_v1";
  const FLASH = "luxton_rare_rewards_flash";

  // ORIGINAL GAME SAVE KEYS
  const SAVE_KEYS = {
        zombie: "zombie_rush_v1",
    bike: "luxton_bike_rush_v1",
    space: "luxton_space_rush_v1",
    castle: "luxton_castle_rush_v2",
    basketball: "luxton_basketball_rush_v1",
    fishing: "luxton_fishing_rush_v1",
    golf: "luxton_golf_rush_v1",
    mining: "luxton_mining_rush_v1"
  };

  // ======================================
  // 🎟️ YOUR NEW SECRET CODES
  // ======================================
  //
  // add = permanently unlock an item
  // set = automatically equip an item
  //
  // You can edit the code names later.
  // ======================================

  const CODES = {
    NIGHTARMOR: {
      game: "zombie",
      label: "🛡 Night Armor + Starting Shield",
      set: {
        nightArmor: true
      }
    },

    ZAPCORE: {
      game: "zombie",
      label: "⚡ Supercharged Pulse Core",
      set: {
        zapCore: true
      }
    },
    // 🚴 BIKE RUSH

    PRISMRIDER: {
      game: "bike",
      label: "🌈 Prism Bike",
      add: {
        owned: ["rainbow"]
      },
      set: {
        selected: "rainbow"
      }
    },

    STARHELMET: {
      game: "bike",
      label: "⭐ Star Rider Head",
      add: {
        ownedHeads: ["star"]
      },
      set: {
        selectedHead: "star"
      }
    },

    SOLARBIKE: {
      game: "bike",
      label: "🔥 Solar Orange Bike",
      add: {
        owned: ["fire"]
      },
      set: {
        selected: "fire"
      }
    },

    // 🚀 SPACE RUSH

    ALIENPILOT: {
      game: "space",
      label: "👽 Secret Alien Explorer Ship",
      add: {
        owned: ["alien"]
      },
      set: {
        equipped: "alien"
      }
    },

    GALAXYACE: {
      game: "space",
      label: "🌠 Galaxy X Spaceship",
      add: {
        owned: ["galaxy"]
      },
      set: {
        equipped: "galaxy"
      }
    },

    HYPERENGINE: {
      game: "space",
      label: "⚡ Hyperdrive + Power Cell",
      add: {
        modules: [
          "engine",
          "battery"
        ]
      }
    },

    LASERLAB: {
      game: "space",
      label: "✨ Star Amplifier",
      add: {
        modules: ["laser"]
      }
    },

    // 🏰 CASTLE RUSH

    CRYSTALCANNON: {
      game: "castle",
      label: "💎 Piercing Cannonball",
      add: {
        owned: ["pierce"]
      }
    },

    FROSTFORT: {
      game: "castle",
      label: "❄️ Frost Shot + Castle Shield",
      add: {
        owned: [
          "frost",
          "shield"
        ]
      }
    },

    IRONFORT: {
      game: "castle",
      label: "🧱 Reinforced Castle Walls",
      add: {
        owned: ["walls"]
      }
    },

    // 🏀 BASKETBALL RUSH

    COSMICDUNK: {
      game: "basketball",
      label: "🌌 Cosmic Basketball",
      add: {
        owned: ["cosmic"]
      },
      set: {
        equipped: "cosmic"
      }
    },

    FLAMEHOOPS: {
      game: "basketball",
      label: "🔥 Fire Basketball",
      add: {
        owned: ["fire"]
      },
      set: {
        equipped: "fire"
      }
    },

    // 🎣 FISHING RUSH

    CRYSTALROD: {
      game: "fishing",
      label: "💎 Crystal Fishing Rod",
      add: {
        owned: ["crystal"]
      },
      set: {
        activeRod: "crystal"
      }
    },

    SAILAWAY: {
      game: "fishing",
      label: "⛵ Little Sailboat",
      add: {
        owned: ["sailboat"]
      },
      set: {
        activeBoat: "sailboat"
      }
    },

    LEGENDLURE: {
      game: "fishing",
      label: "🍀 Legendary Lure + Lucky Bait",
      add: {
        owned: [
          "lure",
          "bait"
        ]
      }
    },

    MOONLAGOON: {
      game: "fishing",
      label: "🌙 Moonlight Lagoon Destination",
      add: {
        unlockedPlaces: ["lagoon"]
      },
      set: {
        currentPlace: "lagoon"
      }
    },

    // ⛳ GOLF RUSH

    METEORPUTT: {
      game: "golf",
      label: "☄️ Meteor Pro Golf Ball",
      add: {
        owned: ["meteor"]
      },
      set: {
        equipped: "meteor"
      }
    },

    RAINBOWPUTT: {
      game: "golf",
      label: "🌈 Rainbow Legend Ball",
      add: {
        owned: ["rainbow"]
      },
      set: {
        equipped: "rainbow"
      }
    },

    PROGOLF: {
      game: "golf",
      label: "🎯 Pro Aim Line + Power Putter",
      add: {
        upgrades: [
          "aim",
          "putter"
        ]
      }
    },

    HAZARDSAFE: {
      game: "golf",
      label: "🛟 Hazard Insurance Upgrade",
      add: {
        upgrades: ["shield"]
      }
    },

    // ⛏️ MINING RUSH

    ROBOPET: {
      game: "mining",
      label: "🤖 Robo-Miner Pet",
      add: {
        owned: ["petRobot"]
      },
      set: {
        activePet: "petRobot"
      }
    },

    GEMMOLE: {
      game: "mining",
      label: "🐾 Gem Mole Pet",
      add: {
        owned: ["petMole"]
      },
      set: {
        activePet: "petMole"
      }
    },

    MEGADRILL: {
      game: "mining",
      label: "⚡ Mega Drill",
      add: {
        owned: ["megaDrill"]
      }
    },

    VAULTVISION: {
      game: "mining",
      label: "🗺️ Vault Detector + Treasure Compass",
      add: {
        owned: [
          "roomRadar",
          "compass"
        ]
      }
    }

  };

  // ======================================
  // FIND THE EXISTING HOMEPAGE CODE BOX
  // ======================================

  const form = document.getElementById(
    "codeForm"
  );

  const input = document.getElementById(
    "codeInput"
  );

  const message = document.getElementById(
    "codeStatus"
  );

  if (!form || !input || !message) {
    return;
  }

  // ======================================
  // READ SAVED DATA WITHOUT RESETTING IT
  // ======================================

  function parseObject(raw) {
    try {
      const result = JSON.parse(raw);

      if (
        result &&
        typeof result === "object" &&
        !Array.isArray(result)
      ) {
        return result;
      }

      return {};
    } catch (error) {
      return {};
    }
  }

  function notify(text, bad = false) {
    message.textContent = text;
    message.classList.toggle(
      "bad",
      bad
    );
  }

  // Restore success messages after refresh.
  try {
    const flash = sessionStorage.getItem(
      FLASH
    );

    if (flash) {
      sessionStorage.removeItem(FLASH);
      notify(flash);
    }
  } catch (error) {}

  // ======================================
  // REDEEM A NEW RARE REWARD
  // ======================================

  form.addEventListener(
    "submit",
    event => {

      const code = input.value
        .toUpperCase()
        .replace(/\s+/g, "")
        .trim();

      // Only intercept the NEW reward codes.
      // Your existing codes work normally.

      if (
        !Object.prototype.hasOwnProperty.call(
          CODES,
          code
        )
      ) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const reward = CODES[code];
      const gameKey = SAVE_KEYS[reward.game];

      if (!gameKey) {
        notify(
          "⚠️ This code isn't configured for a game.",
          true
        );
        return;
      }

      let beforeGame = null;
      let gameWritten = false;

      try {

        // =================================
        // CHECK IF CODE WAS USED BEFORE
        // =================================

        const beforeCodes =
          localStorage.getItem(KEY);

        const redeemed = parseObject(
          beforeCodes
        );

        if (
          Object.prototype.hasOwnProperty.call(
            redeemed,
            code
          )
        ) {
          notify(
            "✅ You already redeemed that code!"
          );
          return;
        }

        // =================================
        // LOAD THE PLAYER'S CURRENT SAVE
        // =================================

        beforeGame = localStorage.getItem(
          gameKey
        );

        const game = parseObject(
          beforeGame
        );

        // =================================
        // ADD THE UNLOCKED ITEMS
        // =================================

        for (
          const [field, ids]
          of Object.entries(reward.add || {})
        ) {

          const list = Array.isArray(game[field])
            ? [...game[field]]
            : [];

          for (const id of ids) {
            if (!list.includes(id)) {
              list.push(id);
            }
          }

          game[field] = list;
        }

        // =================================
        // EQUIP THE REWARD IF APPLICABLE
        // =================================

        for (
          const [field, value]
          of Object.entries(reward.set || {})
        ) {
          game[field] = value;
        }

        // =================================
        // SAVE THE UNLOCKED REWARD
        // =================================

        localStorage.setItem(
          gameKey,
          JSON.stringify(game)
        );

        gameWritten = true;

        // =================================
        // MARK THE CODE AS REDEEMED
        // =================================

        redeemed[code] = {
          label: reward.label,
          when: Date.now()
        };

        localStorage.setItem(
          KEY,
          JSON.stringify(redeemed)
        );

        // =================================
        // DISPLAY SUCCESS MESSAGE
        // =================================

        const success =
          "🎉 UNLOCKED: " +
          reward.label +
          "! Open the game to use it.";

        notify(success);

        input.value = "";

        // Refresh to update your original
        // arcade trophies, XP, and code count.

        try {
          sessionStorage.setItem(
            FLASH,
            success
          );
        } catch (error) {}

        window.setTimeout(
          () => location.reload(),
          450
        );

      } catch (error) {

        // If saving code history fails,
        // roll back the game save change.

        if (gameWritten) {
          try {
            if (beforeGame === null) {
              localStorage.removeItem(
                gameKey
              );
            } else {
              localStorage.setItem(
                gameKey,
                beforeGame
              );
            }
          } catch (error) {}
        }

        notify(
          "⚠️ Could not save the reward. " +
          "Check your browser storage.",
          true
        );
      }
    },
    true
  );

})();
