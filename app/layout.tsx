import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "NIFTY 50 Historical Data",
    description: "NIFTY 50 Historical Data Analysis",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
