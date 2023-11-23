import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Visitor document
interface Visitor extends Document {
  count: number;
  fingerprint: string;
}


// Define the schema for the Visitor document
const visitorSchema: Schema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  fingerprint: {
    type: String,
    required: true,
    unique: true,
  },
});

// Create and export the model for the Visitor document
export const VisitorsCountModel = mongoose.model<Visitor>("Visitor", visitorSchema);


