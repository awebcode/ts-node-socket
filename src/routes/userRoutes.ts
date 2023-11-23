import express from "express";
import {
  registerUser,
  loginUser,
  getUserDetails,
  logout,
  deleteOwnUser,
  deleteAdminUser,
  updateUserByMe,
  updateUserByAdmin,
} from "../controllers/userCtrl.ts"; // Import your user controller functions
import { isAuthenticatedUser } from "../utils/auth.ts";
const router = express.Router();

// Middleware to authenticate user


// Routes for user-related functions
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",isAuthenticatedUser, getUserDetails);
router.get("/logout", isAuthenticatedUser, logout);
router.delete("/delete-own-user", isAuthenticatedUser, deleteOwnUser);
router.delete("/delete-user/:id", isAuthenticatedUser, deleteAdminUser);
router.put("/update-user", isAuthenticatedUser, updateUserByMe);
router.put("/update-user/:id", isAuthenticatedUser, updateUserByAdmin);

export default router;
