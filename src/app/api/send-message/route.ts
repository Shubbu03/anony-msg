import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  try {
    const foundUser = await UserModel.findOne({ username });

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found!!" },
        { status: 404 }
      );
    }

    if (!username.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting message!!" },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    foundUser.messages.push(newMessage as Message);

    await foundUser.save();

    return Response.json(
      { success: true, message: "Message sent successfully!!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unable to post message!!", err);
    return Response.json(
      { success: false, message: "Unable to post message!!" },
      { status: 401 }
    );
  }
}
