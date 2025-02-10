import type { Metadata } from "next";
import Sidebar from "./_components/Sidebar";

export const metadata: Metadata = {
  title: "Welcome to Shopfaster - dashboard",
  description: "Dashboard - Shopfaster",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative">
        <nav className="fixed h-[100vh] bg-gray-200 left-0 w-[20%] ">
          <Sidebar />
        </nav>
        <nav className="flex justify-end items-center p-5  bg-slate-700">
          <div className="h-5 w-5 rounded-full cursor-pointer bg-green-700 text-white flex justify-center items-center text-lg p-4">
            M
          </div>
        </nav>
        <div className=" text-white w-[80%] ml-[20%] p-5 px-9">{children}</div>
      </div>
    </>
  );
}
