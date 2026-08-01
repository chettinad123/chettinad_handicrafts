import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    cityState: {
      type: String,
      required: true,
      trim: true,
    },

    preferredContactMethod: {
      type: String,
      enum: ["Phone", "Email", "WhatsApp"],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    enquiryMessage: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
    type: String,
    enum: ["new", "read", "responded"],
    default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;