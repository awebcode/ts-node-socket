import express from "express";
import { createProduct, getAllProducts } from "../controllers/productCtrl.ts";

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getAllProducts);

export default productRouter;
