import mongoose, { Document, Model, Schema } from "mongoose";

// Interface for Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  createdAt: string;
  // Define other fields...
}

// Define the schema
const productSchema: Schema<IProduct> = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: String 
  // Define other fields...
});

// Define the model
const ProductModel: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default ProductModel;
