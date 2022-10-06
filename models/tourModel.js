import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
