const express = require("express");
const { getPool } = require("../db");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, price_cents, image_url, created_at FROM products ORDER BY created_at DESC LIMIT 100"
    );
    res.json({ items: rows });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Invalid id" });

    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, description, price_cents, image_url, created_at FROM products WHERE id = ?",
      [id]
    );

    const item = rows[0];
    if (!item) return res.status(404).json({ error: "Product not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, description, price_cents, image_url } = req.body || {};
    if (!name || typeof name !== "string") return res.status(400).json({ error: "name is required" });
    if (!Number.isInteger(price_cents) || price_cents < 0) return res.status(400).json({ error: "price_cents must be >= 0" });

    const pool = getPool();
    const [result] = await pool.query(
      "INSERT INTO products (name, description, price_cents, image_url) VALUES (?, ?, ?, ?)",
      [name, description || null, price_cents, image_url || null]
    );

    const id = result.insertId;
    res.status(201).json({ id });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

