import {
  BadRequestException,
  NotFoundException,
} from "../../common/Utils/Error/exception.error.js";

export const checkMessageTime = (createdAt) => {
  const timeDifference = Date.now() - createdAt.getTime();

  const fiveMinutes = 3 * 60 * 1000;

  if (timeDifference >= fiveMinutes) {
    throw new BadRequestException(
      "The allowed time for editing or deleting this message has expired",
      {
        error: "MESSAGE_ACTION_TIME_EXPIRED",
        suggestion:
          "You can only edit or delete a message within 5 minutes of sending it.",
      },
    );
  }

  return true;
};

export const getUserConversation = async (ConvRepo, userId, conversationId) => {
  const conversation = await ConvRepo.findOneDocument({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new NotFoundException("Conversation not found", {
      error: "CONVERSATION_NOT_FOUND",
      suggestion: "Please check the conversation ID and try again.",
    });
  }

  return conversation;
};

export const getUserPrivateMessage = async (
  PriConvRepo,
  userId,
  conversationId,
  messageId,
) => {
  const message = await PriConvRepo.findOneDocument({
    _id: messageId,
    conversationId,
    senderId: userId,
  });

  if (!message) {
    throw new NotFoundException("Private message not found", {
      error: "PRIVATE_MESSAGE_NOT_FOUND",
      suggestion:
        "The message does not exist or you are not allowed to access it.",
    });
  }

  return message;
};
