import  { Document} from "mongoose";
export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  avatar: string;
  verificationCode: string | null;
  verificationCodeExpires: Date | null;
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
}
