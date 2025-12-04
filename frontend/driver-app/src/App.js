import React, { useEffect, useState } from "react";
import socket from "./socket";
import OnlineToggle from "./components/OnlineToggle";
import DriverMap from "./components/DriverMap";
import RidePopup from "./components/RidePopup";
import TripControls from "./components/TripControls";
import { setDriverOnlineApi } from "./services/api";

function App() {
  const [online, setOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState(null); // {id, pickup: {lat,lng}, distance}
  const [currentRide, setCurrentRide] = useState(null); // ride accepted
  const [driverPos, setDriverPos] = useState({ lat: 12.9716, lng: 77.5946 }); // default Bangalore

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    socket.on("ride_request", (payload) => {
      console.log("ride_request", payload);
      setRideRequest(payload);
    });

    socket.on("ride_cancelled", (payload) => {
      // optional: handle cancellation
      if (currentRide && payload.rideId === currentRide.id) {
        setCurrentRide(null);
      }
      setRideRequest(null);
    });

    // Clean up
    return () => {
      socket.off("ride_request");
      socket.disconnect();
    };
  }, [currentRide]);

  const goOnline = async () => {
    try {
      await setDriverOnlineApi(); // register backend if needed
      setOnline(true);
      socket.emit("driver_online", { driverId: socket.id, position: driverPos });
    } catch (err) {
      console.error("Online error", err);
    }
  };

  const goOffline = () => {
    setOnline(false);
    socket.emit("driver_offline", { driverId: socket.id });
    setCurrentRide(null);
    setRideRequest(null);
  };

  const handleAccept = (ride) => {
    // Accept ride -> inform backend
    socket.emit("driver_accept", { rideId: ride.id, driverId: socket.id });
    setCurrentRide(ride);
    setRideRequest(null);
  };

  const handleReject = (ride) => {
    socket.emit("driver_reject", { rideId: ride.id, driverId: socket.id });
    setRideRequest(null);
  };

  return (
    <div className="app">
      <header>
        <h2>Driver App — Member 2</h2>
        <OnlineToggle online={online} onOnline={goOnline} onOffline={goOffline} />
      </header>

      <main>
        <DriverMap
          driverPos={driverPos}
          setDriverPos={setDriverPos}
          currentRide={currentRide}
        />
        <div className="panel">
          <h4>Status: {online ? "Online" : "Offline"}</h4>
          {currentRide ? (
            <div>
              <p>On Ride: {currentRide.id}</p>
              <TripControls
                ride={currentRide}
                setCurrentRide={setCurrentRide}
                driverPos={driverPos}
                setDriverPos={setDriverPos}
              />
            </div>
          ) : (
            <p>No active ride</p>
          )}
        </div>
      </main>

      {rideRequest && (
        <RidePopup
          ride={rideRequest}
          onAccept={() => handleAccept(rideRequest)}
          onReject={() => handleReject(rideRequest)}
        />
      )}
    </div>
  );
}

export default App;