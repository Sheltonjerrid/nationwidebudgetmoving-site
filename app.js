document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen");
  let current = 0;

  const state = {
    from: null,
    to: null
  };

  function showScreen(i) {
    screens[current].classList.remove("active");
    current = i;
    screens[current].classList.add("active");
  }

  window.next = function () {
    showScreen(current + 1);
  };

  // ZIP AUTOCOMPLETE
  function setupZip(inputId, listId, onSelect) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    input.addEventListener("input", () => {
      list.innerHTML = "";
      const val = input.value.trim();
      if (val.length < 2) return;

      const key = val.substring(0, 2);
      const matches = ZIP_INDEX?.[key] || [];

      matches.slice(0, 6).forEach(city => {
        const div = document.createElement("div");
        div.textContent = city;
        div.onclick = () => {
          input.value = city;
          list.innerHTML = "";
          onSelect(city);
          next();
        };
        list.appendChild(div);
      });
    });
  }

  setupZip("fromZip", "fromList", city => {
    state.from = city;
  });

  setupZip("toZip", "toList", city => {
    state.to = city;
  });
});
