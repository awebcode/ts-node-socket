import { Response } from 'express';
const sendToken = (user:any, statusCode:number, res:Response) => {
  const token = user.generateToken();
  // options for cookie
  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user, // Send the modified user object
    token,
  });
};

export default sendToken;
