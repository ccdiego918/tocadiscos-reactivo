import * as THREE from 'three';
import { createScene } from './scene.js';
import { createRecord } from './record.js';
import { createTonearm } from './tonearm.js';
import { connectWebSocket } from './ws_client.js';
import { createParticles, updateParticles } from './particles.js';
import { createBloom } from './postfx.js';
import { createLyricsPanel, loadLyrics, renderLyrics, updateLyrics } from './lyrics.js';

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

const audio = document.getElementById('audio');
const overlay = document.getElementById('play-overlay');

const lyricsPanel = createLyricsPanel();
const nowPlaying = document.getElementById('now-playing');
const plList = document.getElementById('pl-list');

async function loadSongs() {
  const res = await fetch('/songs');
  songs = await res.json();
  renderPlaylist();
  if (songs.length) selectSong(songs[0].id);
}

function renderPlaylist() {
  plList.innerHTML = '';
  songs.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'pl-item';
    item.dataset.id = s.id;
    item.innerHTML = `<span class="pl-num">${String(i + 1).padStart(2, '0')}</span><span class="pl-title">${s.title}</span>`;
    item.addEventListener('click', () => selectSong(s.id));
    plList.appendChild(item);
  });
}

function selectSong(id) {
  if (id === currentSongId && ws) return;

  currentSongId = id;
  const song = songs.find(s => s.id === id);
  songTitle = song ? song.title : '';

  document.querySelectorAll('.pl-item').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.id) === id);
  });

  if (ws) {
    ws.close();
    ws = null;
  }

  ws = connectWebSocket(id, (data) => {
    latestFFT = data.frequencies;
    if (!playing) {
      document.querySelector('.sub').textContent = 'conectado';
    }
  });

  currentLyrics = [];
  renderLyrics(lyricsPanel, [{ text: 'cargando letra...' }]);
  loadLyrics(id, (lines) => {
    currentLyrics = lines;
    renderLyrics(lyricsPanel, lines);
  });

  if (playing) {
    audio.src = `/audio/${id}`;
    audio.play();
  } else {
    audio.src = `/audio/${id}`;
  }
}

overlay.addEventListener('click', () => {
  audio.play();
  playing = true;
  overlay.classList.add('hidden');
  nowPlaying.classList.add('visible');
  nowPlaying.textContent = songTitle;
});

audio.addEventListener('ended', () => {
  const idx = songs.findIndex(s => s.id === currentSongId);
  const next = (idx + 1) % songs.length;
  selectSong(songs[next].id);
  audio.play();
  nowPlaying.textContent = songs[next].title;
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
