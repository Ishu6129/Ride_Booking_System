require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;  
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db();  
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.log("❌ MongoDB Connection Error:", error);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };
