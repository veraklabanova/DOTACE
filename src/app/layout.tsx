import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "DOTACE \u2013 Digit\u00e1ln\u00ed spr\u00e1va dota\u010dn\u00edch \u017e\u00e1dost\u00ed",
  description: "Intern\u00ed syst\u00e9m pro spr\u00e1vu dota\u010dn\u00edch \u017e\u00e1dost\u00ed krajsk\u00e9ho \u00fa\u0159adu",
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
