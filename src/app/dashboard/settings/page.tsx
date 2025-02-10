import React from "react";
import getSupervisor from "../_components/getSupervisor";
import ReplaceEmail from "./_components/ReplaceEmail";
import { actionPaginationTabel } from "../_actions/actionDashboard";
import ManagerInfo from "./_components/ManagerInfo";

async function Page() {
  let currentPage;
  let supervisor;

  try {
    currentPage = await actionPaginationTabel(1);
  } catch (err) {
    currentPage = null;
  }

  try {
    supervisor = await getSupervisor();
  } catch (err) {
    supervisor = null;
  }

  return (
    <div>
      <div className="w-full max-w-md p-4">
        <p className="text-2xl font-semibold text-black">Account Profile</p>
        <div className="mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="h-16 w-16 rounded-full cursor-pointer bg-green-700 text-white flex justify-center items-center text-3xl">
              {supervisor?.email?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-base font-medium text-black">
                Email:{" "}
                <span className="ml-1 font-bold">{supervisor?.email}</span>
              </p>
              <p className="text-base font-medium text-black">
                Role: <span className="ml-1 font-bold">{supervisor?.role}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-16">
        <p className="text-2xl font-semibold text-black mb-5">
          Account Settings
        </p>
        <ReplaceEmail
          supervisor={supervisor || { email: "", id: "", role: "" }}
        />

        <p className="text-2xl font-semibold text-black mt-14 mb-5">
          Manager Settings
        </p>
        {supervisor?.role === "admin" && (
          <ManagerInfo
            pagesServer={currentPage?.pages}
            supervisor={supervisor}
            countServer={currentPage?.count}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
