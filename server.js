import express from "express";
import YahooFinance from "yahoo-finance2";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const yahooFinance = new YahooFinance();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API to fetch historical data
app.get("/api/history", async (req, res) => {
  try {
    const { symbol, start, end } = req.query;

    if (!symbol || !start || !end) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const data = await yahooFinance.historical(symbol, {
      period1: start,
      period2: end,
      interval: "1d"
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

app.use(express.static("public"));
