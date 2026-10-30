// Signalling simulator (lesson 23): drive a train behind another one along a line of blocks.
// Simplified fixed-block model: a signal at the entry of each block shows red, yellow or green.

(function () {
  var root = document.querySelector("[data-sim]");
  if (!root) {
    return;
  }

  var BLOCKS = 5;
  var TRAIN_LENGTH = 0.5; // in blocks
  var FAST = 0.8; // blocks per second
  var SLOW = 0.3;
  var ACCELERATION = 0.4;
  var SERVICE_DECELERATION = 0.4;
  var BRAKE_DECELERATION = 0.7;
  var LEAD_SPEED = 0.35;
  var LEAD_RUN_TIME = 3; // seconds moving, then stopped for LEAD_STOP_TIME
  var LEAD_STOP_TIME = 4;

  var ASPECT_HINT = {
    green: "Proceed.",
    yellow: "Caution: prepare to stop at the next signal.",
    red: "Stop before the signal."
  };
  var ASPECT_WORD = { green: "Green", yellow: "Yellow", red: "Red" };

  var lamps = root.querySelectorAll(".sim-lamp");
  var words = root.querySelectorAll(".sim-aspect");
  var youEl = root.querySelector("[data-you]");
  var leadEl = root.querySelector("[data-lead]");
  var speedEl = root.querySelector("[data-speed]");
  var nextEl = root.querySelector("[data-next]");
  var timeEl = root.querySelector("[data-time]");
  var redEl = root.querySelector("[data-red-count]");
  var messageEl = root.querySelector("[data-message]");
  var buttons = {
    fast: root.querySelector("[data-set=fast]"),
    slow: root.querySelector("[data-set=slow]"),
    brake: root.querySelector("[data-set=brake]")
  };
  var restartButton = root.querySelector("[data-restart]");

  var state;
  var aspects = [];
  var shown = false;
  var lastFrame = null;
  var frameRequest = null;
  var lastNext = "";

  function reset() {
    state = {
      you: 0.5, // front of your train, in blocks from the start of the line
      speed: 0,
      target: "brake",
      lead: 2.5, // front of Train 1, or null once it has left the line
      leadClock: 0,
      started: false,
      over: false,
      time: 0,
      redPassed: 0
    };
    lastNext = "";
    setMessage("Press Go to start. Train 1 is ahead of you.");
    setControlsDisabled(false);
    render();
  }

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function setControlsDisabled(disabled) {
    Object.keys(buttons).forEach(function (key) {
      buttons[key].disabled = disabled;
    });
  }

  // Is any part of Train 1 inside block i?
  function leadInBlock(i) {
    if (state.lead === null) {
      return false;
    }
    return state.lead - TRAIN_LENGTH < i + 1 && state.lead > i;
  }

  // Red if the block is occupied, yellow if the next block is, otherwise green.
  function computeAspects() {
    aspects = [];
    for (var i = 0; i < BLOCKS; i++) {
      if (leadInBlock(i)) {
        aspects.push("red");
      } else if (i + 1 < BLOCKS && leadInBlock(i + 1)) {
        aspects.push("yellow");
      } else {
        aspects.push("green");
      }
    }
  }

  function updateLead(dt) {
    if (state.lead === null) {
      return;
    }
    state.leadClock = (state.leadClock + dt) % (LEAD_RUN_TIME + LEAD_STOP_TIME);
    if (state.leadClock < LEAD_RUN_TIME) {
      state.lead += LEAD_SPEED * dt;
    }
    if (state.lead - TRAIN_LENGTH >= BLOCKS) {
      state.lead = null;
    }
  }

  function updateYou(dt) {
    var goal = state.target === "fast" ? FAST : state.target === "slow" ? SLOW : 0;
    if (state.speed < goal) {
      state.speed = Math.min(goal, state.speed + ACCELERATION * dt);
    } else if (state.speed > goal) {
      var rate = state.target === "brake" ? BRAKE_DECELERATION : SERVICE_DECELERATION;
      state.speed = Math.max(goal, state.speed - rate * dt);
    }
    var before = state.you;
    state.you += state.speed * dt;

    // Entering a block whose signal is red counts as passing a red signal.
    for (var k = 1; k < BLOCKS; k++) {
      if (before < k && state.you >= k && aspects[k] === "red") {
        state.redPassed++;
        setMessage("You passed a red signal. A real driver must stop before it.");
      }
    }
  }

  function checkEnd() {
    if (state.lead !== null && state.you >= state.lead - TRAIN_LENGTH) {
      finish("Collision: you ran into Train 1. Stopping at red signals prevents this.");
    } else if (state.you >= BLOCKS) {
      var summary = "You reached the end of the line in " + Math.round(state.time) + " s. Red signals passed: " + state.redPassed + ". ";
      summary += state.redPassed === 0 ? "Well done: you stopped at every red signal." : "Try again and stop at every red signal.";
      finish(summary);
    }
  }

  function finish(text) {
    state.over = true;
    state.speed = 0;
    setMessage(text);
    setControlsDisabled(true);
  }

  function step(dt) {
    if (!state.started || state.over) {
      return;
    }
    state.time += dt;
    computeAspects();
    updateLead(dt);
    computeAspects();
    updateYou(dt);
    computeAspects();
    checkEnd();
  }

  function percent(value) {
    return (value / BLOCKS) * 100 + "%";
  }

  function placeTrain(el, front) {
    if (front === null) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.style.left = percent(front - TRAIN_LENGTH);
    el.style.width = percent(TRAIN_LENGTH);
  }

  function render() {
    computeAspects();
    for (var i = 0; i < BLOCKS; i++) {
      lamps[i].className = "sim-lamp lamp-" + aspects[i];
      words[i].textContent = ASPECT_WORD[aspects[i]];
    }
    placeTrain(youEl, state.you);
    placeTrain(leadEl, state.lead);

    speedEl.textContent = state.speed < 0.02 ? "Stopped" : state.speed < 0.5 ? "Slow" : "Fast";
    timeEl.textContent = Math.round(state.time) + " s";
    redEl.textContent = state.redPassed;

    var nextBlock = Math.floor(state.you) + 1;
    var nextText = nextBlock < BLOCKS ? ASPECT_WORD[aspects[nextBlock]] + ". " + ASPECT_HINT[aspects[nextBlock]] : "End of the line ahead.";
    if (nextText !== lastNext) {
      nextEl.textContent = nextText;
      if (state.started && !state.over && nextBlock < BLOCKS) {
        setMessage("Next signal is now " + ASPECT_WORD[aspects[nextBlock]] + ". " + ASPECT_HINT[aspects[nextBlock]]);
      }
      lastNext = nextText;
    }

    Object.keys(buttons).forEach(function (key) {
      buttons[key].setAttribute("aria-pressed", String(state.target === key));
    });
  }

  function frame(now) {
    frameRequest = null;
    if (!shown) {
      return;
    }
    if (lastFrame !== null) {
      step(Math.min((now - lastFrame) / 1000, 0.1));
    }
    lastFrame = now;
    render();
    frameRequest = requestAnimationFrame(frame);
  }

  function resume() {
    lastFrame = null;
    if (frameRequest === null) {
      frameRequest = requestAnimationFrame(frame);
    }
  }

  Object.keys(buttons).forEach(function (key) {
    buttons[key].addEventListener("click", function () {
      if (state.over) {
        return;
      }
      if (!state.started) {
        state.started = true;
        setMessage("Train 1 is moving. Watch the signals ahead of you.");
      }
      state.target = key;
      render();
    });
  });

  restartButton.addEventListener("click", reset);

  // script.js tells us which lesson is showing; the animation only runs while this one is.
  window.addEventListener("lessonshown", function (event) {
    shown = event.detail === root.closest(".lesson").id;
    if (shown) {
      resume();
    }
  });

  reset();
})();
