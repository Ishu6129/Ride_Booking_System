import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";
import simulateMovement from "../utils/simulateMovement";

export default function TripControls({ ride, setCurrentRide, driverPos, setDriverPos }) {
  const [status, setStatus] = useState("accepted"); // accepted -> arrived -> in_progress -> completed
  const simRef = useRef(null);

  useEffect(() => {
    // When ride accepted, start sim toward pickup
    if (status === "accepted") {
      // start simulation to pickup
      simRef.current = simulateMovement({
        from: driverPos,
        to: ride.pickup,
        onStep: (pos) => {
          setDriverPos(pos);
          socket.emit("driver_location", { driverId: socket.id, position: pos, rideId: ride.id });
        },
        onArrive: () => {
          setStatus("arrived");
        },
        interval: 2000,
        stepDelta: 0.0005,
      });
    }

    return () => {
      // cleanup
      if (simRef.current && simRef.current.stop) simRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTrip = () => {
    // stop any previous sim
    if (simRef.current && simRef.current.stop) simRef.current.stop();

    setStatus("in_progress");
    socket.emit("trip_started", { rideId: ride.id, driverId: socket.id });

    // simulate movement to destination (if provided) — here we use pickup -> dummy destination or ride.destination
    const dest = ride.destination || { lat: ride.pickup.lat + 0.02, lng: ride.pickup.lng + 0.02 };
    simRef.current = simulateMovement({
      from: driverPos,
      to: dest,
      onStep: (pos) => {
        setDriverPos(pos);
        socket.emit("driver_location", { driverId: socket.id, position: pos, rideId: ride.id });
      },
      onArrive: () => {
        setStatus("completed");
      },
      interval: 2000,
      stepDelta: 0.0007,
    });
  };

  const endTrip = () => {
    // stop simulation
    if (simRef.current && simRef.current.stop) simRef.current.stop();
    socket.emit("trip_completed", { rideId: ride.id, driverId: socket.id });
    setCurrentRide(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p>Status: {status}</p>
      {status === "arrived" && (
        <button className="btn btn-start" onClick={startTrip}>Start Trip</button>
      )}
      {status === "in_progress" && (
        <button className="btn btn-end" onClick={endTrip}>End Trip</button>
      )}
      {status === "accepted" && <p>Heading to pickup…</p>}
      {status === "completed" && (
        <div>
          <p>Trip completed</p>
          <button className="btn" onClick={() => setCurrentRide(null)}>Clear</button>
        </div>
      )}
    </div>
  );
}
