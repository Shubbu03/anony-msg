import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const currentUser: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User not logged in!!" },
      { status: 401 }
    );
  }

  const userId = currentUser._id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update user status!!" },
        { status: 401 }
      );
    }

    return Response.json(
      { success: true, message: "User status updated!!", updatedUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to update user status!!", err);
    return Response.json(
      { success: false, message: "Failed to update user status!!" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const currentUser: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User not logged in!!" },
      { status: 401 }
    );
  }

  const userId = currentUser._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found!!" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User found!!",
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to get user status!!", err);
    return Response.json(
      { success: false, message: "Failed to get user status!!" },
      { status: 500 }
    );
  }
}


