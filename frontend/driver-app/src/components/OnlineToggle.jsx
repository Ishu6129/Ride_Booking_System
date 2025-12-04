import React, { useState } from "react";
import { connectDriver, disconnectDriver } from "../services/driverSocket";
import { driverOnline, driverOffline } from "../services/api";

export default function OnlineToggle({ driverId, initialLat = 12.9716, initialLng = 77.5946 }) {
  const [online, setOnline] = useState(false);

  async function goOnline() {
    try {
      connectDriver(driverId, initialLat, initialLng);
      // optional REST notify (safe to ignore if backend doesn't have endpoints)
      try { await driverOnline(driverId, initialLat, initialLng); } catch(e) {}
      setOnline(true);
    } catch (err) {
      console.error("goOnline error", err);
    }
  }

  async function goOffline() {
    try {
      disconnectDriver(driverId);
      try { await driverOffline(driverId); } catch(e) {}
      setOnline(false);
    } catch (err) {
      console.error("goOffline error", err);
    }
  }

  return (
    <div className="popup">
      <div className="info"><strong>Status:</strong> {online ? "Online" : "Offline"}</div>
      <button onClick={() => (online ? goOffline() : goOnline())}>
        {online ? "Go Offline" : "Go Online"}
      </button>
    </div>
  );
}
