import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";
// import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Title",
  description: "Accessible Next.js starter with tabs, dark mode, cookies",
};

const STUDENT_NAME = "Your Name";
const STUDENT_NUMBER = "S1234567";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="light">
      <body>
        {/* <Header studentNumber={STUDENT_NUMBER} /> */}
        <main id="main" className="container min-h-screen bg-[--background] text-[--foreground] transition-colors" role="main">
          {children}
        </main>
        {/* <Footer studentName={STUDENT_NAME} studentNumber={STUDENT_NUMBER} /> */}
      </body>
    </html>
  );
}