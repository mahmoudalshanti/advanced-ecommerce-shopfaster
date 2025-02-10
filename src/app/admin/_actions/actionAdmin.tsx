"use server";

import prisma from "@/lib/prisma";
import generateVerificationCode, { generateToken } from "@/lib/utils";
import { sendVerificationAdminCode } from "@/mailtrap/emails";
import { cookies } from "next/headers";

export async function actionVerifySupervisorEmail(email: string) {
  try {
    const [findAdmin, findManager] = await Promise.all([
      prisma.admin.findUnique({ where: { email } }),
      prisma.manager.findUnique({ where: { email } }),
    ]).catch((err) => {
      throw new Error("Server not responding");
    });

    const supereVisor = findAdmin || findManager;

    if (!supereVisor) throw new Error("Invalid email or credentials");

    const randomCode = generateVerificationCode();

    const expirationDate = new Date(Date.now() + 15 * 60 * 1000);

    try {
      await sendVerificationAdminCode(email, randomCode);
    } catch (err) {
      throw new Error("Error sending email");
    }

    await prisma.verificationCode
      .deleteMany({
        where: {
          adminId: findAdmin?.id ?? undefined,
          managerId: findManager?.id ?? undefined,
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
          adminId: findAdmin ? findAdmin.id : null,
          managerId: findManager ? findManager.id : null,
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
export async function actionVerifySupervisorCode(code: string) {
  try {
    const verificationCode = await prisma.verificationCode
      .findUnique({
        where: { code, expireIn: { gt: new Date() } },
        include: {
          admin: true,
          manager: true,
        },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    if (!verificationCode) throw new Error("Invalid code or expired");

    await prisma.verificationCode
      .delete({
        where: { id: verificationCode.id },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    const userId = verificationCode.admin?.id || verificationCode.manager?.id;
    const email =
      verificationCode.admin?.email || verificationCode.manager?.email;
    const role = verificationCode.admin ? "admin" : "manager"; // Dynamically determine role

    const token = generateToken(userId || "", role, email);

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { redirect: "/dashboard" };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";

    throw new Error(message);
  }
}
