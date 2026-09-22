import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dawngamsung.vercel.app"),
  title: "새벽 감성 - 24시 카페",
  description: "늦은 시간에도 갈 수 있는 24시 카페만 모아 찾아보는 지도",
  keywords: ["24시", "24시카페", "무인카페", "새벽감성", "밤카페", "카공"],
  openGraph: {
    title: "새벽 감성 - 24시 카페",
    description: "늦은 시간에도 갈 수 있는 24시 카페만 모아 찾아보는 지도",
    siteName: "새벽 감성",
    images: [{ url: "/logo.png", width: 600, height: 450 }],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${pretendard.className}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
