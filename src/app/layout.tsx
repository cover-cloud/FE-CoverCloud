import type { Metadata } from "next";
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
    default: "cover-cloud | 커버 공유 플랫폼",
    template: "%s | cover-cloud",
  },
  description: "노래 커버를 공유하고 감상하는 플랫폼입니다.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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

              <Box className="bg-zinc-50 font-sans min-h-screen">
                <main className="max-w-7xl mx-auto py-8 px-4 sx:px-6 md:px-12">
                  {children}

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
