import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to Shopfaster - Sign up",
  description: "Sign up page - Shopfaster",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
