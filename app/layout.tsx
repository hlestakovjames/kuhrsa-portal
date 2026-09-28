import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KUHRSA Portal",
    template: "%s | KUHRSA Portal",
  },
  description:
    "KUHRSA secure member, executive and management portal.",
  icons: {
    icon: "/images/kuhrsa_logo.jpeg",
    shortcut: "/images/kuhrsa_logo.jpeg",
    apple: "/images/kuhrsa_logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
