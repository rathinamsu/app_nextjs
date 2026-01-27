import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

// Assuming the original code's usage was correct for the installed version
const yahooFinance = new (YahooFinance as any)();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!symbol || !start || !end) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const data = await yahooFinance.historical(symbol, {
            period1: start,
            period2: end,
            interval: "1d"
        });

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
    }
}
