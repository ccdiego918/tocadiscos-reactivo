export function getSantiagoHour() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'America/Santiago',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const h = parts.find(p => p.type === 'hour').value;
  const m = parts.find(p => p.type === 'minute').value;
  const s = parts.find(p => p.type === 'second').value;
  return Number(h) + Number(m) / 60 + Number(s) / 3600;
}

export function getSkyParams(hour) {
  let night, dawn, day, dusk;
  night = hour >= 20 || hour < 6;
  dawn = hour >= 6 && hour < 8;
  dusk = hour >= 18.5 && hour < 20;
  day = !night && !dawn && !dusk;

  let nightFactor;
  if (night) nightFactor = 1;
  else if (dawn) nightFactor = 1 - (hour - 6) / 2;
  else if (dusk) nightFactor = (hour - 18.5) / 1.5;
  else nightFactor = 0;

  const starOpacity = nightFactor * 0.5;
  const fogDensity = nightFactor * 0.02;

  const bg = new THREE.Color();
  const nightBg = new THREE.Color(0x1a2240);
  const dawnBg = new THREE.Color(0x2a2850);
  const dayBg = new THREE.Color(0x3a2a5a);
  const duskBg = new THREE.Color(0x2a2048);

  if (night) bg.copy(nightBg);
  else if (dawn) bg.lerpColors(nightBg, dawnBg, (hour - 6) / 2);
  else if (day) bg.lerpColors(dawnBg, dayBg, Math.min((hour - 8) / 4, 1));
  else if (dusk) bg.lerpColors(dayBg, duskBg, (hour - 18.5) / 1.5);
  else if (hour >= 20) bg.copy(nightBg);

  const keyColor = new THREE.Color();
  const nightKey = new THREE.Color(0xd4b0e6);
  const dayKey = new THREE.Color(0xf0e0f8);
  keyColor.lerpColors(dayKey, nightKey, nightFactor);

  const keyIntensity = 1.2 + nightFactor * 0.6;

  return { nightFactor, starOpacity, bg, keyColor, keyIntensity, fogDensity };
}
