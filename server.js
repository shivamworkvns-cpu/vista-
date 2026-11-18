require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ---- MongoDB ----
// The UI can still be opened locally when MongoDB has not been configured.
const memoryStore = new Map();
let databaseReady = false;
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      databaseReady = true;
      console.log("MongoDB connected");
    })
    .catch(err => console.error("MongoDB connection failed:", err.message));
} else {
  console.warn("MONGO_URI is not set. Running with temporary in-memory data.");
}

const Site = mongoose.model(
  "Site",
  new mongoose.Schema(
    { siteId: { type: String, required: true, unique: true }, data: { type: Object, default: {} } },
    { timestamps: true, minimize: false }
  )
);

// ---- Simple password protection ----
function auth(req, res, next) {
  const email = String(req.headers["x-admin-email"] || "").trim().toLowerCase();
  const expectedEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!process.env.API_KEY || !expectedEmail || email !== expectedEmail || req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ---- API ----
app.get("/api/site/:id", auth, async (req, res) => {
  try {
    if (!databaseReady) return res.json(memoryStore.get(req.params.id) || null);
    const doc = await Site.findOne({ siteId: req.params.id });
    res.json(doc ? doc.data : null);
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

app.put("/api/site/:id", auth, async (req, res) => {
  try {
    if (!databaseReady) {
      memoryStore.set(req.params.id, req.body);
      return res.json({ ok: true, temporary: true });
    }
    await Site.findOneAndUpdate(
      { siteId: req.params.id },
      { data: req.body },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: "Server error" }); }
});

app.get("/health", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
