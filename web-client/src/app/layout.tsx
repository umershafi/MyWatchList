/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./navbar/navbar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "TheSocialNetwork",
  description: "social network for movie lovers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
          <Navbar />
            <Suspense>
              {children}
            </Suspense>
      </body>
    </html>
  );
}

