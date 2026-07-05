export function parseLRC(text) {
  return text.split('\n').map(line => {
    const m = line.match(/^\[(\d+):(\d+\.\d+)\](.*)/);
    if (!m) return null;
    return {
      time: parseInt(m[1]) * 60 + parseFloat(m[2]),
      text: m[3].trim(),
    };
  }).filter(Boolean);
}

export function createLyricsPanel() {
  const el = document.createElement('div');
  el.id = 'lyrics-panel';
  el.innerHTML = '<div class="lyrics-inner"></div>';
  document.body.appendChild(el);
  return el;
}

export function loadLyrics(songId, callback) {
  fetch(`http://100.90.30.108:8000/lyrics/${songId}`)
    .then(r => r.json())
    .then(data => {
      if (data.lrc) {
        callback(parseLRC(data.lrc));
      } else {
        callback([]);
      }
    })
    .catch(() => callback([]));
}

export function renderLyrics(container, lines) {
  const inner = container.querySelector('.lyrics-inner');
  inner.innerHTML = lines.map((l, i) =>
    `<div class="lyric-line" data-idx="${i}">${l.text || '　'}</div>`
  ).join('');
}

export function updateLyrics(container, lines, currentTime) {
  const inner = container.querySelector('.lyrics-inner');
  if (!lines.length) return;

  let activeIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (currentTime >= lines[i].time) {
      activeIdx = i;
      break;
    }
  }

  const items = inner.querySelectorAll('.lyric-line');
  items.forEach((el, i) => {
    const dist = i - activeIdx;
    if (dist >= 0 && dist <= 3) {
      el.style.display = '';
      el.classList.toggle('active', i === activeIdx);
    } else {
      el.style.display = 'none';
    }
  });

  if (activeIdx >= 0) {
    const active = items[activeIdx];
    if (active) {
      const offset = active.offsetTop - inner.offsetHeight / 3;
      inner.scrollTop = offset;
    }
  }
}
