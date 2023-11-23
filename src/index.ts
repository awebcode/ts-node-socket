import express, { NextFunction, Request, Response } from "express";
import db from "./config/db.ts";
import helper from "./helper.ts";
import fingerprint from "express-fingerprint"
import dotenv from "dotenv";
import router from "./routes/userRoutes.ts";
import cookieParser from "cookie-parser";
import { VisitorsCountModel } from "./models/visitorCountModel.ts";
dotenv.config();
const app = express();
app.use(express.json());

app.use(cookieParser())
app.use(fingerprint());



app.get("/", async (req: Request, res: Response) => {
  const visitCookie = req.cookies.visitCount;
  console.log(visitCookie);
  const browserFingerprint = req.fingerprint?.hash;

  if (!visitCookie) {
    if (!browserFingerprint) {
      return res
        .status(400)
        .json({ error: "Fingerprint not available. Unable to track visitor." });
    }

    let visit= await VisitorsCountModel.findOne({
      fingerprint: browserFingerprint,
    });

    if (!visit) {
      const newVisit = new VisitorsCountModel({
        count: 1,
        fingerprint: browserFingerprint,
      });

      console.log("in", newVisit);
      await newVisit.save();
      res.cookie("visitCount", "1", { maxAge: 31536000000, httpOnly: true }); // Set cookie for 1 year
      return res.send("New user - Visit count set to 1");
    }

    // return res.send(`Returning user - Visit count: ${visit.count}`);
  }

  const visits = await VisitorsCountModel.find();

  if (visits) {
    return res.json({ visits: visits, returningUserCount: visitCookie });
  }

  return res.send(`Returning user - Visit count: ${visitCookie}`);
});
app.use("/api/v1",router);
helper(app);
