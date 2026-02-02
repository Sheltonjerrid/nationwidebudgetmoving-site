let ZIP_INDEX = null;

fetch('zip-index.json')
  .then(r => r.json())
  .then(d => ZIP_INDEX = d);

function setupZip(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  input.addEventListener('input', () => {
    list.innerHTML = '';
    if (!ZIP_INDEX || input.value.length < 2) return;

    const key = input.value.slice(0, 2);
    (ZIP_INDEX[key] || []).forEach(z => {
      if (z.zip.startsWith(input.value)) {
        const div = document.createElement('div');
        div.innerText = `${z.city}, ${z.state}`;
        div.onclick = () => show(current + 1);
        list.appendChild(div);
      }
    });
  });
}

setupZip('fromZip', 'fromList');
setupZip('toZip', 'toList');
