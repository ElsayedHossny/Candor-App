import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: function () {
        this.attachments?.length > 0 ? false : true;
      },
      minLength: [3, "content must be at least 3 characters long"],
      maxLength: [50000, "content must be at most 50000 characters long"],
    },
    attachments: [String],
    senderId: { type: mongoose.Types.ObjectId, ref: "userModel" },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
const messageModel = mongoose.model("messageModel", MessageSchema); //in Db store as usermodels

export default messageModel;
