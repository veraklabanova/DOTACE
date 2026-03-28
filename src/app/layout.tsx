import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DOTACE – Digitální správa dotačních žádostí",
  description: "Interní systém pro správu dotačních žádostí krajského úřadu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased bg-slate-50 text-slate-900">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
