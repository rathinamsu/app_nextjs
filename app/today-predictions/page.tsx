"use client";

import { useState, useEffect } from "react";

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
    "TITAN.NS", "ULTRACEMCO.NS", "UPL.NS", "WIPRO.NS", "3MINDIA.NS", "ABB.NS", "AIAENG.NS", "APLAPOLLO.NS", "AUBANK.NS",
    "AAVAS.NS", "ABBOTINDIA.NS", "ATGL.NS", "ABCAPITAL.NS", "ABFRL.NS",
    "AFFLE.NS", "AJANTPHARM.NS", "APLLTD.NS", "ALKEM.NS", "ADANITRANS.NS",
    "ADANIGAS.NS", "AMARAJABAT.NS", "APOLLOHOSP.NS", "ASHOKLEY.NS",
    "ASTRAL.NS", "AUROPHARMA.NS", "AVENUE.NS", "AXISBANK.NS", "BAJAJHLDNG.NS",
    "BAJFINANCE.NS", "BAJAJFINSV.NS", "BALKRISIND.NS", "BANDHANBNK.NS",
    "BANKBARODA.NS", "BANKINDIA.NS", "BATAINDIA.NS", "BERGEPAINT.NS",
    "BEL.NS", "BHARATFORGE.NS", "BHEL.NS", "BPCL.NS", "BIOCON.NS",
    "BOSCHLTD.NS", "CANBK.NS", "CHOLAFIN.NS", "COFORGE.NS", "COLPAL.NS",
    "CONCOR.NS", "COROMANDEL.NS", "CROMPTON.NS", "CUMMINSIND.NS",
    "DLF.NS", "DABUR.NS", "DALMIABHAI.NS", "DEEPAKNTR.NS", "DELIVERY.NS",
    "DIVISLAB.NS", "DIXON.NS", "DRREDDY.NS", "LALPATHLAB.NS", "EICHERMOT.NS",
    "EMAMILTD.NS", "ESCORTS.NS", "FEDERALBNK.NS", "FORTIS.NS", "GAIL.NS",
    "GLAND.NS", "GODREJCP.NS", "GODREJPROP.NS", "GRASIM.NS", "GUJGASLTD.NS",
    "GSPL.NS", "HDFCAMC.NS", "HDFCBANK.NS", "HDFCLIFE.NS", "HAVELLS.NS",
    "HEROMOTOCO.NS", "HINDALCO.NS", "HINDHPETRO.NS", "HINDUNILVR.NS",
    "HINDZINC.NS", "ICICIBANK.NS", "ICICIGI.NS", "ICICIPRULI.NS", "ICICISNBD.NS",
    "IDFCFIRSTB.NS", "INDHOTEL.NS", "IOC.NS", "IRCTC.NS", "IGL.NS",
    "INDUSTOW.NS", "INDUSINDBK.NS", "INFOEDGE.NS", "INFY.NS", "JINDALSTEL.NS",
    "JSWENERGY.NS", "JSWSTEEL.NS", "JUBLFOOD.NS", "KOTAKBANK.NS",
    "L&TFH.NS", "LTTS.NS", "LICHSGFIN.NS", "LT.NS", "LAURUSLABS.NS",
    "LUPIN.NS", "MRF.NS", "M&MFIN.NS", "M&M.NS", "MARICO.NS", "MAXIND.NS",
    "MAXHEALTH.NS", "MOTHERSUMI.NS", "MPHASIS.NS", "MUTHOOTFIN.NS",
    "NALCO.NS", "NAVINFLUOR.NS", "NESTLEIND.NS", "NSE.NS", "OIL.NS",
    "ONGC.NS", "PIDILITIND.NS", "PNB.NS", "POLYCAB.NS", "PFC.NS",
    "PGHH.NS", "POWERGRID.NS", "PVR.NS", "RECLTD.NS", "SRF.NS", "SHREECEM.NS",
    "SIEMENS.NS", "SONACOMS.NS", "SRTRANSFIN.NS", "SUNPHARMA.NS",
    "SUNTV.NS", "SYNGENE.NS", "TATACHEM.NS", "TATACOMM.NS", "TATAELXSI.NS",
    "TATAMOTORS.NS", "TATAPOWER.NS", "TATASTEEL.NS", "TECHM.NS",
    "TITAN.NS", "TORNTPHARM.NS", "TRENT.NS", "TVSMOTOR.NS", "UBL.NS",
    "UJJIVAN.NS", "UPL.NS", "VOLTAS.NS", "WHIRLPOOL.NS", "ZEEL.NS"
];

interface PredictionRow {
    symbol: string;
    date: string;
    open: number;
    close: number;
    bullishPct: string;
    avgMomentum: string;
    avgRange: string;
    trendSlope: string;
}

export default function TodayPredictions() {

    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [results, setResults] = useState<PredictionRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        const today = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const title = `Next Day Prediction "HIGH PROBABILITY" - ${today}`;

        document.title = title;
        setPageTitle(title);   // 👈 store for UI display
    }, []);

    useEffect(() => {
        const today = new Date();

        const endDate = today.toISOString().split("T")[0];

        const startDateObj = new Date();
        startDateObj.setDate(today.getDate() - 365);

        setStart(startDateObj.toISOString().split("T")[0]);
        setEnd(endDate);

    }, []);

    function average(arr: number[]) {
        if (!arr.length) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    function slope(values: number[]) {

        const n = values.length;
        const x = Array.from({ length: n }, (_, i) => i + 1);

        const xAvg = average(x);
        const yAvg = average(values);

        let num = 0;
        let den = 0;

        for (let i = 0; i < n; i++) {
            num += (x[i] - xAvg) * (values[i] - yAvg);
            den += Math.pow(x[i] - xAvg, 2);
        }

        return den === 0 ? 0 : num / den;
    }

    async function scanCompanies() {

        setLoading(true);
        const output: PredictionRow[] = [];

        try {

            await Promise.all(nifty50.map(async (sym) => {

                const res = await fetch(`/api/history?symbol=${sym}&start=${start}&end=${end}`);
                if (!res.ok) return;

                const rawData = await res.json();
                if (!Array.isArray(rawData) || rawData.length < 10) return;

                const lastIndex = rawData.length - 1;

                const last10 = rawData.slice(lastIndex - 9, lastIndex + 1);

                const bullishArr = last10.map((x: any) => (x.close > x.open ? 1 : 0));
                const momentumArr = last10.map((x: any) => x.close - x.open);
                const rangeArr = last10.map((x: any) => x.high - x.low);
                const closeArr = last10.map((x: any) => x.close);

                const bullishPct = average(bullishArr);
                const avgMomentum = average(momentumArr);
                const avgRange = average(rangeArr);
                const trendSlopeVal = slope(closeArr);

                const prediction =
                    bullishPct > 0.55 &&
                    avgRange > 55 &&
                    avgRange < 300 &&
                    avgMomentum > -15 &&
                    trendSlopeVal > -42 &&
                    trendSlopeVal < 40;

                if (prediction) {

                    const latest = rawData[lastIndex];

                    output.push({
                        symbol: sym,
                        date: latest.date.split("T")[0],
                        open: latest.open,
                        close: latest.close,
                        bullishPct: bullishPct.toFixed(2),
                        avgMomentum: avgMomentum.toFixed(2),
                        avgRange: avgRange.toFixed(2),
                        trendSlope: trendSlopeVal.toFixed(4)
                    });
                }

            }));

            setResults(output);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: "20px" }}>

            <h2>📊 {pageTitle}</h2>

            <button onClick={scanCompanies} disabled={loading}>
                {loading ? "Scanning..." : "Scan All Companies"}
            </button>

            <br /><br />

            <table border={1} cellPadding={5}>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Date</th>
                        <th>Open</th>
                        <th>Close</th>
                        <th>Bullish %</th>
                        <th>Avg Momentum</th>
                        <th>Avg Range</th>
                        <th>Trend Slope</th>
                    </tr>
                </thead>

                <tbody>
                    {results.map((r, i) => (
                        <tr key={i}>
                            <td>{r.symbol}</td>
                            <td>{r.date}</td>
                            <td>{r.open.toFixed(2)}</td>
                            <td>{r.close.toFixed(2)}</td>
                            <td>{r.bullishPct}</td>
                            <td>{r.avgMomentum}</td>
                            <td>{r.avgRange}</td>
                            <td>{r.trendSlope}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
