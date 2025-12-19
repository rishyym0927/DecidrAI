"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
exports.disconnectMongo = disconnectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectMongo(uri, dbName) {
    // Check if already connected
    if (mongoose_1.default.connection.readyState >= 1) {
        console.log("✅ MongoDB already connected");
        return;
    }
    try {
        // Append dbName to URI if not already present
        const connectionUri = uri.includes("?")
            ? `${uri}&dbName=${dbName}`
            : `${uri}/${dbName}`;
        await mongoose_1.default.connect(connectionUri);
        console.log("✅ MongoDB connected via Mongoose");
    }
    catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        throw err;
    }
}
// Optional: Export disconnect function for graceful shutdown
async function disconnectMongo() {
    if (mongoose_1.default.connection.readyState !== 0) {
        await mongoose_1.default.disconnect();
        console.log("✅ MongoDB disconnected");
    }
}
