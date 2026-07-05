import * as THREE from 'three';

function vinylTexture() {
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 2048;
  const ctx = c.getContext('2d');
  const cx = 1024, cy = 1024;

  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1024);
  bg.addColorStop(0, '#1a0e30');
  bg.addColorStop(0.3, '#140a28');
  bg.addColorStop(0.65, '#0e0720');
  bg.addColorStop(1, '#080318');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 2048, 2048);

  for (let r = 180; r < 1000; r += 5) {
    const bright = 6 + ((r / 5) % 2) * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(270, 25%, ${bright}%, ${0.12 + (r / 1000) * 0.06})`;
    ctx.lineWidth = 0.4 + ((r / 5) % 2) * 0.3;
    ctx.stroke();
  }

  for (let i = 0; i < 2000; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 180 + Math.random() * 800;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.012})`;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.3 + Math.random() * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const shine = ctx.createRadialGradient(cx - 200, cy - 200, 30, cx, cy, 920);
  shine.addColorStop(0, 'rgba(220,200,240,0.06)');
  shine.addColorStop(0.3, 'rgba(180,160,220,0.03)');
  shine.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, 2048, 2048);

  const lr = 340;
  const lg = ctx.createRadialGradient(cx, cy, 0, cx, cy, lr);
  lg.addColorStop(0, '#eed8f5');
  lg.addColorStop(0.15, '#d4b0e6');
  lg.addColorStop(0.4, '#b07cd6');
  lg.addColorStop(0.7, '#7a4d9e');
  lg.addColorStop(0.9, '#4a2d6e');
  lg.addColorStop(1, '#1a0e30');
  ctx.fillStyle = lg;
  ctx.beginPath();
  ctx.arc(cx, cy, lr, 0, Math.PI * 2);
  ctx.fill();

  for (let r = lr - 12; r > 50; r -= 28) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.04 + (r % 56) * 0.002})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const next = ((i + 1) / 40) * Math.PI * 2;
    const r1 = 180 + Math.random() * 60;
    const r2 = 180 + Math.random() * 80;
    ctx.beginPath();
    ctx.arc(cx, cy, r1, a, next);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  ctx.save();
  ctx.font = '36px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const rx = cx + Math.cos(a) * 240;
    const ry = cy + Math.sin(a) * 240;
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText('✦', 0, 0);
    ctx.restore();
  }
  ctx.restore();

  ctx.fillStyle = '#080318';
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a0e30';
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8;
  return tex;
}

export function createRecord() {
  const group = new THREE.Group();
  const tex = vinylTexture();

  const platterMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0418,
    roughness: 0.5,
    metalness: 0.3,
    clearcoat: 0.1,
  });
  const platter = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.2, 0.15, 64),
    platterMat
  );
  platter.position.y = -0.08;
  platter.receiveShadow = true;
  platter.castShadow = true;
  group.add(platter);

  const platterRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.68, 0.02, 8, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x4a2d6e,
      roughness: 0.3,
      metalness: 0.5,
      emissive: 0x2a1545,
      emissiveIntensity: 0.1,
    })
  );
  platterRing.position.y = -0.005;
  platterRing.rotation.x = Math.PI / 2;
  group.add(platterRing);

  const vinylMat = new THREE.MeshPhysicalMaterial({
    map: tex,
    roughness: 0.3,
    metalness: 0.5,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    color: 0xffffff,
    envMapIntensity: 0.6,
  });
  const vinyl = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.6, 0.08, 80),
    vinylMat
  );
  vinyl.position.y = 0.04;
  vinyl.castShadow = true;
  vinyl.receiveShadow = true;
  group.add(vinyl);

  const edgeMat = new THREE.MeshPhysicalMaterial({
    color: 0x080318,
    roughness: 0.5,
    metalness: 0.2,
  });
  const edge = new THREE.Mesh(
    new THREE.CylinderGeometry(2.6, 2.6, 0.08, 80, 1, true),
    edgeMat
  );
  edge.position.y = 0.04;
  group.add(edge);

  const labelMat = new THREE.MeshPhysicalMaterial({
    color: 0xd4b0e6,
    roughness: 0.2,
    metalness: 0.1,
    emissive: 0x8a5abe,
    emissiveIntensity: 0.12,
  });
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.085, 40),
    labelMat
  );
  label.position.y = 0.04;
  group.add(label);

  group.rotation.x = 0.15;
  group.position.y = -0.3;

  return { group, label, platterRing };
}
