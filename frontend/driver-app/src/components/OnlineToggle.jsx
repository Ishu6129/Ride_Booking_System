import React from "react";

export default function OnlineToggle({ online, onOnline, onOffline }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        onClick={() => (online ? onOffline() : onOnline())}
        className={`btn ${online ? "btn-offline" : "btn-online"}`}
      >
        {online ? "Go Offline" : "Go Online"}
      </button>
    </div>
  );
}