import React from "react";

export default function RidePopup({ ride, onAccept, onReject }) {
  // ride: { id, pickup: {lat,lng}, distance }
  return (
    <div className="popup">
      <h3>Incoming Ride Request</h3>
      <p><strong>Ride ID:</strong> {ride.id}</p>
      <p>
        <strong>Pickup:</strong> {ride.pickup.lat.toFixed(5)},{ride.pickup.lng.toFixed(5)}
      </p>
      {ride.distance !== undefined && <p><strong>Distance:</strong> {ride.distance} km</p>}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-accept" onClick={onAccept}>Accept</button>
        <button className="btn btn-reject" onClick={onReject}>Reject</button>
      </div>
    </div>
  );
}
