"use client";

import Input from "@/components/Input";
import Link from "next/link";
import { useState } from "react";
import { actionSignin } from "./_actions/actionSignIn";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import ErrorMessage from "./_components/ErrorMessage";
import { useRouter } from "next/navigation";
import { emailCheck } from "@/lib/utils";
import IconInput from "@/components/IconInput";
import { Eye, EyeOff } from "lucide-react";

function page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");
  const router = useRouter();
  const [hide, setHide] = useState<boolean>(true);

  const handelSignIn = async () => {
    try {
      setLoading(true);
      const data = await actionSignin(email, password);
      setErrMsg("");
      setLoading(false);

      if (data?.redirect) {
        router.push(data.redirect);
      }
    } catch (err) {
      err instanceof Error
        ? setErrMsg(err.message)
        : setErrMsg("Something went wrong!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="font-semibold text-sm mt-0 text-center mx-auto mb-1 text-gray-600 z-10">
        Daily recommended products and faster delivery.
      </p>

      <div className="max-w-sm p-5 mx-auto mt-7 border border-gray-300 rounded-lg">
        <p className="font-bold text-xl mt-3 mb-2">Sign in</p>
        {errMsg && <ErrorMessage errMsg={errMsg} />}
        <p className="font-bold text-sm mt-3">
          Email and password are required
        </p>
        <Input
          className=" mt-1 font-semibold w-full"
          placeholder="Email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <IconInput
          type={hide ? "password" : "text"}
          iconDef={Eye}
          hide={hide}
          setHide={setHide}
          iconSec={EyeOff}
          placeholder="Password"
          className="mt-3 w-full font-semibold"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="mt-5 rounded-full w-full mb-3"
          onClick={handelSignIn}
          disabled={
            loading || !email.length || !password.length || !emailCheck(email)
          }
        >
          {loading ? <Loading /> : "Sign in"}
        </Button>

        <Link
          href={"/sign-in/rest-password/verify-email"}
          className="underline font-medium text-sm  hover:text-gray-800"
        >
          Forget password
        </Link>
      </div>
      <div className="max-w-sm mt-5 mx-auto flex items-center gap-2">
        <div className="h-0.5 bg-gray-600 flex-grow min-w-[20%]"></div>
        <p className="p-1 text-sm text-nowrap">New to Shopfaster?</p>
        <div className="h-0.5 bg-gray-600 flex-grow min-w-[20%]"></div>
      </div>

      <Link
        href={"/sign-up"}
        className="max-w-sm flex mx-auto p-2 text-sm text-center justify-center  mt-4 w-full rounded-full bg-transparent text-black border border-gray-500 hover:bg-gray-200 "
      >
        Create your Shopfaster account
      </Link>
    </>
  );
}

export default page;
