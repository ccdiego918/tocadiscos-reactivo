import * as THREE from 'three';
import { createScene } from './scene.js';
import { createRecord } from './record.js';
import { createTonearm } from './tonearm.js';
import { connectWebSocket } from './ws_client.js';
import { createParticles, updateParticles } from './particles.js';
import { createBloom } from './postfx.js';
import { createLyricsPanel, loadLyrics, renderLyrics, updateLyrics } from './lyrics.js';

const FRAME_INTERVAL = 0.02322;

const { renderer, scene, camera, topGlow } = createScene();

const { composer, bloomPass } = createBloom(renderer, scene, camera);

const particleState = createParticles();
for (const s of particleState.sprites) scene.add(s);

const { group: record, label, platterRing } = createRecord();
scene.add(record);

const tonearm = createTonearm();
scene.add(tonearm);

let latestFFT = null;
let playing = false;
let ws = null;
let currentSongId = null;
let songs = [];
let songTitle = '';
let currentLyrics = [];
let seeking = false;

const audio = document.getElementById('audio');
const overlay = document.getElementById('play-overlay');

const lyricsPanel = createLyricsPanel();
const nowPlaying = document.getElementById('now-playing');
const plList = document.getElementById('pl-list');
const seekBar = document.getElementById('seek-bar');
const controls = document.getElementById('controls');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

function startWs(id, startFrame) {
  if (ws) { ws.close(); ws = null; }
  ws = connectWebSocket(id, startFrame || 0, (data) => {
    latestFFT = data.frequencies;
    if (!playing) document.querySelector('.sub').textContent = 'conectado';
  });
}

async function loadSongs() {
  const res = await fetch('/songs');
  songs = await res.json();
  renderPlaylist();
  if (songs.length) selectSong(songs[0].id, 0);
}

function renderPlaylist() {
  plList.innerHTML = '';
  songs.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'pl-item';
    item.dataset.id = s.id;
    item.innerHTML = `<span class="pl-num">${String(i + 1).padStart(2, '0')}</span><span class="pl-title">${s.title}</span>`;
    item.addEventListener('click', () => selectSong(s.id, 0));
    plList.appendChild(item);
  });
}

function selectSong(id, startFrame) {
  if (id === currentSongId && startFrame === 0 && ws) return;

  currentSongId = id;
  const song = songs.find(s => s.id === id);
  songTitle = song ? song.title : '';

  document.querySelectorAll('.pl-item').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.id) === id);
  });

  startWs(id, startFrame);

  currentLyrics = [];
  renderLyrics(lyricsPanel, [{ text: 'cargando letra...' }]);
  loadLyrics(id, (lines) => {
    currentLyrics = lines;
    renderLyrics(lyricsPanel, lines);
  });

  if (playing) {
    audio.src = `/audio/${id}`;
    audio.currentTime = (startFrame || 0) * FRAME_INTERVAL;
    audio.play();
  } else {
    audio.src = `/audio/${id}`;
    audio.currentTime = (startFrame || 0) * FRAME_INTERVAL;
  }
}

function seekTo(frame) {
  seeking = true;
  startWs(currentSongId, frame);
  audio.currentTime = frame * FRAME_INTERVAL;
  if (audio.paused && playing) audio.play();
  setTimeout(() => { seeking = false; }, 200);
}

overlay.addEventListener('click', () => {
  audio.play();
  playing = true;
  overlay.classList.add('hidden');
  controls.classList.add('visible');
  nowPlaying.classList.add('visible');
  nowPlaying.textContent = songTitle;
});

audio.addEventListener('ended', () => {
  const idx = songs.findIndex(s => s.id === currentSongId);
  const next = (idx + 1) % songs.length;
  selectSong(songs[next].id, 0);
  audio.play();
  nowPlaying.textContent = songs[next].title;
});

audio.addEventListener('timeupdate', () => {
  if (!seeking && audio.duration) {
    seekBar.value = (audio.currentTime / audio.duration) * 1000;
  }
});

seekBar.addEventListener('input', () => {
  const pct = seekBar.value / 1000;
  const t = pct * audio.duration;
  if (audio.duration) {
    const frame = Math.floor(t / FRAME_INTERVAL);
    seekTo(frame);
  }
});

btnPrev.addEventListener('click', () => {
  const t = Math.max(0, audio.currentTime - 10);
  seekTo(Math.floor(t / FRAME_INTERVAL));
});

btnNext.addEventListener('click', () => {
  const t = Math.min(audio.duration, audio.currentTime + 10);
  seekTo(Math.floor(t / FRAME_INTERVAL));
});

const clock = new THREE.Clock();

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloomPass.resolution.set(w, h);
});

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  record.rotation.y += dt * (playing ? 0.9 : 0.4);
  record.rotation.x = 0.15 + Math.sin(t * 0.3) * 0.005;

  if (playing) {
    tonearm.rotation.y = -0.02 + Math.sin(t * 0.5) * 0.003;
  }

  let low = 0;
  if (latestFFT && latestFFT.length > 0) {
    const loEnd = Math.floor(latestFFT.length * 0.08);
    for (let i = 0; i < loEnd; i++) low += latestFFT[i] / 100;
    low /= loEnd;
  }

  const pulse = playing ? 0.12 + low * 2.5 : 0.12;
  label.material.emissiveIntensity = pulse;

  const ringPulse = playing ? 0.1 + low * 3 : 0.1;
  platterRing.material.emissiveIntensity = ringPulse;
  platterRing.scale.setScalar(1 + low * 0.3);

  topGlow.intensity = playing ? 0.3 + low * 2 : 0.15;

  if (playing && currentLyrics.length) {
    updateLyrics(lyricsPanel, currentLyrics, audio.currentTime);
  }

  updateParticles(particleState, playing ? latestFFT : null, dt);

  composer.render();
}

loadSongs();
animate();
