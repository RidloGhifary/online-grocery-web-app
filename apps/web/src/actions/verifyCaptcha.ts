"use server";

import { VerifyCaptcha } from "@/utils/captcha";

interface sendMessageProps {
  token: string;
}

export default async function VerifyCaptchaToken({ token }: sendMessageProps) {
  // TODO : verify captcha
  const captcha = await VerifyCaptcha(token);

  if (!captcha) {
    return {
      success: false,
      message: "Captcha verification failed!",
    };
  }

  if (!captcha.success || captcha.score < 0.5) {
    return {
      success: false,
      message: "Captcha verification failed!",
    };
  }

  return {
    success: true,
    message: "Captcha verification success!",
  };
}
