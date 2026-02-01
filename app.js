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

  /* -------- MOVE TYPE -------- */
  document.querySelectorAll("[data-move]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.moveType = btn.dataset.move;
      next();
    });
  });

  /* -------- HOME SIZE -------- */
  document.querySelectorAll("[data-size]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.homeSize = btn.dataset.size;
      next();
    });
  });

  /* -------- DATE -------- */
  document.getElementById("dateNext").onclick = () => {
    state.moveDate = document.getElementById("moveDate").value;
    if(state.moveDate) next();
  };

  /* -------- ZIP AUTOCOMPLETE -------- */
  function zipSearch(val, type){
    const box = document.getElementById(type+"Results");
    box.innerHTML = "";
    if(val.length < 2) return;

    ZIP_DATA.filter(z => z.zip.startsWith(val))
      .slice(0,5)
      .forEach(z => {
        const d = document.createElement("div");
        d.className = "result";
        d.innerText = `${z.city}, ${z.state}`;
        d.onclick = () => selectZip(type, z);
        box.appendChild(d);
      });
  }

  function selectZip(type, z){
    const label = `${z.city}, ${z.state}`;
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
    const b = document.getElementById(id);
    b.disabled = false;
    b.classList.remove("disabled");
  }

  document.getElementById("fromZip").oninput = e => zipSearch(e.target.value,"from");
  document.getElementById("toZip").oninput = e => zipSearch(e.target.value,"to");

  document.getElementById("fromNext").onclick = next;
  document.getElementById("toNext").onclick = next;

  /* -------- LOADING -------- */
  function runLoading(){
    const text = document.getElementById("loadingText");
    let p = 0;

    const msgs = [
      "Thank you! One moment please…",
      "Connecting you to movers in your area…",
      "Locating licensed movers near you…",
      `Finding available movers servicing ${state.from} → ${state.to}`,
      "Finalizing availability…"
    ];

    show(current);

    const i = setInterval(() => {
      p++;
      text.innerText =
        p < 25 ? msgs[0] :
        p < 45 ? msgs[1] :
        p < 65 ? msgs[2] :
        p < 85 ? msgs[3] : msgs[4];

      if(p >= 100){
        clearInterval(i);
        next();
      }
    }, 30);
  }

  document.getElementById("nameNext").onclick = next;
  document.getElementById("phoneNext").onclick = next;

  show(current);
});
