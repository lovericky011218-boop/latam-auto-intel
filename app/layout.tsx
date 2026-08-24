import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isCloudflarePages = process.env.CF_PAGES === "1";
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  (isGitHubPages
    ? `https://${process.env.GITHUB_REPOSITORY_OWNER || "github"}.github.io${publicBasePath}`
    : isCloudflarePages && process.env.CF_PAGES_URL
      ? process.env.CF_PAGES_URL
      : "https://latam-auto-intel.lovericky011218.chatgpt.site");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "东风集团主要战略市场竞品车型看板";
const description = "覆盖南美、欧洲、澳新与东南亚 25 个重点国家的中国汽车集团车型、配置价格、参数、动力、驱动、电池续航与碰撞安全评级。";
const image = `${siteOrigin}/og.png`;
const icon = `${publicBasePath}/favicon.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title,
  description,
  icons: { icon, shortcut: icon },
  openGraph: { title, description, images: [{ url: image, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
