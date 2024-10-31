import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import LayoutPage from "@/components/admin/Layout";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bualuang Securities Staff Information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <LayoutPage>{children}</LayoutPage>
      </body>
    </html>
  );
}
