"use client";

import { useState } from "react";

const nifty50 = [
    "ADANIENT.NS", "ADANIPORTS.NS", "APOLLOHOSP.NS", "ASIANPAINT.NS",
    "AXISBANK.NS", "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS",
    "BPCL.NS", "BHARTIARTL.NS", "BRITANNIA.NS", "CIPLA.NS", "COALINDIA.NS",
    "DIVISLAB.NS", "DRREDDY.NS", "EICHERMOT.NS", "GRASIM.NS", "HCLTECH.NS",
    "HDFCBANK.NS", "HDFCLIFE.NS", "HEROMOTOCO.NS", "HINDALCO.NS",
    "HINDUNILVR.NS", "ICICIBANK.NS", "ITC.NS", "INDUSINDBK.NS", "INFY.NS",
    "JSWSTEEL.NS", "KOTAKBANK.NS", "LT.NS", "LTIM.NS", "M&M.NS",
    "MARUTI.NS", "NESTLEIND.NS", "NTPC.NS", "ONGC.NS", "POWERGRID.NS",
    "RELIANCE.NS", "SBILIFE.NS", "SBIN.NS", "SUNPHARMA.NS", "TCS.NS",
    "TATACONSUM.NS", "TATAMOTORS.NS", "TATASTEEL.NS", "TECHM.NS",
    "TITAN.NS", "ULTRACEMCO.NS", "UPL.NS", "WIPRO.NS"
];

interface StockData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    // Computed fields
    bullishDay: number;
    range: string;
    body: string;
    dailyMomentum: string;
    bullishPct: string;
    avgMomentum: string;
    avgRange: string;
    trendSlope: string;
    prediction: string;
}

export default function Home() {
    const [symbol, setSymbol] = useState(nifty50[0]);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [tableData, setTableData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<{ totalHigh: number; successCount: number; failureCount: number } | null>(null);

    function average(arr: number[]) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    function slope(yValues: number[]) {
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

    async function fetchData() {
        if (!start || !end) {
            alert("Select date range");
            return;
        }

        setLoading(true);
        setTableData([]);
        setSummary(null);

        try {
            const res = await fetch(`/api/history?symbol=${symbol}&start=${start}&end=${end}`);
            if (!res.ok) throw new Error("Failed to fetch data");
            const data = await res.json();

            if (Array.isArray(data)) {
                processData(data);
            } else {
                alert("Invalid data received");
            }
        } catch (error) {
            console.error(error);
            alert("Error fetching data");
        } finally {
            setLoading(false);
        }
    }

    function processData(rawData: any[]) {
        const processed: StockData[] = [];
        let totalHigh = 0;
        let successCount = 0;
        let failureCount = 0;

        rawData.forEach((d, index) => {
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

            // Prediction Logic
            if (index >= 9) {
                const last10 = rawData.slice(index - 9, index + 1);

                const bullishArr = last10.map((x: any) => (x.close > x.open ? 1 : 0));
                const momentumArr = last10.map((x: any) => x.close - x.open);
                const rangeArr = last10.map((x: any) => x.high - x.low);
                const closeArr = last10.map((x: any) => x.close);

                bullishPct = (bullishArr.reduce((a: number, b: number) => a + b, 0) / 10).toFixed(2);
                avgMomentum = average(momentumArr).toFixed(2);
                avgRange = average(rangeArr).toFixed(2);
                trendSlope = slope(closeArr).toFixed(4);

                prediction =
                    parseFloat(bullishPct) > 0.55 && parseFloat(avgMomentum) > 0 && parseFloat(trendSlope) > 0
                        ? "HIGH PROBABILITY: CLOSE > OPEN"
                        : "LOW PROBABILITY";
            }

            // Check next day result
            if (prediction === "HIGH PROBABILITY: CLOSE > OPEN" && index + 1 < rawData.length) {
                totalHigh++;
                const nextDay = rawData[index + 1];
                if (nextDay.close > nextDay.open) {
                    successCount++;
                } else {
                    failureCount++;
                }
            }

            // Formatting dates
            const dateStr = typeof d.date === 'string' ? d.date.split("T")[0] : new Date(d.date).toISOString().split("T")[0];

            processed.push({
                date: dateStr,
                open,
                high,
                low,
                close,
                volume: d.volume,
                bullishDay,
                range: range.toFixed(2),
                body: body.toFixed(2),
                dailyMomentum: dailyMomentum.toFixed(2),
                bullishPct,
                avgMomentum,
                avgRange,
                trendSlope,
                prediction
            });
        });

        setTableData(processed);
        setSummary({ totalHigh, successCount, failureCount });
    }

    return (
        <div>
            <h2>NIFTY 50 Historical Data</h2>

            <div style={{ marginBottom: "15px" }}>
                <label>Company: </label>
                <select value={symbol} onChange={(e) => setSymbol(e.target.value)} style={{ marginRight: "10px" }}>
                    {nifty50.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <label>Start Date: </label>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ marginRight: "10px" }} />

                <label>End Date: </label>
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{ marginRight: "10px" }} />

                <button onClick={fetchData} disabled={loading}>
                    {loading ? "Fetching..." : "Fetch"}
                </button>
            </div>

            <table id="result">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                        <th>Bullish Day</th>
                        <th>Range</th>
                        <th>Body</th>
                        <th>Daily Momentum</th>
                        <th>Bullish %</th>
                        <th>Avg Momentum</th>
                        <th>Avg Range</th>
                        <th>Trend Slope</th>
                        <th>Next Day Prediction</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, idx) => (
                        <tr key={idx} className={row.prediction === "HIGH PROBABILITY: CLOSE > OPEN" ? "high-probability" : ""}>
                            <td>{row.date}</td>
                            <td>{row.open.toFixed(2)}</td>
                            <td>{row.high.toFixed(2)}</td>
                            <td>{row.low.toFixed(2)}</td>
                            <td>{row.close.toFixed(2)}</td>
                            <td>{row.volume}</td>
                            <td>{row.bullishDay}</td>
                            <td>{row.range}</td>
                            <td>{row.body}</td>
                            <td>{row.dailyMomentum}</td>
                            <td>{row.bullishPct}</td>
                            <td>{row.avgMomentum}</td>
                            <td>{row.avgRange}</td>
                            <td>{row.trendSlope}</td>
                            <td>{row.prediction}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {summary && (
                <div id="summary" style={{ marginTop: "15px", fontWeight: "bold" }}>
                    <div>📊 <u>Prediction Performance</u></div>
                    <div>Total HIGH PROBABILITY signals: <b>{summary.totalHigh}</b></div>
                    <div>✅ Successful next day: <b style={{ color: "green" }}>{summary.successCount}</b></div>
                    <div>❌ Failed next day: <b style={{ color: "red" }}>{summary.failureCount}</b></div>
                    <div>🎯 Accuracy: <b>{summary.totalHigh > 0 ? ((summary.successCount / summary.totalHigh) * 100).toFixed(2) : 0}%</b></div>
                </div>
            )}
        </div>
    );
}
