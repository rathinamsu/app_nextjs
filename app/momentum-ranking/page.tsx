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
    "TITAN.NS", "ULTRACEMCO.NS", "UPL.NS", "WIPRO.NS", "3MINDIA.NS",
    "ABB.NS", "AIAENG.NS", "APLAPOLLO.NS", "AUBANK.NS", "AAVAS.NS",
    "ABBOTINDIA.NS", "ATGL.NS", "ABCAPITAL.NS", "ABFRL.NS", "AFFLE.NS",
    "AJANTPHARM.NS", "APLLTD.NS", "ALKEM.NS", "ADANITRANS.NS", "ADANIGAS.NS",
    "AMARAJABAT.NS", "ASHOKLEY.NS", "ASTRAL.NS", "AUROPHARMA.NS", "AVENUE.NS",
    "BAJAJHLDNG.NS", "BALKRISIND.NS", "BANDHANBNK.NS", "BANKBARODA.NS",
    "BANKINDIA.NS", "BATAINDIA.NS", "BERGEPAINT.NS", "BEL.NS",
    "BHARATFORGE.NS", "BHEL.NS", "BIOCON.NS", "BOSCHLTD.NS", "CANBK.NS",
    "CHOLAFIN.NS", "COFORGE.NS", "COLPAL.NS", "CONCOR.NS", "COROMANDEL.NS",
    "CROMPTON.NS", "CUMMINSIND.NS", "DLF.NS", "DABUR.NS", "DALMIABHAI.NS",
    "DEEPAKNTR.NS", "DELIVERY.NS", "DIXON.NS", "LALPATHLAB.NS",
    "EMAMILTD.NS", "ESCORTS.NS", "FEDERALBNK.NS", "FORTIS.NS", "GAIL.NS",
    "GLAND.NS", "GODREJCP.NS", "GODREJPROP.NS", "GUJGASLTD.NS", "GSPL.NS",
    "HDFCAMC.NS", "HAVELLS.NS", "HINDHPETRO.NS", "HINDZINC.NS",
    "ICICIGI.NS", "ICICIPRULI.NS", "ICICISNBD.NS", "IDFCFIRSTB.NS",
    "INDHOTEL.NS", "IOC.NS", "IRCTC.NS", "IGL.NS", "INDUSTOW.NS",
    "INFOEDGE.NS", "JINDALSTEL.NS", "JSWENERGY.NS", "JUBLFOOD.NS",
    "L&TFH.NS", "LTTS.NS", "LICHSGFIN.NS", "LAURUSLABS.NS", "LUPIN.NS",
    "MRF.NS", "M&MFIN.NS", "MARICO.NS", "MAXIND.NS", "MAXHEALTH.NS",
    "MOTHERSUMI.NS", "MPHASIS.NS", "MUTHOOTFIN.NS", "NALCO.NS",
    "NAVINFLUOR.NS", "NSE.NS", "OIL.NS", "PIDILITIND.NS", "PNB.NS",
    "POLYCAB.NS", "PFC.NS", "PGHH.NS", "PVR.NS", "RECLTD.NS", "SRF.NS",
    "SHREECEM.NS", "SIEMENS.NS", "SONACOMS.NS", "SRTRANSFIN.NS", "SUNTV.NS",
    "SYNGENE.NS", "TATACHEM.NS", "TATACOMM.NS", "TATAELXSI.NS",
    "TATAPOWER.NS", "TORNTPHARM.NS", "TRENT.NS", "TVSMOTOR.NS",
    "UBL.NS", "UJJIVAN.NS", "VOLTAS.NS", "WHIRLPOOL.NS", "ZEEL.NS"
];

interface RankingRow {
    symbol: string;
    totalHigh: number;
    successCount: number;
    failureCount: number;
    nextDayMomentumSum: number;
    accuracy: number;
}

export default function MomentumRanking() {

    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [results, setResults] = useState<RankingRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageTitle, setPageTitle] = useState("");


    useEffect(() => {
        const today = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const title = `Momentum Ranking - ${today}`;

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

    async function scanMomentumRanking() {

        setLoading(true);
        const output: RankingRow[] = [];

        try {

            await Promise.all(nifty50.map(async (sym) => {

                const res = await fetch(`/api/history?symbol=${sym}&start=${start}&end=${end}`);
                if (!res.ok) return;

                const rawData = await res.json();
                if (!Array.isArray(rawData)) return;

                let totalHigh = 0;
                let successCount = 0;
                let failureCount = 0;
                let nextDayMomentumSum = 0;

                rawData.forEach((d: any, index: number) => {

                    if (index < 9) return;

                    const last10 = rawData.slice(index - 9, index + 1);

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

                    if (prediction && index + 1 < rawData.length) {

                        totalHigh++;

                        const nextDay = rawData[index + 1];
                        const momentum = nextDay.close - nextDay.open;

                        nextDayMomentumSum += momentum;

                        if (momentum > 0) successCount++;
                        else failureCount++;
                    }

                });

                if (totalHigh > 0) {

                    output.push({
                        symbol: sym,
                        totalHigh,
                        successCount,
                        failureCount,
                        nextDayMomentumSum,
                        accuracy: (successCount / totalHigh) * 100
                    });

                }

            }));

            // ⭐ Sort High → Low Momentum
            output.sort((a, b) => b.nextDayMomentumSum - a.nextDayMomentumSum);

            setResults(output);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: "20px" }}>



            <div>
                <h2>{pageTitle}</h2>
            </div>

            <button onClick={scanMomentumRanking} disabled={loading}>
                {loading ? "Scanning..." : "Run Ranking"}
            </button>

            <br /><br />

            <table border={1} cellPadding={5}>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Company</th>
                        <th>Total Signals</th>
                        <th>Success</th>
                        <th>Failure</th>
                        <th>Accuracy %</th>
                        <th>Momentum Sum</th>
                    </tr>
                </thead>

                <tbody>
                    {results.map((r, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{r.symbol}</td>
                            <td>{r.totalHigh}</td>
                            <td style={{ color: "green" }}>{r.successCount}</td>
                            <td style={{ color: "red" }}>{r.failureCount}</td>
                            <td>{r.accuracy.toFixed(2)}%</td>
                            <td style={{ color: r.nextDayMomentumSum >= 0 ? "green" : "red" }}>
                                {r.nextDayMomentumSum.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}
