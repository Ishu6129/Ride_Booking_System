import React from "react";
import { acceptRide } from "../services/driverSocket";

export default function RidePopup({ offer, onAccept, onReject }) {
  const { rideId, pickup, drop, fareEstimate, distanceKmEstimate } = offer;

  function handleAccept() {
    // emit accept (socket) and let parent update UI (acceptedRide)
    acceptRide(rideId, offer.driverId || offer.driverId || null);
    if (onAccept) onAccept(offer);
  }

  return (
    <div className="popup">
      <h4>Incoming Ride Offer</h4>
      <div className="small"><strong>Ride ID:</strong> {rideId}</div>
      <div className="info"><strong>Pickup:</strong> {pickup?.lat?.toFixed(4)}, {pickup?.lng?.toFixed(4)}</div>
      <div className="info"><strong>Drop:</strong> {drop?.lat?.toFixed(4)}, {drop?.lng?.toFixed(4)}</div>
      <div className="info"><strong>Distance (km):</strong> {distanceKmEstimate?.toFixed(2)}</div>
      <div className="info"><strong>Fare est.:</strong> ₹{fareEstimate}</div>
      <div style={{display: "flex", gap: 8, marginTop: 8}}>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={onReject}>Reject</button>
      </div>
    </div>
  );
}
