import * as THREE from 'three';

export function createTonearm() {
  const group = new THREE.Group();

  const baseMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1030,
    roughness: 0.3,
    metalness: 0.7,
  });
  const armMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a1a4a,
    roughness: 0.25,
    metalness: 0.6,
  });
  const accentMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a0dc,
    roughness: 0.2,
    metalness: 0.3,
    emissive: 0x6e449e,
    emissiveIntensity: 0.06,
  });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.2, 16), baseMat);
  base.position.set(1.6, 0.12, 2.4);
  base.castShadow = true;
  group.add(base);

  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.0, 12), baseMat);
  pillar.position.set(1.6, 0.7, 2.4);
  pillar.castShadow = true;
  group.add(pillar);

  const armPivot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), accentMat);
  armPivot.position.set(1.6, 1.25, 2.4);
  group.add(armPivot);

  const armLen = 3.1;
  const armEnd = new THREE.Vector3(-0.6, 0.1, 0.6);
  const armStart = new THREE.Vector3(1.6, 1.15, 2.4);
  const dir = new THREE.Vector3().copy(armEnd).sub(armStart);
  const mid = new THREE.Vector3().copy(armStart).add(dir.clone().multiplyScalar(0.5));
  mid.y += 0.25;

  const curve = new THREE.QuadraticBezierCurve3(armStart, mid, armEnd);
  const curvePoints = curve.getPoints(20);
  const tubeGeo = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(curvePoints),
    16, 0.025, 8, false
  );
  const tube = new THREE.Mesh(tubeGeo, armMat);
  tube.castShadow = true;
  group.add(tube);

  const shell = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.12), baseMat);
  shell.position.copy(armEnd);
  shell.position.y += 0.01;
  shell.rotation.z = -0.15;
  shell.castShadow = true;
  group.add(shell);

  const stylus = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), accentMat);
  stylus.position.copy(armEnd);
  stylus.position.y -= 0.03;
  group.add(stylus);

  group.position.y = -0.3;

  return group;
}
