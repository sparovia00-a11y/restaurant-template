import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased text-neutral-900" style={{ backgroundColor: "#FAF6EF" }}>
        {children}
      </body>
    </html>
  );
}
