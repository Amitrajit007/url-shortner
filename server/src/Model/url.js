import mongoose from "mongoose";
const urlSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiryDays: {
      type: Number,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

// * TTL index of the schema
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Url = mongoose.model("Url", urlSchema);
export default Url;
