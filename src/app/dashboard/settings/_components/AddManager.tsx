"use client";

import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { actionAddManager } from "../../_actions/actionDashboard";
import Loading from "@/components/Loading";
import { Manager } from "./ManagerInfo";
import { Plus } from "lucide-react";

function AddManager({
  supervisor,
  setManagers,
  page,
}: {
  supervisor: { email: string | null; id: string | null; role: string | null };
  setManagers: React.Dispatch<React.SetStateAction<Manager[]>>;
  page: number;
}) {
  const [email, setEmail] = useState<string>(supervisor?.email || "");
  const [errMsg, setErrMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const handelAddManager = async () => {
    try {
      setLoading(true);

      const newManager = await actionAddManager(email);
      setEmail("");
      if (emailRef.current) {
        emailRef.current.value = "";
      }

      if (page === 1)
        setManagers((prev) => {
          let updatedManagers = [...prev, newManager].sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          );

          if (prev.length >= 3) {
            updatedManagers = updatedManagers.slice(0, -1);
          }

          return updatedManagers;
        });

      setErrMsg("");
      setLoading(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <p className="text-slate-800  font-semibold">
        Add new <span className="text-slate-900 font-bold">Manager</span> email
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
        <Input
          ref={emailRef}
          placeholder="Email"
          className="w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          className="w-full sm:w-32"
          disabled={loading || !email.length || supervisor.email === email}
          onClick={handelAddManager}
        >
          {loading ? (
            <Loading />
          ) : (
            <p className="flex items-center">
              <Plus className="mr-1 size-4 " />
              Add
            </p>
          )}
        </Button>
      </div>
      {errMsg && (
        <p className="text-red-500 font-semibold text-sm">{errMsg}.</p>
      )}
    </div>
  );
}

export default AddManager;
