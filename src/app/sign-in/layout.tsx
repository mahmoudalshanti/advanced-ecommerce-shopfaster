import FloatingShape from "@/components/FloatingShape";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to Shopfaster - Sign in",
  description: "Sign in page - Shopfaster",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden relative ">
      <FloatingShape
        color="bg-lime-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-red-600"
        size="w-48 h-48"
        top="60%"
        left="70%"
        delay={5}
      />
      <FloatingShape
        color="bg-red-700"
        size="w-32 h-32"
        top="40%"
        left="10%"
        delay={2}
      />
      <div className="p-5 mt-7 h-[82vh]">
        <p className="max-w-md p-5 pb-2 mx-auto text-center font-bold text-2xl  ">
          Shopfaster
        </p>
        {children}
      </div>

      <div className="h-0.5 w-full bg-gray-300 mt-24"></div>

      <div className="max-w-sm mt-5 mx-auto flex justify-center p-4 pb-0 ">
        <Link
          href={"/sign-in"}
          className="text-blue-900 text-sm hover:text-gray-800 cursor-pointer "
        >
          Conditions of Use
        </Link>
        <Link
          href={"/sign-in"}
          className="text-blue-900 text-sm hover:text-gray-800  cursor-pointer mx-5"
        >
          Privacy Notice
        </Link>

        <Link
          href={"/sign-in"}
          className="text-blue-900 text-sm hover:text-gray-800  cursor-pointer "
        >
          Help
        </Link>
        <Link
          href={"/admin"}
          className="text-blue-900 text-sm hover:text-gray-800  cursor-pointer  ml-5"
        >
          Admin
        </Link>
      </div>
      <p className=" max-w-sm mt-2 text-center mx-auto text-sm text-gray-600 pt-0 p-4">
        © 1996-2025, Shopfaster.com, Inc. or its affiliates
      </p>
    </div>
  );
}
