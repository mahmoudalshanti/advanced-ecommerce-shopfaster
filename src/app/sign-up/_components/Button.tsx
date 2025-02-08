"use client";

import { Button } from "@/components/ui/button";
import { actionContinue } from "../_actions/actionSignup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

function ContinueButton({
  email,
  country,
  isValidEmail,
  setErrMsg,
}: {
  email: string;
  country: { name: string; flag: string };
  isValidEmail: boolean;
  errMsg: string;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleContinue = async () => {
    try {
      setLoading(true);
      const data = await actionContinue(email, country);
      setErrMsg("");
      setLoading(false);
      if (data?.redirect) {
        router.push(data.redirect);
      }
    } catch (err) {
      console.log(err, "Error message");
      err instanceof Error
        ? setErrMsg(err.message)
        : setErrMsg("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mt-2">
        <Button
          disabled={!isValidEmail || !email.length || loading}
          className="w-36 rounded-full text-base p-6 font-bold"
          onClick={handleContinue}
        >
          {loading ? <Loading /> : "Continue"}
        </Button>
      </div>
    </>
  );
}

export default ContinueButton;
