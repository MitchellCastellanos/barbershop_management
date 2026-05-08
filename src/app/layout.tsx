import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barbershop Management",
  description: "Sistema de gestión para barbería",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
