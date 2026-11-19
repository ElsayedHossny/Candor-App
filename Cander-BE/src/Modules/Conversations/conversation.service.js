import { NotFoundException } from "../../common/Utils/Error/exception.error.js";
import { pagenation } from "../../common/Utils/pagenation.js";
import ConversationRepository from "../../DB/Repositories/conversations.repository.js";

const ConvRepo = new ConversationRepository();

export const test = () => {
  return "Conversations test request ";
};

export const getAllConversations = async (userId, query) => {
  //pagination
  const { page, limit } = query;

  const filter = userId ? { participants: userId } : {};

  const { pagenate, skip } = await pagenation(ConvRepo, page, limit);

  const result = await ConvRepo.findAllDocuments(filter, {
    populate: [
      { path: "participants", select: "firstName lastName profilePicture" },
    ],
    limit,
    skip,
  });

  return {
    Conversations: result,
    pagenate,
  };
};

export const getConversation = async (userId, convId) => {
  const result = await ConvRepo.findOneDocument(
    {
      participants: userId,
      _id: convId,
    },
    {
      populate: [
        {
          path: "participants",
          select: "firstName lastName profilePicture",
        },
        {
          path: "originalMessageId",
          select: "content attachments",
        },
        {
          path: "requestId",
          select: "note",
        },
      ],
    },
  );

  if (!result) {
    throw new NotFoundException("Conversation not found", {
      error: "CONVERSATION_NOT_FOUND",
      suggestion: "Please check the conversation ID and try again.",
    });
  }

  return {
    message: "Conversation retrieved successfully",
    result,
  };
};
