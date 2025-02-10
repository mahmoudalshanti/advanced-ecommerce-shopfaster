import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const nameRegex = /^[A-Za-z]+$/;

const nameSchema = z
  .string()
  .min(1, { message: "This field is required" })
  .regex(nameRegex, { message: "Only letters are allowed" });

export function nameCheck(name: string) {
  return nameSchema.safeParse(name).success;
}

const emailSchema = z.string().email("Invalid email");

export function emailCheck(email: string) {
  return emailSchema.safeParse(email).success;
}

export function passwordCheck(password: string) {
  return [
    { label: "At least 6 characters", met: password.length >= 6 },
    {
      label: "Contains uppercase & lowercase letters",
      met: /[A-Z]/.test(password) && /[a-z]/.test(password),
    },
    { label: "Contains a number", met: /\d/.test(password) },
  ];
}

export function birthCheck(
  day: number | null,
  month: number | null,
  year: number | null
) {
  let check = false;
  if (day && month && year) {
    if (day <= 31 && day >= 1) {
      check = true;
    } else {
      check = false;
      return false;
    }
    if (month <= 12 && month >= 1) {
      check = true;
    } else {
      check = false;
      return false;
    }
    if (year <= 2007 && year >= 1930) {
      check = true;
      return true;
    } else {
      check = false;
      return false;
    }
  }

  return false;
}

export function generateToken(
  id: string,
  role: string = "user",
  email: string = ""
) {
  const token = jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || "token_here",
    {
      expiresIn: "7d",
    }
  );

  return token;
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as { id: string; role: string; email: string };
  } catch (err) {
    throw new Error("Invalid token");
  }
}

const value: number = 3;

let currentPage: { id: string; role: string; email: string }[] = [];

export function pagination(payload: any, set_page: number) {
  const length = payload.length;
  const pages = Math.ceil(length / value);

  if (payload.length <= 0)
    return {
      currentPage,
      no: 0,
      pages: 0,
      step: 0,
    };

  if (set_page <= 0) set_page = 1;
  if (pages <= set_page) {
    set_page = pages;
  }

  currentPage = payload.slice(set_page * value - value, set_page * value);

  return {
    currentPage,
    no: set_page,
    pages: pages,
    step: value * set_page,
  };
}
