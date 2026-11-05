import { Router } from "express";
import * as userServices from "./user.service.js";
import { authentication } from "../../Middleware/authentication.middleware.js";
import { authorization } from "../../Middleware/authorization.middleware.js";
import { roleEnum } from "../../common/constants.js";
import { multerUpload } from "../../Middleware/multer.middleware.js";
import { multerValidation } from "../../Middleware/multerValidation.middleware.js";
import { ValidationMiddleWare } from "../../Middleware/validation.middleware.js";
import { userPagenation } from "./user.validation.js";

const userRouter = Router();

userRouter.get("/", (req, res, next) => {
  res.json({ message: "User Good" });
});

userRouter.patch(
  "/update",
  authentication,
  authorization([roleEnum.USER]),
  async (req, res, next) => {
    const data = req.body;
    const result = await userServices.updatedProfile(data, req.authUser._id);
    if (result === null) {
      throw new Error("Invalid User Id");
    }
    res.json({ message: "sucessfully updated ", result });
  },
);

userRouter.delete(
  "/delete",
  authentication,
  authorization([roleEnum.ADMIN, roleEnum.USER]),
  async (req, res, next) => {
    const result = await userServices.deleteProfile(req.authUser._id);
    if (result === null) {
      throw new Error("Invaild User Id");
    }
    res.json({ message: "User Is Deleted" });
  },
);

userRouter.get(
  "/userprofile",
  authentication,
  authorization([roleEnum.USER, roleEnum.ADMIN]),
  async (req, res, next) => {
    const result = await userServices.findProfileById(req.authUser._id);
    res.json({ message: "User Profile", result });
  },
);
//authorization([roleEnum.ADMIN]),
userRouter.get(
  "/alluserprofiles",
  authentication,
  ValidationMiddleWare(userPagenation),
  async (req, res, next) => {
    const result = await userServices.findAllUsers(req.validate.query);
    res.json({ message: "all User Profile", result });
  },
);

userRouter.post(
  "/profile-picture",
  authentication,
  multerUpload({ desiredPath: "profiles" }).single("profile"),
  multerValidation,
  async (req, res, next) => {
    const file = req.file;
    const { authUser } = req;

    const result = await userServices.updatedProfilePicure(authUser, file);
    res.json({
      message: "profile-picture uploaded sucessfully",
      result,
    });
  },
);

userRouter.post(
  "/upload",
  multerUpload({ desiredPath: "Covers" }).fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 2 },
  ]),
  multerValidation,
  async (req, res, next) => {
    const files = req.files ?? req.file;
    console.log(files);

    res.json({
      message: "uploaded sucessfully",
      result: files,
    });
  },
);

export default userRouter;
