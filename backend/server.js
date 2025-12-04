const express = require("express");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const { connectDB, getDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

connectDB();

// ----------------------
//  REST API
// ----------------------
app.get("/", (req, res) => {
    res.send("Ride Booking Backend Running (Member 3)");
});

// Create Ride Request (RIDER)
app.post("/ride/request", async (req, res) => {
    try {
        const db = getDB();

        const ride = {
            riderName: req.body.riderName,
            pickup: req.body.pickup,
            drop: req.body.drop,
            status: "pending",
            time: new Date()
        };

        const result = await db.collection("rides").insertOne(ride);
        ride._id = result.insertedId;

        // Notify all drivers
        io.emit("new_ride_request", ride);

        res.json({ success: true, message: "Ride Request Created", ride });

    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// ----------------------
//  SOCKET.IO EVENTS
// ----------------------
io.on("connection", socket => {
    console.log("User connected:", socket.id);

    // Driver Accepts Ride
    socket.on("driver_accept", async (data) => {
        const db = getDB();

        await db.collection("rides").updateOne(
            { _id: data.rideId },
            {
                $set: {
                    driverId: data.driverId,
                    driverName: data.driverName,
                    status: "accepted"
                }
            }
        );

        io.emit("ride_accepted", data);
    });

    // Driver location update
    socket.on("driver_location_update", (data) => {
        io.emit("driver_location", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
