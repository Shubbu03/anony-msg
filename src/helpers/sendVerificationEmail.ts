import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/VerificationEmail";
import { apiResponse } from "@/types/apiRes";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Anony Verification Code",
      react: VerificationEmail({ username,otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully!!" };
  } catch (err) {
    console.error("Error sending verification mail!", err);
    return { success: false, message: "Failed to send Verification email" };
  }
}
