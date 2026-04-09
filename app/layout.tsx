import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: "Inkata. | Aplikasi Evaluasi Literasi Nasional",
  description: "Platform Infrastruktur Asesmen Literasi Cerdas Berbasis AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@100..700,0..1,-50..200,24&amp;display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-body bg-surface text-on-surface antialiased`}>
        {children}
      </body>
    </html>
  );
}
