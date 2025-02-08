"use client";

import PasswordStrengthMeter from "../../../sign-up/info/[id]/_components/PasswordStrengthMeter";
import { useEffect, useState } from "react";
import { passwordCheck } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { restPassword } from "../../_actions/actionSignIn";
import { useParams } from "next/navigation";
import ErrorMessage from "../../_components/ErrorMessage";
import { ArrowLeft, Check, Eye, EyeOff, Icon } from "lucide-react";
import Link from "next/link";
import Loading from "@/components/Loading";
import IconInput from "@/components/IconInput";

function page() {
  const [touched, setTouched] = useState<boolean>(false);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(true);

  const { token } = useParams();

  useEffect(() => {
    setIsValidPassword(passwordCheck(password).every((c) => c.met));
  }, [password, touched, setIsValidPassword]);

  useEffect(() => {
    const isValidPassword = passwordCheck(password).every(
      (c) => c.met === true
    );

    if (isValidPassword) setDisabled(false);
    else setDisabled(true);
  }, [password]);
  const handelResetPassword = async () => {
    try {
      setLoading(true);
      await restPassword(token as string, password);
      setErrMsg("");
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong!";
      setErrMsg(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <>
          <div className="font-bold text-sm text-start mb-1  max-w-sm p-5 mx-auto mt-7 border border-gray-300 rounded-lg">
            <p className=" flex items-center justify-center ">
              <Check className="text-green-700" /> Password Reset Successfully
            </p>
            <div className="flex mt-2 justify-center ">
              <Link
                href={"/sign-in"}
                className="text-sm text-gray-700 hover:underline flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign in
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="max-w-sm p-5 mx-auto mt-7 border border-gray-300 rounded-lg">
            {errMsg && <ErrorMessage errMsg={errMsg} />}
            <p className="font-bold text-sm  text-start mb-1">Reset password</p>
            <IconInput
              type={hide ? "password" : "text"}
              iconDef={Eye}
              hide={hide}
              setHide={setHide}
              iconSec={EyeOff}
              placeholder="Password"
              onFocus={() => setTouched(true)}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!isValidPassword && touched}
              className={` py-2.5 w-full border text-sm ${
                !isValidPassword && touched
                  ? "border-red-600 ring-red-500 placeholder-red-500"
                  : "border-gray-700 ring-gray-500"
              }`}
            />

            <PasswordStrengthMeter
              focus={touched}
              criteria={passwordCheck(password)}
            />
            <Button
              className="mt-5 rounded-full w-full mb-3"
              disabled={disabled || loading}
              onClick={handelResetPassword}
            >
              {loading ? <Loading /> : "Rest password"}
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default page;
