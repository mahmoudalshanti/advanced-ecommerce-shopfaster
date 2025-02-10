import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - dashboard",
  description: "Dashboard - Shopfaster",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
