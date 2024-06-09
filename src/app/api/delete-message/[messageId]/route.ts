import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose, { Mongoose } from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageid = params.messageId;
  await dbConnect();

  const session = await getServerSession(authOptions);
  const currentUser: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "User not logged in!!" },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: currentUser._id },
      { $pull: { messages: { _id: messageid } } }
    );
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted!!" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Message deleted!!" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Error deleting message!!" },
      { status: 500 }
    );
  }
}
