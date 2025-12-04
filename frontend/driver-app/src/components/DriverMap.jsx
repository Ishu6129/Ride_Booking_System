import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { sendLocation } from "../services/driverSocket";
import { startSimulation, stopSimulation } from "../utils/simulateMovement";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function DriverMap({ driverId, acceptedRide }) {
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });

  // init map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("driverMap").setView([coords.lat, coords.lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(mapRef.current);
      driverMarkerRef.current = L.marker([coords.lat, coords.lng]).addTo(mapRef.current).bindPopup("You");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update marker when coords change
  useEffect(() => {
    if (driverMarkerRef.current) {
      driverMarkerRef.current.setLatLng([coords.lat, coords.lng]);
      mapRef.current.setView([coords.lat, coords.lng]);
    }
  }, [coords]);

  // start simulation when a ride is accepted
  useEffect(() => {
    let stop = null;
    if (acceptedRide) {
      // start simulation from pickup (if provided)
      const startLat = acceptedRide.pickup?.lat ?? coords.lat;
      const startLng = acceptedRide.pickup?.lng ?? coords.lng;
      setCoords({ lat: startLat, lng: startLng });

      stop = startSimulation({
        startLat,
        startLng,
        onTick: ({ lat, lng }) => {
          setCoords({ lat, lng });
          sendLocation(driverId, lat, lng); // emit to server
        },
        step: 0.0006,
        intervalMs: 1200
      });
    }
    return () => {
      if (stop) stop();
      stopSimulation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedRide]);

  return <div id="driverMap" style={{ height: "100%", width: "100%" }} />;
}
