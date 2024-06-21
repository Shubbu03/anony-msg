import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose, { Mongoose } from "mongoose";

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

  const userId = new mongoose.Types.ObjectId(currentUser._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found!!" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (err) {
    console.error("User not found!!", err);
    return Response.json(
      { success: false, message: "User not found!!" },
      { status: 404 }
    );
  }
}
