import { z } from "zod";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation, signupSchema } from "@/schemas/signupSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodeUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodeUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!!",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotEpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotEpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User Verified!!",
        },
        { status: 200 }
      );
    } else if (!isCodeNotEpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code expired, please signup again to get new code!!",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code!!",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error validating code!!", error);
    return Response.json(
      {
        success: false,
        message: "Error validating code!!",
      },
      { status: 400 }
    );
  }
}
