import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import socket from "../socket";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FlyTo({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) {
      map.setView([pos.lat, pos.lng], map.getZoom());
    }
  }, [pos, map]);
  return null;
}

export default function DriverMap({ driverPos, setDriverPos, currentRide }) {
  // Listen for external driver position control (simulateMovement will emit)
  useEffect(() => {
    // nothing here - position changes from simulateMovement in TripControls
  }, []);

  // Optionally, emit current position occasionally if online
  useEffect(() => {
    const emitPos = () => {
      socket.emit("driver_location", {
        driverId: socket.id,
        position: driverPos,
        rideId: currentRide ? currentRide.id : null,
      });
    };
    const tid = setInterval(emitPos, 5000);
    return () => clearInterval(tid);
  }, [driverPos, currentRide]);

  return (
    <div className="map-wrap">
      <MapContainer center={[driverPos.lat, driverPos.lng]} zoom={13} style={{ height: "500px" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[driverPos.lat, driverPos.lng]} />
        <FlyTo pos={driverPos} />
      </MapContainer>
    </div>
  );
}
