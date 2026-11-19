import PrivateConversationRepository from "../../DB/Repositories/privateconversation.repository.js";
import ConversationRepository from "../../DB/Repositories/conversations.repository.js";

import { pagenation } from "../../common/Utils/pagenation.js";
import {
  checkMessageTime,
  getUserConversation,
  getUserPrivateMessage,
} from "./helper-service-function.js";

const PriConvRepo = new PrivateConversationRepository();
const ConvRepo = new ConversationRepository();

export const sendPrivateMessage = async (userId, conversationId, content) => {
  await getUserConversation(ConvRepo, userId, conversationId);

  const result = await PriConvRepo.createOneDocument({
    conversationId,
    senderId: userId,
    content,
  });

  return {
    message: "Private message sent successfully",
    result,
  };
};

export const getPrivateMessages = async (userId, conversationId, query) => {
  const { page, limit } = query;

  await getUserConversation(ConvRepo, userId, conversationId);

  const filter = { conversationId };

  const { pagenate, skip } = await pagenation(PriConvRepo, page, limit, filter);

  const result = await PriConvRepo.findAllDocuments(filter, {
    populate: [
      {
        path: "senderId",
        select: "firstName lastName profilePicture",
      },
    ],
    limit,
    skip,
    sort: { createdAt: -1 },
  });

  result.reverse();

  return {
    messages: result,
    pagenate,
  };
};

export const updatePrivateMessage = async (
  userId,
  conversationId,
  messageId,
  content,
) => {
  await getUserConversation(ConvRepo, userId, conversationId);

  const message = await getUserPrivateMessage(
    PriConvRepo,
    userId,
    conversationId,
    messageId,
  );

  checkMessageTime(message.createdAt);

  const result = await PriConvRepo.findOneAndUpdateDocument(
    {
      _id: messageId,
      conversationId,
      senderId: userId,
    },
    { content },
    { returnDocument: "after" },
  );

  return {
    message: "Private message updated successfully",
    result,
  };
};

export const deletePrivateMessage = async (
  userId,
  conversationId,
  messageId,
) => {
  await getUserConversation(ConvRepo, userId, conversationId);

  const message = await getUserPrivateMessage(
    PriConvRepo,
    userId,
    conversationId,
    messageId,
  );

  checkMessageTime(message.createdAt);

  const result = await PriConvRepo.findOneAndDeleteDocument({
    _id: messageId,
    conversationId,
    senderId: userId,
  });

  return {
    message: "Private message deleted successfully",
    result,
  };
};
