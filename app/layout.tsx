import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TOM-portalen – Target Operating Model Intervjuverktøy",
  description:
    "Strukturert intervjuverktøy for TOM-prosessen med AI-drevet analyse og automatisk rapportgenerering",
  keywords: "TOM, Target Operating Model, intervju, analyse, rapport, AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
