export default function simulateMovement({ from, to, onStep, onArrive, interval = 2000, stepDelta = 0.0005 }) {
  let lat = from.lat;
  let lng = from.lng;
  const targetLat = to.lat;
  const targetLng = to.lng;

  let stopped = false;

  function step() {
    if (stopped) return;
    const latDiff = targetLat - lat;
    const lngDiff = targetLng - lng;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    if (distance < stepDelta * 1.5) {
      // Arrived
      lat = targetLat;
      lng = targetLng;
      if (onStep) onStep({ lat, lng });
      if (onArrive) onArrive();
      return;
    }
    // Move proportionally
    const ratio = stepDelta / distance;
    lat += latDiff * ratio;
    lng += lngDiff * ratio;
    if (onStep) onStep({ lat, lng });

    // schedule
    setTimeout(step, interval);
  }

  // kick off
  setTimeout(step, interval);

  return {
    stop: () => {
      stopped = true;
    },
  };
}
