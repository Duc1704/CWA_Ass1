import "./globals.css";
import type { Metadata } from "next";
import { STUDENT_NUMBER } from "./constants";

export const metadata: Metadata = {
  title: "Title",
  description: "Accessible Next.js starter with tabs, dark mode, cookies",
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="fixed top-3 left-3 z-50 select-none" aria-label="Student Number">
          <span className="rounded-md px-2 py-1 text-xs font-semibold border shadow-sm" style={{
            background: 'var(--background)',
            color: 'var(--foreground)',
            borderColor: 'rgba(128,128,128,0.35)'
          }}>
            {STUDENT_NUMBER}
          </span>
        </div>

        <main id="main" className="container min-h-screen bg-[--background] text-[--foreground] transition-colors" role="main">
          {children}
        </main>
       
      </body>
    </html>
  );
}