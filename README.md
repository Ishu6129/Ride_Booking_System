project: "Ride Booking System"
status: "Fully Working Locally"
deployment: "Not Deployed"
maps_used: "Leaflet + OpenStreetMap (Free, No API Key Required)"

repository: "https://github.com/Ishu6129/Ride_Booking_System"

team:
  - member_1: "Rider Frontend"
  - member_2: "Driver Frontend"
  - member_3: "Backend (REST API)"
  - member_4: "WebSocket Developer"
  - member_5: "Database + Integration"

problem_statement:
  description: >
    Build a real-time ride-hailing system where Riders can request rides,
    Drivers receive and accept ride requests, and both sides experience
    live location tracking through WebSockets.

features:
  rider_features:
    - "Request a ride"
    - "Live driver tracking"
    - "Driver found notification"
    - "Trip start/complete updates"
  driver_features:
    - "Go online/offline"
    - "Receive ride offers"
    - "Accept ride"
    - "Simulated live movement"
    - "Trip start/complete"
  backend_features:
    - "Nearest driver matching"
    - "Haversine distance calculation"
    - "Socket.io real-time communication"
  database_features:
    - "Ride storage"
    - "Driver location updates"
    - "Status updates"
    - "MongoDB Atlas integration"

tech_stack:
  frontend:
    - React
    - Leaflet (OpenStreetMap)
    - Socket.io-client
    - Axios
  backend:
    - Node.js
    - Express.js
    - Socket.io
    - MongoDB Atlas (Mongoose)
  environment:
    - "All services run locally"
    - "Rider App: http://localhost:3000"
    - "Driver App: http://localhost:3001"
    - "Backend: http://localhost:5000"

folder_structure: |
  Ride_Booking_System/
  ├── backend/
  │   ├── server.js
  │   ├── .env.example
  │   ├── config/
  │   │   └── db.js
  │   ├── models/
  │   │   ├── Driver.js
  │   │   ├── Ride.js
  │   │   └── User.js
  │   ├── services/
  │   ├── socket/
  │   │   ├── index.js
  │   │   ├── socketManager.js
  │   │   ├── inMemoryStore.js
  │   │   └── utils.js
  │   
  ├── rider-frontend/
  ├── driver-frontend/
  └── README.md

setup:
  clone_repo: "git clone https://github.com/Ishu6129/Ride_Booking_System.git"
  backend:
    steps:
      - "cd backend"
      - "npm install"
      - "cp .env.example .env"
      - "npm start"
    env_variables:
      MONGO_URI: "your_mongodb_atlas_link"
      PORT: "5000"

  rider_frontend:
    steps:
      - "cd rider-frontend"
      - "npm install"
      - "npm start"
    runs_on: "http://localhost:3000"

  driver_frontend:
    steps:
      - "cd driver-frontend"
      - "npm install"
      - "npm start"
    runs_on: "http://localhost:3001"

socket_events:
  rider_to_server:
    - "rider_join"
    - "ride_request"

  server_to_rider:
    - "ride_searching"
    - "driver_found"
    - "driver_location_update"
    - "trip_started"
    - "trip_completed"

  driver_to_server:
    - "driver_online"
    - "ride_accept"
    - "driver_location"
    - "trip_started"
    - "trip_completed"
    - "driver_offline"

  server_to_driver:
    - "ride_offer"

database_schema:
  driver:
    - driverId
    - lat
    - lng
    - online
  ride:
    - rideId
    - riderId
    - driverId
    - pickup: {lat, lng}
    - drop: {lat, lng}
    - fareEstimate
    - status: ["requested", "accepted", "started", "completed"]

local_testing_steps:
  - "Start backend on port 5000"
  - "Start Rider frontend on port 3000"
  - "Start Driver frontend on port 3001"
  - "Driver → Go Online"
  - "Rider → Request Ride"
  - "Driver receives popup → Accept Ride"
  - "Driver movement auto-simulates"
  - "Rider sees live tracking"
  - "Driver → Start Trip → Complete Trip"

git_workflow:
  rules:
    - "Each member creates feature branch"
    - "No direct commit to main"
    - "Every task merged via Pull Request"
    - "At least 2 reviewers required"
  branch_format: "feature-<name>-<task>"

project_status:
  frontends: "Complete"
  backend: "Complete"
  websockets: "Working"
  database: "Working"
  deployment: "Not deployed"
  documentation: "Complete"

conclusion: >
  The Ride Booking System is a fully functional real-time ride-hailing
  project built with React, Node.js, Socket.io, MongoDB, and Leaflet.
  All features work perfectly on local setup and fulfill exam
  requirements for real-time full-stack development.
