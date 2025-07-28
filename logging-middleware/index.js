const express = require("express");
const dotenv = require("dotenv");
const Log = require("./logger");
const { shortUrlMap } = require("./short");
const crypto = require("crypto");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || `http://localhost:${PORT}`;

app.use(express.json());
const generateShortcode = () => crypto.randomBytes(3).toString("hex");

app.post("/shorturls", async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    await Log("backend", "error", "shorturl-create", "Invalid or missing URL");
    return res.status(400).json({ error: "Invalid or missing URL" });
  }
  let code = shortcode;
  if (code && shortUrlMap[code]) {
    await Log("backend", "warn", "shorturl-create", `Custom shortcode '${code}' is already in use`);
    return res.status(409).json({ error: "Shortcode already exists" });
  }
  if (!code) {
    do {
      code = generateShortcode();
    } while (shortUrlMap[code]);
  }
  const expiry = new Date(Date.now() + validity * 60 * 1000); // validity in minutes
  shortUrlMap[code] = {
    url,
    expiry,
    hits: 0
  };
  await Log("backend", "info", "shorturl-create", `Short URL created for ${url} → ${code}`);
  return res.status(201).json({
    shortlink: `${HOST}/${code}`,
    expiry: expiry.toISOString()
  });
});

app.get("/shorturls/:shortcode", async (req, res) => {
  const { shortcode } = req.params;
  const data = shortUrlMap[shortcode];

  if (!data) {
    await Log("backend", "error", "shorturl-stat", `Shortcode '${shortcode}' not found`);
    return res.status(404).json({ error: "Shortcode not found" });
  }

  await Log("backend", "info", "shorturl-stat", `Stats fetched for shortcode '${shortcode}'`);

  return res.status(200).json({
    original_url: data.url,
    expiry: data.expiry.toISOString(),
    hits: data.hits
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${HOST}`);
});
