import React from "react";
import { startTrip, completeTrip } from "../services/driverSocket";

export default function TripControls({ ride, onComplete }) {
  const rideId = ride?.rideId;

  function handleStart() {
    startTrip(rideId);
  }
  function handleComplete() {
    completeTrip(rideId);
    if (onComplete) onComplete();
  }

  return (
    <div className="popup">
      <div><strong>Active Ride:</strong> {rideId}</div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={handleStart}>Start Trip</button>
        <button onClick={handleComplete}>Complete Trip</button>
      </div>
    </div>
  );
}
