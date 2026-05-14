require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const { pingDb } = require("./db");
const productsRouter = require("./routes/products");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

// Serve the frontend (simple 3-tier demo)
app.use("/", express.static(path.join(__dirname, "..", "..", "frontend")));

app.get("/api/health", async (req, res) => {
  try {
    await pingDb();
    res.json({ ok: true, db: "up" });
  } catch (e) {
    res.status(500).json({ ok: false, db: "down", error: String(e && e.message ? e.message : e) });
  }
});

app.use("/api/products", productsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = Number(err && err.status ? err.status : 500);
  res.status(status).json({ error: err && err.message ? err.message : "Server error" });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://0.0.0.0:${port}`);
});

