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

  /* ===============================
     LOAD ZIP DATA (zip-index.json)
  =============================== */
  fetch("/zip-index.json")
    .then(res => res.json())
    .then(data => {
      ZIP_INDEX = data;
      console.log("ZIP index loaded");
    })
    .catch(err => {
      console.error("ZIP data failed to load", err);
    });

  /* ===============================
     SCREEN NAVIGATION
  =============================== */
  function showScreen(index) {
    screens.forEach((s, i) => {
      s.style.display = i === index ? "block" : "none";
    });
    current = index;
  }

  showScreen(0);

  function next() {
    if (current < screens.length - 1) {
      showScreen(current + 1);
    }
  }

  /* ===============================
     BUTTON HANDLERS
  =============================== */
  document.querySelectorAll("[data-move-type]").forEach(btn => {
    btn.onclick = () => {
      state.moveType = btn.dataset.moveType;
      next();
    };
  });

  document.querySelectorAll("[data-home-size]").forEach(btn => {
    btn.onclick = () => {
      state.homeSize = btn.dataset.homeSize;
      next();
    };
  });

  const dateInput = document.getElementById("moveDate");
  if (dateInput) {
    dateInput.onchange = () => {
      state.moveDate = dateInput.value;
      next();
    };
  }

  /* ===============================
     ZIP AUTOCOMPLETE
  =============================== */
  function setupZipAutocomplete(inputEl, resultsEl, onSelect) {
    inputEl.addEventListener("input", () => {
      const value = inputEl.value.trim();

      resultsEl.innerHTML = "";
      resultsEl.style.display = "none";

      if (!ZIP_INDEX || value.length < 2) return;

      const key = value.slice(0, 2);
      const matches = ZIP_INDEX[key] || [];

      if (!matches.length) return;

      resultsEl.style.display = "block";

      matches.slice(0, 10).forEach(item => {
        const div = document.createElement("div");
        div.className = "zip-option";
        div.textContent = `${item.city}, ${item.state}`;

        div.onclick = () => {
          inputEl.value = `${item.city}, ${item.state}`;
          resultsEl.innerHTML = "";
          resultsEl.style.display = "none";
          onSelect(`${item.city}, ${item.state}`);
        };

        resultsEl.appendChild(div);
      });
    });
  }

  const fromInput = document.getElementById("fromZip");
  const fromResults = document.getElementById("fromZipResults");
  const toInput = document.getElementById("toZip");
  const toResults = document.getElementById("toZipResults");

  if (fromInput && fromResults) {
    setupZipAutocomplete(fromInput, fromResults, value => {
      state.from = value;
      next();
    });
  }

  if (toInput && toResults) {
    setupZipAutocomplete(toInput, toResults, value => {
      state.to = value;
      next();
    });
  }

  /* ===============================
     NAME + PHONE
  =============================== */
  const nameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phoneNumber");

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim().length > 2) {
        state.name = nameInput.value.trim();
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      if (phoneInput.value.trim().length >= 10) {
        state.phone = phoneInput.value.trim();
      }
    });
  }

  const submitBtn = document.getElementById("submitQuote");
  if (submitBtn) {
    submitBtn.onclick = () => {
      next(); // loading screen next
    };
  }
});
