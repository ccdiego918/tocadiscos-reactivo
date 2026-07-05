export function connectWebSocket(songId, onData) {
  const url = songId ? `ws://100.90.30.108:8000/ws?song=${songId}` : 'ws://100.90.30.108:8000/ws';
  const ws = new WebSocket(url);

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
