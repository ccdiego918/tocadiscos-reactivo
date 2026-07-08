import * as THREE from 'three';

const shapes = [
  (s) => new THREE.TetrahedronGeometry(s),
  (s) => new THREE.OctahedronGeometry(s),
  (s) => new THREE.IcosahedronGeometry(s),
  (s) => new THREE.BoxGeometry(s, s, s),
  (s) => new THREE.DodecahedronGeometry(s),
];

const palette = [
  '#ff00ff', '#00ffff', '#ffea00', '#ff4488',
  '#44ff88', '#8844ff', '#ff8844', '#00ffcc',
];

function rand(min, max) { return min + Math.random() * (max - min); }

export function createColorBlast() {
  const group = new THREE.Group();
  const objects = [];
  const COUNT = 60;

  for (let i = 0; i < COUNT; i++) {
    const size = rand(0.08, 0.35);
    const geo = shapes[Math.floor(Math.random() * shapes.length)](size);
    const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
    const mat = new THREE.MeshPhysicalMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, 0);
    mesh.castShadow = false;
    mesh.receiveShadow = false;

    const speed = rand(0.3, 1.2);
    const rotSpeed = {
      x: rand(-2, 2),
      y: rand(-2, 2),
      z: rand(-2, 2),
    };
    const radius = rand(1.5, 5.5);
    const angle = rand(0, Math.PI * 2);
    const heightOffset = rand(-1.5, 1.5);

    group.add(mesh);
    objects.push({ mesh, speed, rotSpeed, radius, angle, heightOffset, mat, baseColor: color });
  }

  return { group, objects, COUNT };
}

export function updateColorBlast(state, fftData, playing, delta) {
  const { objects } = state;
  const len = fftData ? fftData.length : 0;

  let low = 0, mid = 0, high = 0;
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

  const intensity = Math.min((low + mid + high) * 0.8, 1);
  const beat = low > 0.15 ? Math.min((low - 0.15) * 6, 1) : 0;

  const pulse = playing ? 0.4 + intensity * 2.5 + beat * 4 : 0.1;
  const speedMul = playing ? 0.5 + mid * 3 : 0.1;

  for (const obj of objects) {
    const { mesh, rotSpeed, radius, heightOffset, mat, baseColor } = obj;

    obj.angle += delta * obj.speed * speedMul;
    mesh.position.x = Math.cos(obj.angle) * radius;
    mesh.position.z = Math.sin(obj.angle) * radius;
    mesh.position.y = Math.sin(obj.angle * 1.7 + heightOffset) * 0.8 + heightOffset * 0.3;

    mesh.rotation.x += delta * rotSpeed.x * (0.5 + mid);
    mesh.rotation.y += delta * rotSpeed.y * (0.5 + high);
    mesh.rotation.z += delta * rotSpeed.z * (0.5 + low);

    const beatFlash = beat > 0.3 ? 1 + beat * 2 : 1;
    const scale = beatFlash * (0.6 + intensity * 0.8);
    mesh.scale.setScalar(scale);

    mat.emissiveIntensity = pulse * 0.8;
    mat.opacity = Math.min(pulse, 1);

    if (beat > 0.4) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      mat.color.set(c);
      mat.emissive.set(c);
    }
  }
}
