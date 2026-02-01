let current = 0;
const screens = document.querySelectorAll('.screen');

function show(i){
  screens.forEach(s => s.classList.remove('active'));
  screens[i].classList.add('active');
}

function next(){
  current++;

  // fake loading screen
  if(screens[current].classList.contains('loading')){
    show(current);
    setTimeout(()=>{ current++; show(current); }, 2500);
  } else {
    show(current);
  }
}

function setMoveType(val){
  next();
}

function setHomeSize(val){
  next();
}

function setMoveDate(val){
  next();
}

show(current);
