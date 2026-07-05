export function connectWebSocket(songId, startFrame, onData) {
  let url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
  const params = [];
  if (songId) params.push(`song=${songId}`);
  if (startFrame > 0) params.push(`start=${startFrame}`);
  if (params.length) url += '?' + params.join('&');

  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log(`[WS] conectado (song=${songId}, start=${startFrame})`);
    document.querySelector('.sub').textContent = 'conectado';
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onData) onData(data);
  };

  ws.onclose = () => {
    console.warn('[WS] cerrado');
  };

  ws.onerror = (err) => {
    console.error('[WS] error', err);
    document.querySelector('.sub').textContent = 'error de conexión';
  };

  return ws;
}
