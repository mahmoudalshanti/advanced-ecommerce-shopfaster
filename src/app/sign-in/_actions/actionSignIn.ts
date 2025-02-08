"use server";

import prisma from "@/lib/prisma";
import {
  sendPasswordRestEmail,
  sendResetSuccessEmail,
} from "@/mailtrap/emails";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateToken, passwordCheck } from "@/lib/utils";
import { cookies, headers } from "next/headers";

export async function actionSignin(email: string, password: string) {
  try {
    const findUser = await prisma.user
      .findUnique({ where: { email } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!findUser) throw new Error("Email not found");

    const checkPwd = await bcrypt.compare(password, findUser.password);

    if (!checkPwd) throw new Error("Password not correct");

    const token = generateToken(findUser.id);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { redirect: "/", user: findUser };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";

    throw new Error(message);
  }
}

export async function forgetPassword(email: string) {
  try {
    const findUser = await prisma.user
      .findUnique({ where: { email } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!findUser) throw new Error("Invalid Email");

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    await prisma.user
      .update({
        where: { id: findUser.id },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordTokenExpiresAt: resetTokenExpiresAt,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    const headerList = headers();
    const origin =
      (await headerList).get("origin") ||
      (await headerList).get("referer") ||
      "";
    try {
      await sendPasswordRestEmail(
        findUser.email,
        `${origin}/sign-in/rest-password/${resetToken}`
      );
    } catch (err) {
      throw new Error("Error sending email or Invalid email");
    }

    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";

    throw new Error(message);
  }
}

export async function restPassword(token: string, password: string) {
  try {
    const findUser = await prisma.user
      .findFirst({
        where: {
          resetPasswordToken: token,
          resetPasswordTokenExpiresAt: { gt: new Date() },
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!findUser) throw new Error("Invalid token or Expired date");

    const isValidPassword = passwordCheck(password).every(
      (c) => c.met === true
    );
    if (!isValidPassword) throw new Error("Invalid password");

    const hashPwd = await bcrypt.hash(password, 10);

    const user = await prisma.user
      .update({
        where: {
          id: findUser.id,
        },
        data: {
          password: hashPwd,
          resetPasswordToken: null,
          resetPasswordTokenExpiresAt: null,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    try {
      await sendResetSuccessEmail(user.email);
    } catch (error) {
      throw new Error("Error sending email or Invalid email");
    }
    return;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";

    throw new Error(message);
  }
}
