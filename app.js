document.addEventListener("DOMContentLoaded", () => {
  let current = 0;
  const screens = document.querySelectorAll(".screen");

  const state = {
    moveType: "",
    homeSize: "",
    moveDate: "",
    from: "",
    to: "",
    name: "",
    phone: ""
  };

  let ZIP_INDEX = null;

  /* ======================
     LOAD ZIP INDEX
  ====================== */
  fetch("zip-index.json")
    .then(res => res.json())
    .then(data => ZIP_INDEX = data)
    .catch(err => console.error("ZIP index failed", err));

  function showScreen(i) {
    screens.forEach((s, idx) => s.classList.toggle("active", idx === i));
  }

  function next() {
    if (current < screens.length - 1) {
      current++;
      showScreen(current);
    }
  }

  function setupButtons(selector, key) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.onclick = () => {
        state[key] = btn.dataset.value;
        next();
      };
    });
  }

  /* ======================
     BUTTON SETUPS
  ====================== */
  setupButtons("[data-move-type]", "moveType");
  setupButtons("[data-home-size]", "homeSize");

  document.getElementById("moveDate").onchange = e => {
    state.moveDate = e.target.value;
    next();
  };

  /* ======================
     ZIP AUTOCOMPLETE
  ====================== */
  function zipAutocomplete(input, results, setter) {
    input.addEventListener("input", () => {
      const val = input.value.trim();
      results.innerHTML = "";
      results.style.display = "none";

      if (!ZIP_INDEX || val.length < 2) return;

      const key = val.slice(0, 2);
      const matches = ZIP_INDEX[key] || [];
      if (!matches.length) return;

      results.style.display = "block";

      matches.slice(0, 10).forEach(item => {
        const div = document.createElement("div");
        div.className = "zip-option";
        div.textContent = `${item.city}, ${item.state}`;
        div.onclick = () => {
          input.value = `${item.city}, ${item.state}`;
          results.style.display = "none";
          setter(input.value);
          next();
        };
        results.appendChild(div);
      });
    });
  }

  zipAutocomplete(
    document.getElementById("fromZip"),
    document.getElementById("fromZipResults"),
    v => state.from = v
  );

  zipAutocomplete(
    document.getElementById("toZip"),
    document.getElementById("toZipResults"),
    v => state.to = v
  );

  /* ======================
     LOADING SCREEN
  ====================== */
  const loadingMsgs = [
    "Thank you…",
    "One moment please…",
    "Connecting you to movers…",
    "Movers located…",
    "Finalizing availability…"
  ];

  let progress = 0;
  const bar = document.getElementById("progressBar");
  const msg = document.getElementById("loadingText");

  function startLoading() {
    current++;
    showScreen(current);

    const interval = setInterval(() => {
      progress += 2;
      bar.style.width = progress + "%";
      msg.textContent = loadingMsgs[Math.floor(progress / 20)] || "Almost done…";

      if (progress >= 100) {
        clearInterval(interval);
        next();
      }
    }, 80);
  }

  document.getElementById("startLoading").onclick = startLoading;

  /* ======================
     LEAD SUBMIT
  ====================== */
  document.getElementById("leadForm").onsubmit = e => {
    e.preventDefault();
    state.name = document.getElementById("name").value;
    state.phone = document.getElementById("phone").value;
    next();
    console.log("LEAD DATA:", state);
  };

  showScreen(current);
});
