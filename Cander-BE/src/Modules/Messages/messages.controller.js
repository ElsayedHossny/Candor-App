import { Router } from "express";

import * as messagesServices from "./messages.service.js";
import { multerUpload } from "../../Middleware/multer.middleware.js";
import { multerValidation } from "../../Middleware/multerValidation.middleware.js";
import { ValidationMiddleWare } from "../../Middleware/validation.middleware.js";
import {
  messageZodSchema,
  Type_Sender_Receriver,
} from "./messages.validation.js";
import { authentication } from "../../Middleware/authentication.middleware.js";
import { decodeToken } from "../../common/Utils/token.utils.js";
import { TokenTypeEnum } from "../../common/constants.js";

const messageRouter = Router();

messageRouter.get("/", (req, res, next) => {
  res.json({ message: "message Good" });
});

/**
 * multerUpload => Parse multipart/form-data and handle file uploads
 * ValidationMiddleWare => Validate request data using Zod
 * multerValidation => Validate uploaded files (type, extension, size, etc.)
 *                   => Keep valid files or delete invalid files
 */

const CheckIsAuthuntication = async (req) => {
  const { authorization } = req.headers;
  const [prefix, token] = authorization.split(" ");
  if (prefix !== "Bearer" || !token) {
    throw new UnauthorizedException("Invalid Bearer token format");
  }

  const { user, decodedDataToken } = await decodeToken(
    token,
    "",
    TokenTypeEnum.ACCESS,
  );
  return { user, decodedDataToken };
};

messageRouter.post(
  "/sendmessage",
  async (req, res, next) => {
    if (req.headers["authorization"]) {
      // 8. Attach the authenticated user to the request object
      const { user, decodedDataToken } = await CheckIsAuthuntication(req);
      req.authUser = user;
      req.decodeUserData = decodedDataToken;
    }
    next();
  },
  multerUpload({ desiredPath: "MessagesAttachments" }).array("attachments", 3),
  ValidationMiddleWare(messageZodSchema),
  multerValidation,

  async (req, res, next) => {
    const result = await messagesServices.createMessage(req);
    res.status(201).json({
      message: "send message successfully",
      result,
    });
  },
);

messageRouter.get(
  "/getallmessages",
  authentication,
  ValidationMiddleWare(Type_Sender_Receriver),
  async (req, res, next) => {
    const result = await messagesServices.ListAllmessages(
      req.authUser,
      req.validate.query,
    );

    res.status(201).json({
      message: "Messages retrieved successfully",
      result,
    });
  },
);

messageRouter.delete("/:messageId", authentication, async (req, res, next) => {
  const { messageId } = req.params;

  const receiverId = req.authUser.id;

  const result = await messagesServices.deleteMessage(messageId, receiverId);

  res.status(201).json({
    result,
  });
});

messageRouter.get("/:messageId", authentication, async (req, res, next) => {
  const { messageId } = req.params;
  const receiverId = req.authUser.id;

  const result = await messagesServices.getMessage(messageId, receiverId);

  res.status(200).json({
    message: "Message retrieved successfully",
    result,
  });
});

export default messageRouter;
