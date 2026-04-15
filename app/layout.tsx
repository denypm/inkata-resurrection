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
  title: "Inkata. | Infrastruktur Evaluasi Literasi Nasional",
  description: "Platform Infrastruktur Asesmen Literasi Cerdas Berbasis Komputasi Awan untuk Transformasi Pendidikan Indonesia.",
  keywords: ["literasi", "asesmen nasional", "pendidikan cerdas", "intelijen edukasi", "inkata"],
  authors: [{ name: "Inkata Team" }],
  openGraph: {
    title: "Inkata. | Aplikasi Evaluasi Literasi Nasional",
    description: "Infrastruktur asesmen cerdas pelopor transformasi data literasi sekolah.",
    url: "https://inkata.id",
    siteName: "Inkata.",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkata. | Aplikasi Evaluasi Literasi Nasional",
    description: "Infrastruktur asesmen cerdas pelopor transformasi data literasi sekolah.",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
