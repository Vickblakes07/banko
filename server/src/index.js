require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectDb } = require("./config/db");
const { corsOptions } = require("./config/cors");
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");

const app = express();
const port = Number(process.env.PORT) || 5000;
const host = process.env.HOST || "0.0.0.0";

app.use(cors(corsOptions()));
app.use(express.json());

app.get("/health", (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({ ok: true, database: dbConnected ? "connected" : "disconnected" });
});

app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function main() {
  // Listen first so /health works even if MongoDB is down (common cause of ERR_CONNECTION_REFUSED).
  await new Promise((resolve) => {
    app.listen(port, host, () => {
      console.log(`Banko API listening on http://127.0.0.1:${port} (bound ${host})`);
      console.log(`Health check: http://127.0.0.1:${port}/health`);
      resolve();
    });
  });

  try {
    await connectDb();
    console.log("MongoDB connected.");
  } catch (e) {
    console.error("\n!!! MongoDB connection failed — signup/login will not work until this is fixed.");
    console.error("Check MONGODB_URI in server/.env and that MongoDB is running (or use Atlas).\n");
    console.error(e.message || e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
