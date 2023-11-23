import nodemailer, { Transporter } from "nodemailer";
import ErrorHandler from "./ErrorHandler.ts";

const sendEmail = async (email: string, subject: string): Promise<void> => {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // or 'smtp.yourdomain.com' for cPanel email
      service: "gmail", // when using local email
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_SENDER!,
        pass: process.env.MAIL_PASS!,
      },
    });

    await transporter.sendMail({
      from: `Typescript Asikur<${process.env.MAIL_SENDER!}>`, // Set custom name here
      to: email,
      subject: subject,
      html: `<html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: auto;
              padding: 20px;
              text-align: center;
            }
            h1 {
              font-size: 24px;
              color: #dddddd;
            }
            p {
              font-size: 16px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Hello ${email}!</h1>
            <p>This template creates a simple email structure with a greeting and a message. When calling the sendEmail function, provide the email address, subject, and an object containing name and message</p>
            <p>Best regards,<br/>Typescript -Asikur</p>
          </div>
        </body>
      </html>`,
    });

    console.log("Email sent successfully");
    // console.log(mailData); // Uncomment this line if you want to log mailData
  } catch (error) {
    throw new ErrorHandler("Email not sent", 500);

  }
};

export default sendEmail;
