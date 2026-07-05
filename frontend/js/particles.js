import * as THREE from 'three';

function makeTexture(drawFn) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d');
  drawFn(ctx, 64, 64);
  return new THREE.CanvasTexture(c);
}

const textures = [
  makeTexture((ctx, cx, cy) => {
    const g1 = ctx.createRadialGradient(cx - 28, cy - 18, 2, cx - 28, cy - 18, 34);
    g1.addColorStop(0, 'rgba(255,245,255,1)');
    g1.addColorStop(0.15, 'rgba(240,210,250,0.95)');
    g1.addColorStop(0.5, 'rgba(200,150,230,0.7)');
    g1.addColorStop(1, 'rgba(150,90,190,0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.ellipse(cx - 28, cy - 18, 34, 24, -0.35, 0, Math.PI * 2);
    ctx.fill();

    const g2 = ctx.createRadialGradient(cx + 28, cy - 18, 2, cx + 28, cy - 18, 34);
    g2.addColorStop(0, 'rgba(255,250,255,1)');
    g2.addColorStop(0.15, 'rgba(250,220,255,0.95)');
    g2.addColorStop(0.5, 'rgba(215,165,240,0.7)');
    g2.addColorStop(1, 'rgba(165,105,205,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.ellipse(cx + 28, cy - 18, 34, 24, 0.35, 0, Math.PI * 2);
    ctx.fill();

    const g3 = ctx.createRadialGradient(cx - 22, cy + 16, 2, cx - 22, cy + 16, 22);
    g3.addColorStop(0, 'rgba(240,215,250,1)');
    g3.addColorStop(0.5, 'rgba(190,150,230,0.7)');
    g3.addColorStop(1, 'rgba(140,90,185,0)');
    ctx.fillStyle = g3;
    ctx.beginPath();
    ctx.ellipse(cx - 22, cy + 16, 22, 16, 0.25, 0, Math.PI * 2);
    ctx.fill();

    const g4 = ctx.createRadialGradient(cx + 22, cy + 16, 2, cx + 22, cy + 16, 22);
    g4.addColorStop(0, 'rgba(250,230,255,1)');
    g4.addColorStop(0.5, 'rgba(210,170,240,0.7)');
    g4.addColorStop(1, 'rgba(160,110,210,0)');
    ctx.fillStyle = g4;
    ctx.beginPath();
    ctx.ellipse(cx + 22, cy + 16, 22, 16, -0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e0f30';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 2, 3, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2a1545';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy - 14);
    ctx.quadraticCurveTo(cx - 14, cy - 32, cx - 24, cy - 30);
    ctx.moveTo(cx + 3, cy - 14);
    ctx.quadraticCurveTo(cx + 14, cy - 32, cx + 24, cy - 30);
    ctx.stroke();

    for (let i = 0; i < 5; i++) {
      const x = cx + (Math.random() - 0.5) * 80;
      const y = cy + (Math.random() - 0.5) * 60;
      const r = 2 + Math.random() * 4;
      const ga = ctx.createRadialGradient(x, y, 0, x, y, r);
      ga.addColorStop(0, 'rgba(255,255,255,0.5)');
      ga.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = ga;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }),

  makeTexture((ctx, cx, cy) => {
    const g1 = ctx.createRadialGradient(cx + 8, cy - 12, 2, cx + 8, cy - 12, 30);
    g1.addColorStop(0, 'rgba(255,245,255,1)');
    g1.addColorStop(0.2, 'rgba(235,200,250,0.9)');
    g1.addColorStop(0.6, 'rgba(180,130,220,0.5)');
    g1.addColorStop(1, 'rgba(130,70,180,0)');
    ctx.fillStyle = g1;
    ctx.beginPath();
    ctx.ellipse(cx + 8, cy - 12, 28, 38, -0.1, 0, Math.PI * 2);
    ctx.fill();

    const g2 = ctx.createRadialGradient(cx - 14, cy + 2, 1, cx - 14, cy + 2, 20);
    g2.addColorStop(0, 'rgba(230,200,245,1)');
    g2.addColorStop(0.5, 'rgba(170,125,215,0.6)');
    g2.addColorStop(1, 'rgba(120,70,175,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.ellipse(cx - 14, cy + 2, 18, 24, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e0f30';
    ctx.beginPath();
    ctx.ellipse(cx + 2, cy - 6, 2.5, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2a1545';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 18);
    ctx.quadraticCurveTo(cx - 8, cy - 36, cx - 18, cy - 34);
    ctx.stroke();

    for (let i = 0; i < 3; i++) {
      const x = cx + (Math.random() - 0.5) * 50;
      const y = cy + (Math.random() - 0.5) * 50;
      const r = 1.5 + Math.random() * 3;
      const ga = ctx.createRadialGradient(x, y, 0, x, y, r);
      ga.addColorStop(0, 'rgba(255,255,255,0.4)');
      ga.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = ga;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }),

  makeTexture((ctx, cx, cy) => {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const g = ctx.createRadialGradient(
        cx + Math.cos(angle) * 14, cy + Math.sin(angle) * 14, 1,
        cx + Math.cos(angle) * 14, cy + Math.sin(angle) * 14, 16
      );
      g.addColorStop(0, 'rgba(255,255,255,0.8)');
      g.addColorStop(0.3, 'rgba(220,180,245,0.5)');
      g.addColorStop(1, 'rgba(180,130,220,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(
        cx + Math.cos(angle) * 14,
        cy + Math.sin(angle) * 14,
        16, 4, angle, 0, Math.PI * 2
      );
      ctx.fill();
    }
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
    g.addColorStop(0, 'rgba(255,255,255,0.6)');
    g.addColorStop(0.5, 'rgba(220,180,245,0.3)');
    g.addColorStop(1, 'rgba(200,150,230,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  }),

  makeTexture((ctx, cx, cy) => {
    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, 24);
    g.addColorStop(0, 'rgba(255,245,255,0.9)');
    g.addColorStop(0.2, 'rgba(230,195,245,0.5)');
    g.addColorStop(0.5, 'rgba(200,150,230,0.2)');
    g.addColorStop(1, 'rgba(180,130,220,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 6, 22, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    const g2 = ctx.createRadialGradient(cx, cy + 10, 1, cx, cy + 10, 16);
    g2.addColorStop(0, 'rgba(240,210,250,0.7)');
    g2.addColorStop(0.5, 'rgba(190,145,230,0.3)');
    g2.addColorStop(1, 'rgba(160,110,210,0)');
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 14, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1e0f30';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 2, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }),
];

export function createParticles() {
  const COUNT = 400;

  const palette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xeed8f5),
    new THREE.Color(0xe8c4f0),
    new THREE.Color(0xd4b0e6),
    new THREE.Color(0xc9a0dc),
    new THREE.Color(0xf0e0f8),
  ];

  const texMaterials = textures.map(tex => {
    return palette.map(color => {
      return new THREE.SpriteMaterial({
        map: tex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0,
        color,
        sizeAttenuation: true,
      });
    });
  });

  const sprites = [];
  const vel = [];
  const life = [];
  const maxD = [];
  const flutter = [];
  const flutterSpeed = [];

  for (let i = 0; i < COUNT; i++) {
    const ti = Math.floor(Math.random() * texMaterials.length);
    const pi = Math.floor(Math.random() * palette.length);
    const sprite = new THREE.Sprite(texMaterials[ti][pi]);
    sprite.position.set(0, 0, 0);
    sprite.scale.set(0, 0, 0);
    sprites.push(sprite);

    const a = Math.random() * Math.PI * 2;
    const s = 0.2 + Math.random() * 0.8;
    vel.push({ x: Math.cos(a) * s, y: (Math.random() - 0.5) * 0.25, z: Math.sin(a) * s });
    life.push(Math.random() * 60);
    maxD.push(1.2 + Math.random() * 2.5);
    flutter.push(Math.random() * Math.PI * 2);
    flutterSpeed.push(1.5 + Math.random() * 3);
  }

  return { sprites, vel, life, maxD, flutter, flutterSpeed, COUNT };
}

export function updateParticles(state, fftData, delta) {
  const { sprites, vel, life, maxD, flutter, flutterSpeed, COUNT } = state;

  let low = 0, mid = 0, high = 0;
  const len = fftData ? fftData.length : 0;
  if (len > 0) {
    const loEnd = Math.floor(len * 0.08);
    const hiStart = Math.floor(len * 0.45);
    let loN = 0, miN = 0, hiN = 0;
    for (let i = 0; i < len; i++) {
      const v = fftData[i] / 100;
      if (i < loEnd) { low += v; loN++; }
      else if (i < hiStart) { mid += v; miN++; }
      else { high += v; hiN++; }
    }
    low = loN ? low / loN : 0;
    mid = miN ? mid / miN : 0;
    high = hiN ? high / hiN : 0;
  }

  const energy = low + mid + high;
  const scaleBase = 0.2 + low * 1.2;
  const speedMul = 0.3 + mid * 2.5;
  const spreadMul = 0.5 + high * 1.8;
  const emitRate = 6 + low * 60;

  for (let i = 0; i < COUNT; i++) {
    life[i] += delta * speedMul;

    const p = sprites[i].position;
    const r = Math.sqrt(p.x * p.x + p.z * p.z);
    const radius = maxD[i] * spreadMul;

    if (r > radius) {
      if (Math.random() > emitRate * delta * 0.1) continue;

      p.set(0, 0, 0);
      const a = Math.random() * Math.PI * 2;
      const s = 0.2 + mid * 2.0 + Math.random() * 0.5;
      vel[i].x = Math.cos(a) * s;
      vel[i].y = (Math.random() - 0.5) * 0.2;
      vel[i].z = Math.sin(a) * s;
      life[i] = 0;
    }

    p.x += vel[i].x * delta * speedMul;
    p.y += vel[i].y * delta + Math.sin(flutter[i] + life[i] * flutterSpeed[i]) * delta * 0.5;
    p.z += vel[i].z * delta * speedMul;

    const fadeIn = Math.min(life[i] / 1.0, 1);
    const fadeOut = Math.max(1 - r / radius, 0);
    const s = scaleBase * fadeIn * fadeOut * (0.6 + low * 3.0);

    sprites[i].scale.set(s, s, s);
    sprites[i].material.opacity = Math.min(fadeIn * fadeOut * 1.0, 1.0);
  }
}
