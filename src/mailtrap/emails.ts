"use server";

import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE_ADMIN,
} from "./emailTemplates";
import { mailtrapClient, sender } from "./mailtrap";

export async function sendVerificationCode(email: string, code: string) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code),
      category: "Email verification",
    });
  } catch (err) {
    throw new Error("Error sending code by email");
  }
}

export async function sendVerificationAdminCode(email: string, code: string) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE_ADMIN.replace(
        "{verificationCode}",
        code
      ),
      category: "Email verification",
    });
  } catch (err) {
    throw new Error("Error sending code by email");
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "b754d942-b823-40c1-9891-a226b485d43f",
      template_variables: {
        company_info_name: "Shopfaster",
        name: name,
      },
    });
  } catch (err) {
    throw new Error("Error sending welcome by email");
  }
}

export async function sendPasswordRestEmail(email: string, resetURL: string) {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password reset",
    });
  } catch (err) {
    throw new Error(`Error sending password reset email`);
  }
}

export async function sendResetSuccessEmail(email: string) {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
  } catch (err) {
    throw new Error(`Error sending password reset email`);
  }
}
