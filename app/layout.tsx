import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/shared/Sidebar";

export const metadata: Metadata = {
  title: "ELIOS Media OS",
  description: "AI Media Operating System — SPCL-engineered content at volume",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-area">{children}</main>
        </div>
      </body>
    </html>
  );
}
