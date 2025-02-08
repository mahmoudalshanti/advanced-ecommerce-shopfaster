"use client";

import { actionCreateUser } from "@/app/sign-up/_actions/actionSignup";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CreateButton({
  disabled,
  code,
  isChecked,
  fName,
  lName,
  password,
  birth,
  setErrMsg,
}: {
  disabled: boolean;
  code: string;
  isChecked: boolean;
  fName: string;
  lName: string;
  password: string;
  birth: {
    day: number | null;
    month: number | null;
    year: number | null;
  };
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handelCreateAccount = async () => {
    try {
      setLoading(true);

      const data = await actionCreateUser(
        id as string,
        code,
        fName,
        lName,
        password,
        birth,
        isChecked
      );

      if (data?.redirect) {
        router.push(data.redirect);
      }
    } catch (err) {
      console.log(err, "Error message");
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
      <div className="flex justify-end mt-8">
        <Button
          className="w-36 rounded-full text-base p-6 font-bold"
          disabled={disabled || loading}
          onClick={handelCreateAccount}
        >
          {loading ? <Loading /> : " Create Account "}
        </Button>
      </div>
    </>
  );
}

export default CreateButton;
