import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

async function fetchData() {
  const data = await yahooFinance.historical(
    "ICICIBANK.NS",
    {
      period1: "2023-01-01",
      period2: "2024-01-01",
      interval: "1d"
    }
  );

  console.log(data);
}

fetchData();
