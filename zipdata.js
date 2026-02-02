let ZIP_INDEX = null;

fetch("zip-index.json")
  .then(res => res.json())
  .then(data => {
    ZIP_INDEX = data;
  });

function getZipMatches(prefix) {
  if (!ZIP_INDEX || prefix.length < 2) return [];
  const key = prefix.substring(0, 2);
  return ZIP_INDEX[key] || [];
}

  });
}

setupZip('fromZip', 'fromList');
setupZip('toZip', 'toList');
