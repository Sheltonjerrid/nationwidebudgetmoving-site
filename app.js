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

  // LOADING SCREEN
  if(screens[current].classList.contains('loading')){
    runLoadingSequence();
  } else {
    show(current);
  }
}

function setMoveType(v){ state.moveType = v; next(); }
function setHomeSize(v){ state.homeSize = v; next(); }
function setMoveDate(v){ state.moveDate = v; next(); }

/* =========================
   ZIP AUTOCOMPLETE
========================= */
function zipSearch(val, type){
  const box = document.getElementById(type + 'Results');
  box.innerHTML = "";
  if(val.length < 2
