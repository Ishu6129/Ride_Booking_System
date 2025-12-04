import React, { useEffect, useState } from "react";
import OnlineToggle from "./components/OnlineToggle";
import DriverMap from "./components/DriverMap";
import RidePopup from "./components/RidePopup";
import TripControls from "./components/TripControls";
import { onRideOffer, offRideOffer } from "./services/driverSocket";

export default function App() {
  // For demo keep driverId static or generate unique per browser
  const [driverId] = useState(() => `driver_${Math.floor(Math.random()*10000)}`);
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [incomingOffer, setIncomingOffer] = useState(null);

  useEffect(() => {
    function handleOffer(offer) {
      setIncomingOffer(offer);
    }
    onRideOffer(handleOffer);
    return () => offRideOffer();
  }, []);

  function onAccept(offer) {
    setAcceptedRide(offer);
    setIncomingOffer(null);
  }

  function onReject() {
    setIncomingOffer(null);
  }

  function clearAccepted() {
    setAcceptedRide(null);
  }

  return (
    <div className="app">
      <div className="left">
        <div className="popup">
          <div><strong>Driver ID:</strong> {driverId}</div>
          <div className="small">Use this window to demo driver actions</div>
        </div>

        <OnlineToggle driverId={driverId} />

        {incomingOffer && (
          <RidePopup offer={incomingOffer} onAccept={() => onAccept(incomingOffer)} onReject={onReject} />
        )}

        {acceptedRide && (
          <TripControls ride={acceptedRide} onComplete={clearAccepted} />
        )}
      </div>

      <div className="mapWrap">
        <DriverMap driverId={driverId} acceptedRide={acceptedRide} />
      </div>
    </div>
  );
}
