"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Settings,
  BarChart,
  Shirt,
  Paperclip,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
function Sidebar() {
  const [active, setActive] = useState<string>("settings");
  const router = useRouter();
  useEffect(() => {
    router.push(`/dashboard/${active}`);
  }, [active]);
  return (
    <div className="flex flex-col items-center">
      <div className="p-5 pb-0">
        <p className="font-semibold text-sm hidden md:block whitespace-nowrap text-ellipsis max-w-xl ">
          medoalshanti@gmail.com
        </p>
        <p className="text-xl text-center font-bold text-blue-950 hidden md:block">
          Manager
        </p>
      </div>
      <p
        onClick={() => setActive("dashboard")}
        className={` ${
          active === "dashboard"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        } w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "dashboard" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <LayoutDashboard className={`mr-2 ml-0 md:ml-5`} />{" "}
        <span className="max-w-none hidden md:block">Dashboard</span>{" "}
      </p>
      <p
        onClick={() => setActive("products")}
        className={` ${
          active === "products"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        } w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "products" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start`}
      >
        <Shirt className="mr-2 ml-0 md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Products</span>{" "}
      </p>
      <p
        onClick={() => setActive("orders")}
        className={`${
          active === "orders" ? "bg-slate-300 text-blue-900" : "text-slate-700"
        }
         w-full mt-5  p-2 flex hover:bg-slate-300 ${
           active !== "orders" && "hover:text-gray-600"
         }  ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <Paperclip className="mr-2 ml-0 md:ml-5 " />{" "}
        <span className="max-w-none hidden md:block">Orders</span>{" "}
      </p>
      <p
        onClick={() => setActive("users")}
        className={`${
          active === "users" ? "bg-slate-300 text-blue-900" : "text-slate-700"
        }
        w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "users" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <User className="mr-2 ml-0 md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Users</span>{" "}
      </p>
      <p
        onClick={() => setActive("staticts")}
        className={` ${
          active === "staticts"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        }
         w-full mt-5 p-2 flex hover:bg-slate-300 ${
           active !== "staticts" && "hover:text-gray-600"
         } ease-in-out cursor-pointer justify-center md:justify-start `}
      >
        <BarChart className="mr-2 ml-0 md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Staticts</span>{" "}
      </p>
      <p
        onClick={() => setActive("settings")}
        className={` ${
          active === "settings"
            ? "bg-slate-300 text-blue-900"
            : "text-slate-700"
        }
        w-full mt-5 p-2 flex hover:bg-slate-300 ${
          active !== "settings" && "hover:text-gray-600"
        } ease-in-out cursor-pointer justify-center md:justify-start`}
      >
        <Settings className="mr-2 ml-0  md:ml-5" />{" "}
        <span className="max-w-none hidden md:block">Settings</span>{" "}
      </p>
    </div>
  );
}

export default Sidebar;
