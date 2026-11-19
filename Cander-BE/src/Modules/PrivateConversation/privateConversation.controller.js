import { Router } from "express";

import * as privateMessagesServices from "./privateConversation.service.js";
import { authentication } from "../../Middleware/authentication.middleware.js";

const privateConversationRouter = new Router();

privateConversationRouter.post(
  "/:conversationId/messages",
  authentication,
  async (req, res, next) => {
    const { conversationId } = req.params;

    const result = await privateMessagesServices.sendPrivateMessage(
      req.authUser.id,
      conversationId,
      req.body.content,
    );

    res.status(201).json({
      message: "Private message sent successfully",
      result,
    });
  },
);

privateConversationRouter.get(
  "/:conversationId/messages",
  authentication,
  async (req, res, next) => {
    const { conversationId } = req.params;

    const result = await privateMessagesServices.getPrivateMessages(
      req.authUser.id,
      conversationId,
      req.query,
    );

    res.status(200).json({
      message: "Private messages retrieved successfully",
      result,
    });
  },
);

privateConversationRouter.patch(
  "/:conversationId/messages/:messageId",
  authentication,
  async (req, res, next) => {
    const { conversationId, messageId } = req.params;
    const { content } = req.body;

    const result = await privateMessagesServices.updatePrivateMessage(
      req.authUser.id,
      conversationId,
      messageId,
      content,
    );

    res.status(200).json({
      message: "Private message updated successfully",
      result,
    });
  },
);

privateConversationRouter.delete(
  "/:conversationId/messages/:messageId",
  authentication,
  async (req, res, next) => {
    const { conversationId, messageId } = req.params;

    const result = await privateMessagesServices.deletePrivateMessage(
      req.authUser.id,
      conversationId,
      messageId,
    );

    res.status(200).json({
      message: "Private message deleted successfully",
      result,
    });
  },
);
export default privateConversationRouter;
