"use server";

import prisma from "@/lib/prisma";
import getSupervisor from "../_components/getSupervisor";
import { sendNewManagerAdd, sendReplaceEmail } from "@/mailtrap/emails";
import { revalidatePath } from "next/cache";
import { pagination } from "@/lib/utils";

export const actionReplaceEmail = async (email: string) => {
  try {
    const supervisor = await getSupervisor();

    const admin = await prisma.admin
      .findFirst({ where: { id: supervisor.id || "" } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    const manager = await prisma.manager
      .findFirst({ where: { id: supervisor.id || "" } })
      .catch((err) => {
        throw new Error("Server not responding");
      });
    if (!admin && !manager) throw new Error("Forbidden");

    const findCEmail = await prisma.manager.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (findCEmail) throw new Error("Email it's already exist");

    if (admin) {
      try {
        await sendReplaceEmail(email);
      } catch (err) {
        throw new Error("Invalid email or error to sending email ");
      }
      await prisma.admin
        .update({
          where: { id: supervisor.id || "" },
          data: {
            email: email,
          },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });
    }
    if (manager) {
      try {
        await sendReplaceEmail(email);
      } catch (err) {
        throw new Error("Invalid email or error to sending email ");
      }
      await prisma.manager
        .update({
          where: { id: supervisor.id || "" },
          data: {
            email: email,
          },
        })
        .catch((err) => {
          throw new Error("Server not responding");
        });
    }

    return revalidatePath("/dashboard");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    throw new Error(message);
  }
};

export const actionAddManager = async (email: string) => {
  try {
    const supervisor = await getSupervisor();

    if (supervisor.role !== "admin") throw new Error("Forbidden");

    const findCEmail = await prisma.manager
      .findUnique({
        where: { email: email.toLowerCase() },
      })
      .catch((err) => {
        throw new Error("Server not responding");
      });
    if (findCEmail) throw new Error("Email it's already exist");

    try {
      await sendNewManagerAdd(supervisor.email || "", email);
    } catch (err) {
      throw new Error("Invalid email or error to sending email ");
    }
    const newManager = await prisma.manager
      .create({ data: { email: email } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    revalidatePath("/dashboard/settings");
    return newManager;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    throw new Error(message);
  }
};

export const actionPaginationTabel = async (page: number) => {
  try {
    if (page <= 0) throw new Error("Page not found");

    const findManagers = await prisma.manager
      .findMany({ orderBy: { createdAt: "desc" } })
      .catch((err) => {
        throw new Error("Server not responding");
      });

    const currentPage = pagination(findManagers, page);
    return { ...currentPage, count: findManagers.length };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    throw new Error(message);
  }
};

export const actionDeleteManager = async (email: string) => {
  try {
    await prisma.manager.delete({ where: { email } }).catch((err) => {
      throw new Error("Server not responding");
    });

    revalidatePath("/dashboard/settings", "page");
    return;
  } catch (err) {
    console.log(err);
    const message =
      err instanceof Error ? err.message : "Something went wrong!";
    throw new Error(message);
  }
};
