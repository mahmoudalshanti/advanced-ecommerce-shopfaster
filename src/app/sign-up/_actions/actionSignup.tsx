"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import generateVerificationCode, {
  birthCheck,
  generateToken,
  nameCheck,
  passwordCheck,
} from "@/lib/utils";

import { sendVerificationCode, sendWelcomeEmail } from "@/mailtrap/emails";
import { InputJsonValue } from "@prisma/client/runtime/library";

import { z } from "zod";
import { cookies } from "next/headers";

const emailSchema = z.string().email("Invalid email");

export async function actionContinue(
  email: string,
  country: { name: string; flag: string }
) {
  try {
    const result = emailSchema.safeParse(email);
    if (result.error) {
      throw new Error("Invalid Email");
    }
    await prisma
      .$transaction([
        prisma.verificationCode.deleteMany({
          where: {
            expireIn: {
              lt: new Date(),
            },
          },
        }),

        prisma.pendingUser.deleteMany({
          where: {
            verificationCode: null,
          },
        }),
      ])
      .catch((err) => {
        throw new Error("Server not responding");
      });

    const existingUserDB = await prisma.user
      .findUnique({ where: { email } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (existingUserDB) {
      return { redirect: "/" };
    }

    const existingPendingUser = await prisma.pendingUser
      .findUnique({
        where: { email },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (existingPendingUser) {
      return { redirect: `/sign-up/info/${existingPendingUser.id}` };
    }

    const randomCode = generateVerificationCode();
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000);

    try {
      await sendVerificationCode(email, randomCode);
    } catch (err) {
      throw new Error("Error sending email");
    }

    const pendingUser = await prisma.pendingUser
      .create({
        data: {
          email,
          country: {
            name: country.name,
            flag: country.flag,
          },
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    await prisma.verificationCode
      .create({
        data: {
          code: randomCode,
          expireIn: expirationDate,
          pendingUserId: pendingUser.id,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    return { redirect: `/sign-up/info/${pendingUser.id}` };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";

    throw new Error(message);
  }
}

export async function actionCreateUser(
  id: string,
  code: string,
  fName: string,
  lName: string,
  password: string,
  birth: {
    day: number | null;
    month: number | null;
    year: number | null;
  },
  check: boolean
) {
  try {
    const verificationCode = await prisma.verificationCode
      .findUnique({
        where: { code, pendingUserId: id, expireIn: { gt: new Date() } },
        include: {
          pendingUser: true,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!verificationCode) {
      throw new Error("Code not valid or expired");
    }

    const isValidFName = nameCheck(fName);
    const isValidLName = nameCheck(lName);
    if (!isValidFName || !isValidLName)
      throw new Error("First or last name not valid");

    const isValidPassword = passwordCheck(password).every(
      (c) => c.met === true
    );

    if (!isValidPassword) throw new Error("Password not valid");

    if (birth.day && birth.month && birth.year) {
      if (
        birth.day.toString().length > 2 ||
        birth.month.toString().length > 2 ||
        birth.year.toString().length > 4
      )
        throw new Error("Date of birth not valid");
    }

    if (!birthCheck(birth.day, birth.month, birth.year))
      throw new Error("Date of birth not valid");

    if (!check) throw new Error("Must agree to Shopfaster's privacy terms");

    const hashPwd = await bcrypt.hash(password, 10);

    const newUser = await prisma.user
      .create({
        data: {
          fName: fName.toLowerCase(),
          lName: lName.toLowerCase(),
          email: verificationCode?.pendingUser?.email.toLowerCase() ?? "",
          password: hashPwd,
          dateOfBirth: new Date(
            birth.year ?? 0,
            (birth.month ?? 1) - 1,
            birth.day ?? 0
          ),
          country: verificationCode.pendingUser?.country as InputJsonValue,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    await prisma.verificationCode
      .delete({
        where: { code, pendingUserId: id, expireIn: { gt: new Date() } },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    await prisma.pendingUser
      .delete({
        where: { email: newUser.email },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    await sendWelcomeEmail(newUser.email, newUser.fName);

    const token = generateToken(newUser.id);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { redirect: `/`, user: newUser };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    throw new Error(message);
  }
}

export async function reSendCode(id: string) {
  try {
    const findPendingUser = await prisma.pendingUser
      .findFirst({
        where: { id },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!findPendingUser) throw new Error("Invalid id");
    const randomCode = generateVerificationCode();
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.verificationCode
      .update({
        where: {
          pendingUserId: findPendingUser.id,
        },
        data: {
          code: randomCode,
          expireIn: expirationDate,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    throw new Error(message);
  }
}
