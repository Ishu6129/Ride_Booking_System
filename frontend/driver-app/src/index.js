import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
// Leaflet images fix
import "leaflet/dist/leaflet.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
