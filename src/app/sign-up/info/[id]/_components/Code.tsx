"use client";

import { reSendCode } from "@/app/sign-up/_actions/actionSignup";
import Input from "@/components/Input";
import { useParams } from "next/navigation";
import { useState } from "react";

function Code({
  code,
  setCode,
}: {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [focus, setFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();

  const handleResend = async () => {
    try {
      setLoading(true);
      await reSendCode(id as string);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between w-full mt-2 min-w-0">
        {/* Input field taking 80% width */}
        <div className="w-[80%]">
          <Input
            placeholder="Code"
            type="text"
            className={`py-3 w-full ${
              focus && !code.length
                ? "border-red-600 ring-red-500 placeholder-red-500"
                : "border-gray-700 ring-gray-500"
            }`}
            onChange={(e) => setCode(e.target.value)}
            onFocus={() => setFocus(true)}
          />
        </div>

        {/* Resend link taking 15% width */}
        <p
          className="w-[15%] text-gray-500 underline mr-3 font-medium text-sm cursor-pointer text-end whitespace-nowrap"
          onClick={handleResend}
        >
          {loading ? "Resending..." : "Resend"}
        </p>
      </div>

      {/* Error message when input is empty */}
      {focus && !code.length && (
        <p className="text-sm font-semibold text-red-600">Invalid code</p>
      )}
    </>
  );
}

export default Code;
