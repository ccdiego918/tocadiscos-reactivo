export function connectWebSocket(songId, onData) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const base = songId ? `/ws?song=${songId}` : '/ws';
  const ws = new WebSocket(`${protocol}//${window.location.host}${base}`);

  ws.onopen = () => {
    console.log(`[WS] conectado (song=${songId})`);
    document.querySelector('.sub').textContent = 'conectado';
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (onData) onData(data);
  };

  ws.onclose = () => {
    console.warn('[WS] cerrado');
    document.querySelector('.sub').textContent = 'desconectado';
  };

  ws.onerror = (err) => {
    console.error('[WS] error', err);
    document.querySelector('.sub').textContent = 'error de conexión';
  };

  return ws;
}
