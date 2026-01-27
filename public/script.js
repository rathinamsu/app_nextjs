const nifty50 = [
  "ADANIENT.NS","ADANIPORTS.NS","APOLLOHOSP.NS","ASIANPAINT.NS",
  "AXISBANK.NS","BAJAJ-AUTO.NS","BAJFINANCE.NS","BAJAJFINSV.NS",
  "BPCL.NS","BHARTIARTL.NS","BRITANNIA.NS","CIPLA.NS","COALINDIA.NS",
  "DIVISLAB.NS","DRREDDY.NS","EICHERMOT.NS","GRASIM.NS","HCLTECH.NS",
  "HDFCBANK.NS","HDFCLIFE.NS","HEROMOTOCO.NS","HINDALCO.NS",
  "HINDUNILVR.NS","ICICIBANK.NS","ITC.NS","INDUSINDBK.NS","INFY.NS",
  "JSWSTEEL.NS","KOTAKBANK.NS","LT.NS","LTIM.NS","M&M.NS",
  "MARUTI.NS","NESTLEIND.NS","NTPC.NS","ONGC.NS","POWERGRID.NS",
  "RELIANCE.NS","SBILIFE.NS","SBIN.NS","SUNPHARMA.NS","TCS.NS",
  "TATACONSUM.NS","TATAMOTORS.NS","TATASTEEL.NS","TECHM.NS",
  "TITAN.NS","ULTRACEMCO.NS","UPL.NS","WIPRO.NS"
];

// Populate dropdown
const select = document.getElementById("symbol");
nifty50.forEach(s => {
  const opt = document.createElement("option");
  opt.value = s;
  opt.textContent = s;
  select.appendChild(opt);
});

async function fetchData() {
  const symbol = select.value;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  let totalHigh = 0;
let successCount = 0;
let failureCount = 0;


  if (!start || !end) {
    alert("Select date range");
    return;
  }

  const res = await fetch(`/api/history?symbol=${symbol}&start=${start}&end=${end}`);
  const data = await res.json();

  const tbody = document.querySelector("#result tbody");
  tbody.innerHTML = "";

  function average(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Excel SLOPE equivalent
function slope(yValues) {
  const n = yValues.length;
  const xValues = Array.from({ length: n }, (_, i) => i + 1);

  const xAvg = average(xValues);
  const yAvg = average(yValues);

  let num = 0;
  let den = 0;

  for (let i = 0; i < n; i++) {
    num += (xValues[i] - xAvg) * (yValues[i] - yAvg);
    den += Math.pow(xValues[i] - xAvg, 2);
  }

  return den === 0 ? 0 : num / den;
}

data.forEach((d, index) => {
  const open = d.open;
  const high = d.high;
  const low = d.low;
  const close = d.close;

  const bullishDay = close > open ? 1 : 0;
  const range = high - low;
  const body = Math.abs(close - open);
  const dailyMomentum = close - open;

  let bullishPct = "-";
  let avgMomentum = "-";
  let avgRange = "-";
  let trendSlope = "-";
  let prediction = "-";

  if (index >= 9) {
    const last10 = data.slice(index - 9, index + 1);

    const bullishArr = last10.map(x => (x.close > x.open ? 1 : 0));
    const momentumArr = last10.map(x => x.close - x.open);
    const rangeArr = last10.map(x => x.high - x.low);
    const closeArr = last10.map(x => x.close);

    bullishPct = (bullishArr.reduce((a, b) => a + b, 0) / 10).toFixed(2);
    avgMomentum = average(momentumArr).toFixed(2);
    avgRange = average(rangeArr).toFixed(2);
    trendSlope = slope(closeArr).toFixed(4);

    prediction =
      bullishPct > 0.55 && avgMomentum > 0 && trendSlope > 0
        ? "HIGH PROBABILITY: CLOSE > OPEN"
        : "LOW PROBABILITY";
  }

  // ✅ CHECK NEXT DAY RESULT
  if (
    prediction === "HIGH PROBABILITY: CLOSE > OPEN" &&
    index + 1 < data.length
  ) {
    totalHigh++;

    const nextDay = data[index + 1];
    if (nextDay.close > nextDay.open) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  const tr = document.createElement("tr");

  if (prediction === "HIGH PROBABILITY: CLOSE > OPEN") {
    tr.classList.add("high-probability");
  }

  tr.innerHTML = `
    <td>${d.date.split("T")[0]}</td>
    <td>${open.toFixed(2)}</td>
    <td>${high.toFixed(2)}</td>
    <td>${low.toFixed(2)}</td>
    <td>${close.toFixed(2)}</td>
    <td>${d.volume}</td>
    <td>${bullishDay}</td>
    <td>${range.toFixed(2)}</td>
    <td>${body.toFixed(2)}</td>
    <td>${dailyMomentum.toFixed(2)}</td>
    <td>${bullishPct}</td>
    <td>${avgMomentum}</td>
    <td>${avgRange}</td>
    <td>${trendSlope}</td>
    <td>${prediction}</td>
  `;
  tbody.appendChild(tr);
});

const summary = document.getElementById("summary");

summary.innerHTML = `
📊 <u>Prediction Performance</u><br>
Total HIGH PROBABILITY signals: <b>${totalHigh}</b><br>
✅ Successful next day: <b style="color:green">${successCount}</b><br>
❌ Failed next day: <b style="color:red">${failureCount}</b><br>
🎯 Accuracy: <b>${totalHigh > 0 ? ((successCount / totalHigh) * 100).toFixed(2) : 0}%</b>
`;



}
