import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Walk check-in",
  description: "Start a walk with an arrival time. If you don't tap \"I'm home\" by then, your friend's page turns red.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="bg-foreground px-4 py-2 text-center text-sm text-background">
          Demo only. Please don&apos;t use this for real walks.
        </div>
        {children}
      </body>
    </html>
  );
}
