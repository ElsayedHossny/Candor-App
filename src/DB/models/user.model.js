import mongoose from "mongoose";
import { genderEnum, providersEnum, roleEnum } from "../../common/constants.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters long"],
      maxLength: [30, "First name must be at most 30 characters long"],
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "Last name must be at 3 chatacters long"],
      maxLength: [30, "Last name must be at 30 chatacters long"],
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      index: { name: "idx_email_unique", unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.MALE,
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age must be at most 100"],
    },
    profilePicture: String,
    phone: String,
    isVerifyAcount: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: "user",
    },
    googleSub: {
      type: String,
      default: null,
      index: {
        name: "google-sub-unique",
        unique: true,
        partialFilterExpression: {
          googleSub: { $type: "string" },
        },
      },
    },
    providers: {
      type: String,
      enum: Object.values(providersEnum),
      default: providersEnum.SYSTEM,
    },
  },
  {
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName}_${this.lastName}`;
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);
const userModel = mongoose.model("userModel", UserSchema); //in Db store as usermodels

export default userModel;

// UserSchema.virtual("fullName").get(function () {
//   return `${this.firstName}_${this.lastName}`;
// });
