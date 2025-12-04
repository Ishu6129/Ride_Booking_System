let __simInterval = null;

export function startSimulation({ startLat, startLng, onTick, step = 0.0005, intervalMs = 1500 }) {
  let lat = Number(startLat);
  let lng = Number(startLng);
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("startSimulation: startLat/startLng must be numbers");
  }

  stopSimulation();

  __simInterval = setInterval(() => {
    lat += (Math.random() - 0.5) * step;
    lng += (Math.random() - 0.5) * step;
    onTick({ lat, lng });
  }, intervalMs);

  return function stop() {
    stopSimulation();
  };
}

export function stopSimulation() {
  if (__simInterval) {
    clearInterval(__simInterval);
    __simInterval = null;
  }
}
