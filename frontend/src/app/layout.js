import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Nice display font for headings; keep Geist for body text
const sora = Sora({ variable: "--font-display", subsets: ["latin"] });

export const metadata = {
  title: "Priority Tasks",
  description: "Task manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}>
        {/* animated gradient background (behind everything) */}
        <div className="gradient-bg" aria-hidden />
        {children}
      </body>
    </html>
  );
}
