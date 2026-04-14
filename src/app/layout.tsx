import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import QueryProvider from "./lib/providers/QueryProvider";
import MuiProvider from "./lib/providers/MuiProvider";
import Box from "@mui/material/Box";
import ClientModalRender from "../components/modal/ClientModalRender";
import Footer from "../components/Footer";
import AuthInit from "@/components/auth/AuthInit";
import GlobalSnackbar from "@/components/GlobalSnackbar";
import ClientOnlyWrapper from "@/components/ClientOnlyWrapper";
import ScrollToTop from "@/app/utils/scrollToTop";
import Script from "next/script";
import MaintenanceModal from "@/components/modal/MaintenanceModal";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "커버클라우드 | covercloud - 노래 커버 공유 플랫폼",
    template: "%s | covercloud",
  },
  description:
    "커버클라우드 - 노래 커버를 공유하고 감상하는 플랫폼입니다. 나만의 커버를 올리고 다른 사람들의 커버를 감상해보세요.",
  keywords: [
    "커버클라우드",
    "covercloud",
    "노래 커버",
    "커버 공유",
    "음악 커버",
  ],
  openGraph: {
    title: "커버클라우드 | covercloud",
    description: "노래 커버를 공유하고 감상하는 플랫폼",
    url: "https://covercloud.kr",
    siteName: "커버클라우드",
    locale: "ko_KR",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "covercloud",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceWorkerRegister />
        <Script
          src="https://developers.kakao.com/sdk/js/kakao.js"
          strategy="beforeInteractive"
        />
        <QueryProvider>
          <AuthInit>
            <MuiProvider>
              <ClientOnlyWrapper>
                <Header />
              </ClientOnlyWrapper>

              <Box className="font-sans min-h-screen">
                <main className="max-w-7xl mx-auto md:py-8 px-4 sx:px-6 md:px-12">
                  {children}
                  {/* <MaintenanceModal /> */}
                  <ClientModalRender />
                </main>
                <Footer />
              </Box>
              <GlobalSnackbar />
            </MuiProvider>
            <ScrollToTop />
          </AuthInit>
        </QueryProvider>
      </body>
    </html>
  );
}
