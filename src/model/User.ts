import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: Boolean;
  isAcceptingMessage: Boolean;
  messages: [Message];
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!!"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!!"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address!!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!!"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification Code is required!!"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification Code Expiry is required!!"],
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    required: true,
    default: true,
  },
  messages: [messageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
