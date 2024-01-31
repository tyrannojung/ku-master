import type { Metadata,Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_DEFAULT_TITLE = "My Awesome PWA App";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  icons: {
    shortcut: "/favicon.ico",
    apple: [
      {
        url: '/icons/splashscreens/iphone5_splash.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        rel: 'apple-touch-startup-image',
      },
      {
        url: '/icons/splashscreens/iphone6_splash.png',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
        rel: 'apple-touch-startup-image',
      },
      {
        url: '/icons/splashscreens/iphoneplus_splash.png',
        media:
          '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        rel: 'apple-touch-startup-image',
      },
      {
        url: '/icons/splashscreens/iphonex_splash.png',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
        rel: 'apple-touch-startup-image',
      },
      {
        url: '/icons/splashscreens/ipad_splash.png',
        media:
          '(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
        rel: 'apple-touch-startup-image',
      },
      {
        url: '/icons/splashscreens/ipadpro1_splash.png',
        media:
          '(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
        rel: 'apple-touch-startup-image',
      },
      {
        url: '/icons/splashscreens/ipadpro2_splash.png',
        media:
          '(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
        rel: 'apple-touch-startup-image',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
