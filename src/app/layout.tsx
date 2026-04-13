import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluê",
  description: "Your AI Language Coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white font-body text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
