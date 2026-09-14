import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text-primary)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
