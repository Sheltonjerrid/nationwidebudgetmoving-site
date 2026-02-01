let current = 0;
const screens = document.querySelectorAll('.screen');

const state = {
  moveType: "",
  homeSize: "",
  moveDate: "",
  from: "",
  to: ""
};

function show(i){
  screens.forEach(s => s.classList.remove('active'));
  screens[i].classList.add('active');
}

function next(){
  current++;

  // If loading screen, run sequence
  if (screens[current].classList.contains('loading')) {
    runLoadingSequence();
  } else {
    show(current);
  }
}

// ---------- STEP SETTERS ----------
function setMoveType(v){
  state.moveType = v;
  next();
}

function setHomeSize(v){
  state.homeSize = v;
  next();
}

function setMoveDate(v){
  state.moveDate = v;
  next();
}

// ---------- ZIP AUTOCOMPLETE ----------
function zipSearch(val, type){
  const box = document.getElementById(type + 'Results');
  box.innerHTML = "";
  if(val.length < 2) return;

  ZIP_DATA.filter(z => z.zip.startsWith(val))
    .slice(0,5)
    .forEach(z => {
      const div = document.createElement('div');
      div.className = "result";
      div.innerText = `${z.city}, ${z.state}`;
      div.onclick = () => selectCity(type, z);
      box.appendChild(div);
    });
}

function selectCity(type, z){
  const label = `${z.city}, ${z.state}`;
  if(type === 'from') state.from = label;
  if(type === 'to') state.to = label;
  next();
}

// ---------- LOADING SCREEN ----------
function runLoadingSequence(){
  const loadingScreen = screens[current];
  const textEl = document.getElementById('loadingText');

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

    if (percent < 25) textEl.innerText = messages[0];
    else if (percent < 45) textEl.innerText = messages[1];
    else if (percent < 65) textEl.innerText = messages[2];
    else if (percent < 85) textEl.innerText = messages[3];
    else textEl.innerText = messages[4];

    if (percent >= 100) {
      clearInterval(interval);
      current++;
      show(current);
    }
  }, 30);
}

// ---------- INIT ----------
show(current);
