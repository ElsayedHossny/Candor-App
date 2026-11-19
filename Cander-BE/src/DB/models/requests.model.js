import mongoose from "mongoose";
import { requestStatusEnum } from "../../common/constants.js";

const RequestSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Types.ObjectId,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "userModel",
    },
    note: {
      type: String,
      minLength: [3, "content must be at least 3 characters long"],
      maxLength: [100, "content must be at most 100 characters long"],
    },
    requestStatus: {
      type: String,
      enum: Object.values(requestStatusEnum),
    },
  },
  {
    timestamps: true,
  },
);
const requestModel = mongoose.model("requestModel", RequestSchema); //in Db store as usermodels

export default requestModel;
