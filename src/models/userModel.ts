import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDocument } from "../interfaces/userInterFaces";

const userSchema: Schema<UserDocument> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long!"],
    },
    role: {
      type: String,
      default: "user",
    },
    phone:String,
    avatar: String,
    verificationCode: {
      type: String,
      default: null,
    },
    verificationCodeExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
  this.name = this.name.toLowerCase();
  this.email = this.email.toLowerCase();
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 16);
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE!,
  });
  return token;
};

const User = mongoose.model<UserDocument>("user", userSchema);

export default User;
