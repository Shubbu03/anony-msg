import { z } from "zod";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation, signupSchema } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("username query result:", result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(",")
              : "Invalid query parameter",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUsername) {
      return Response.json(
        { success: false, message: "Username is already taken!!" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available!!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking Username!!", error);
    return Response.json(
      { success: false, message: "Error checking username!!" },
      { status: 500 }
    );
  }
}
