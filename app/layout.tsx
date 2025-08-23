import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Title",
  description: "Accessible Next.js starter with tabs, dark mode, cookies",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main id="main" className="container min-h-screen bg-[--background] text-[--foreground] transition-colors" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}