document.addEventListener("DOMContentLoaded", () => {

  let current = 0;
  const screens = document.querySelectorAll(".screen");

  const state = {
    moveType: "",
    homeSize: "",
    moveDate: "",
    from: "",
    to: ""
  };

  let ZIP_INDEX = null;

  /* =========================
     LOAD ZIP DATA (OPTION B)
  ========================= */
  fetch("zip-index.json")
    .then(res => res.json())
    .then(data => {
      ZIP_INDEX = data;
    })
    .catch(err => {
      console.error("ZIP data failed to load", err);
    });

  /* =========================
     SCREEN CONTROL
  ========================= */
  function show(i){
    screens.forEach(s => s.classList.remove("active"));
    screens[i].classList.add("active");
  }

  function next(){
    current++;
    if (screens[current].classList.contains("loading")) {
      runLoading();
    } else {
      show(current);
    }
  }

  /* =========================
     MOVE TYPE
  ========================= */
  document.querySelectorAll("[data-move]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.moveType = btn.dataset.move;
      next();
    });
  });

  /* =========================
     HOME SIZE
  ========================= */
  document.querySelectorAll("[data-size]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.homeSize = btn.dataset.size;
      next();
    });
  });

  /* =========================
     MOVE DATE
  ========================= */
  document.getElementById("dateNext").addEventListener("click", () => {
    const d = document.getElementById("moveDate").value;
    if (!d) return;
    state.moveDate = d;
    next();
  });

  /* =========================
     ZIP AUTOCOMPLETE
  ========================= */
  function zipSearch(val, type){
    const box = document.getElementById(type + "Results");
    box.innerHTML = "";

    if (!ZIP_INDEX || val.length < 2) return;

    const key = val.slice(0,2);
    const list = ZIP_INDEX[key] || [];

    list.slice(0,6).forEach(item => {
      const div = document.createElement("div");
      div.className = "result";
      div.textContent = `${item.city}, ${item.state}`;
      div.onclick = () => selectZip(type, item);
      box.appendChild(div);
    });
  }

  function selectZip(type, item){
    const label = `${item.city}, ${item.state}`;

    if(type === "from"){
      state.from = label;
      enable("fromNext");
    }

    if(type === "to"){
      state.to = label;
      enable("toNext");
    }
  }

  function enable(id){
    const btn = document.getElementById(id);
    btn.disabled = false;
    btn.classList.remove("disabled");
  }

  document.getElementById("fromZip").addEventListener("input", e => {
    zipSearch(e.target.value, "from");
  });

  document.getElementById("toZip").addEventListener("input", e => {
    zipSearch(e.target.value, "to");
  });

  document.getElementById("fromNext").addEventListener("click", next);
  document.getElementById("toNext").addEventListener("click", next);

  /* =========================
     LOADING SCREEN
  ========================= */
  function runLoading(){
    const text = document.getElementById("loadingText");
    let percent = 0;

    const messages = [
      "Thank you! One moment please…",
      "Connecting you to movers in your area…",
      "Locating licensed movers near you…",
      `Finding available movers servicing ${state.from} → ${state.to}`,
      "Finalizing availability…"
    ];

    show(current);

    const interval = setInterval(() => {
      percent++;

      if (percent < 25) text.innerText = messages[0];
      else if (percent < 45) text.innerText = messages[1];
      else if (percent < 65) text.innerText = messages[2];
      else if (percent < 85) text.innerText = messages[3];
      else text.innerText = messages[4];

      if (percent >= 100) {
        clearInterval(interval);
        next();
      }
    }, 30);
  }

  /* =========================
     NAME + PHONE
  ========================= */
  document.getElementById("nameNext").addEventListener("click", next);
  document.getElementById("phoneNext").addEventListener("click", next);

  /* =========================
     INIT
  ========================= */
  show(current);

});
