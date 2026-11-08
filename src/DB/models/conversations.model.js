import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userModel",
        },
      ],
      required: true,
      validate: {
        validator: (value) => value.length === 2,
        message: "A conversation must have exactly two participants",
      },
    },

    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "requestModel",
      required: true,
      unique: true,
    },

    originalMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messageModel",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const conversationModel = mongoose.model(
  "conversationModel",
  conversationSchema,
);

export default conversationModel;
