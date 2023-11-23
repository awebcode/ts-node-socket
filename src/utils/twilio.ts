import Twilio from "twilio";
import ErrorHandler from "./ErrorHandler.ts";
import crypto from "crypto";

// Define the type for Twilio client
interface TwilioClient {
  messages: {
    create: (message: { to: string; from: string; body: string }) => Promise<any>; // Adjust this type according to the actual return type
  };
  // Add other methods or properties as needed
}
//generateRandomNumber
export const generateVerificationCode = (): string => {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number

  // Generate a random number within the specified range
  const verificationCode = Math.floor(Math.random() * (max - min + 1)) + min;

  return verificationCode.toString();
};


// Function to send SMS with verification code using Twilio
export const sendVerificationSMS = async (
  phoneNumber: string,
  verificationCode: string
): Promise<void> => {
  try {
     const twilioClient: TwilioClient = new (Twilio as any)(
       process.env.TWILIO_ACCOUNT_SID!,
       process.env.TWILIO_AUTH_TOKEN!
     );

    const message = await twilioClient.messages.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER!,
      body: `Your verification code is: ${verificationCode}`,
    });
    console.log(`Verification SMS sent to ${phoneNumber}: ${message.sid}`);
  } catch (error: any) {
    console.error("Error sending verification SMS:", error.message);
    throw new ErrorHandler("Failed to send verification SMS", 500);
  }
};
