import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Imposter Nepal Edition - Social Deduction Party Game",
  description: "Nepal's ultimate party game! Pass the phone, find the imposter. 422+ Nepal words, food, festivals, and slang. Play Pass & Play or Online with friends.",
  keywords: ["imposter", "nepal", "party game", "social deduction", "among us", "pass and play", "momo", "dal bhat"],
  openGraph: {
    title: "Imposter Nepal Edition",
    description: "Pass the phone, find the imposter! Nepal's social deduction party game.",
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
      <body className="min-h-screen bg-imposter-dark">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
