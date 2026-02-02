const screens = document.querySelectorAll('.screen');
let current = 0;

function show(i) {
  screens[current].classList.remove('active');
  current = i;
  screens[current].classList.add('active');
}

function next(val) {
  show(current + 1);
}

function saveDate() {
  show(current + 1);
}

let percent = 0;
function startLoading() {
  const texts = [
    "Thank you…",
    "Finding movers in your area…",
    "Matching availability…",
    "Almost done…"
  ];
  const interval = setInterval(() => {
    percent++;
    document.getElementById('percent').innerText = percent + "%";
    document.getElementById('loadingText').innerText =
      texts[Math.floor(Math.random() * texts.length)];
    if (percent >= 100) {
      clearInterval(interval);
      show(current + 1);
    }
  }, 40);
}
