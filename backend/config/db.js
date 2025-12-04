const mongoose = require("mongoose");

let dbConnection = null;

async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI missing in .env");
        process.exit(1);
    }

    try {
        dbConnection = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Error:", error.message);
        process.exit(1);
    }
}

function getDB() {
    return dbConnection;
}

module.exports = { connectDB, getDB };
