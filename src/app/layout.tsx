import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "IMPOSTER — Nepal Edition",
  description: "Someone among you is not who they seem. A social deduction party game with 600+ Nepali and global words.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "IMPOSTER — Nepal Edition",
    description: "Find the imposter before it's too late.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
