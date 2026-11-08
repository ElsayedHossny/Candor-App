import { Router } from "express";

import * as conversationsServices from "./conversation.service.js";
import { authorization } from "../../Middleware/authorization.middleware.js";
import { roleEnum } from "../../common/constants.js";
import { authentication } from "../../Middleware/authentication.middleware.js";

const conversationRouter = new Router();

conversationRouter.get("/", (req, res, next) => {
  const result = conversationsServices.test();
  res.json({ message: "message Good", result });
});

// To admin
conversationRouter.get(
  "/all-conversations",
  authentication,
  authorization(roleEnum.ADMIN),
  async (req, res, next) => {
    const result = await conversationsServices.getAllConversations(
      undefined,
      req.query,
    );

    res.status(200).json({
      message: "All conversations retrieved successfully",
      result,
    });
  },
);
// To users
conversationRouter.get(
  "/my-conversations",
  authentication,
  async (req, res, next) => {
    const result = await conversationsServices.getAllConversations(
      req.authUser.id,
      req.query,
    );

    res.status(200).json({
      message: "User conversations retrieved successfully",
      result,
    });
  },
);
// get one conversation
conversationRouter.get(
  "/:conversationId",
  authentication,
  async (req, res, next) => {
    const { conversationId } = req.params;

    const result = await conversationsServices.getConversation(
      req.authUser.id,
      conversationId,
    );

    res.status(200).json({
      message: "Conversation retrieved successfully",
      result,
    });
  },
);

export default conversationRouter;
