import { UserDocument } from "./../interfaces/userInterFaces.ts";
import { NextFunction, Request, Response } from "express";
import { generateVerificationCode, sendVerificationSMS } from "../utils/twilio.ts";
import sendToken from "../utils/sendToken.ts";
import User from "../models/userModel.ts";
import ErrorHandler from "../utils/ErrorHandler.ts";
import sendEmail from "../utils/sendEmail.ts";
//for req.user
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // Assuming your user information is of type UserDocument
      // You can adjust the type according to the structure of your user data
    }
  }
}

// Register a User
export const registerUser = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { name, email, password, phone } = req.body;
    // const lowercaseEmail=email.toLowerCase()
    const existsUser = await User.findOne({ email }).select("+password");

    if (existsUser) {
      return next(new ErrorHandler("Email Already Exists", 500));
    }

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

   const user = (await User.create({
     name,
     email,
     password,
     phone,
     verificationCode, // Save the verification code in the user model
   })) as UserDocument;


    // Send SMS with verification code
    sendVerificationSMS(user.phone, verificationCode);
    //send mail
    sendEmail(user.email,"Typescript Asikur -Test email subject");
    sendToken(user, 201, res);
  } catch (error) {
    // console.log(error)
    next(error);
  }
};

// Login User
export const loginUser = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { email, password } = req.body;

    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ $or: [{ email: email }, { name: email }] }).select(
      "+password"
    );

    if (!user) {
      return next(new ErrorHandler("User Not Found", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid  password", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

///get user details

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const userId = req.user?.id; // Assuming req.user contains the user's ID
    if (!userId) {
      return next(new ErrorHandler("User ID not found", 400)); // Adjust the error handling based on your needs
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//logooout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0), // Setting the expiration date to a date in the past
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    next(error);
  }
};
// Delete Own User
export const deleteOwnUser = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.deleteOne();

    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};
// Delete User by Admin
export const deleteAdminUser = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { id } = req.params;

    // Ensure the user performing the deletion is an admin
    if (req.user?.role !== "admin") {
      return next(new ErrorHandler("Only admins can delete users", 403));
    }

    const user = await User.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};
//update own user

export const updateUserByMe = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const id = req.user?.id ?? ""; // Using optional chaining and nullish coalescing

    const user = await User.findByIdAndUpdate(id, req.body, { new: true, upsert: true });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated Successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};
//update by admin
export const updateUserByAdmin = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { id } = req.params;

    // Ensure the user performing the update is an admin
    if (req.user?.role !== "admin") {
      return next(new ErrorHandler("Only admins can update users", 403));
    }

    const user = await User.findByIdAndUpdate(id, req.body, { new: true, upsert: true });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated Successfully!",
      user,
    });
  } catch (error) {
    next(error);
  }
};
