import { TypeSenderReceiverEnum } from "../../common/constants.js";
import { NotFoundException } from "../../common/Utils/Error/exception.error.js";
import { pagenation } from "../../common/Utils/pagenation.js";
import MessageRepository from "../../DB/Repositories/messages.repository.js";
import UserRepository from "../../DB/Repositories/user.repository.js";

const messageRepo = new MessageRepository();
const userRepo = new UserRepository();

///////////////////////////////////////////////////////////////////////////////////////

const normalizeAttachments = (req) => {
  const files = req.files ?? req.file;
  // if files is undefined
  if (!files) return [];

  const filesArray = Array.isArray(files) ? files : [files];

  return filesArray.map((file) => file.path);
};

export const createMessage = async (req) => {
  const attachmentsPaths = normalizeAttachments(req);
  const user = await userRepo.findDocumentById(req.validate.body.receiverId);

  if (!user) {
    throw new NotFoundException("Receiver not found.");
  }

  return messageRepo.createOneDocument({
    content: req.body.content,
    attachments: attachmentsPaths,
    receiverId: user._id,
    senderId: req.authUser?.id || undefined,
  });
};

///////////////////////////////////////////////////////////////////////////////////////
const getFiltersFromType = (type) => {
  let filters = {};
  if (type === TypeSenderReceiverEnum.RECEIVER) {
    filters = { receiverId: user._id };
  } else if (type === TypeSenderReceiverEnum.SENDER) {
    filters = { senderId: user._id };
  } else {
    filters = { $or: [{ senderId: user._id }, { receiverId: user._id }] };
  }
  return filters;
};

export const ListAllmessages = async (user, query) => {
  //pagination
  const { type, page, limit } = query;

  const filters = getFiltersFromType(type);

  const { pagenate, skip } = await pagenation(
    messageRepo,
    page,
    limit,
    filters,
  );

  const result = await messageRepo.findAllDocuments(filters, {
    populate: [
      { path: "receiverId", select: "firstName lastName email" },
      { path: "senderId", select: "firstName lastName email" },
    ],
    limit,
    skip,
  });

  return {
    messages: result,
    pagenate,
  };
};
///////////////////////////////////////////////////////////////////////////////////////
export const deleteMessage = async (messageId, receiverId) => {
  const result = await messageRepo.findOneAndDeleteDocument({
    _id: messageId,
    receiverId,
  });
  if (!result) {
    throw new NotFoundException("Message not found", {
      error: "MESSAGE_NOT_FOUND",
      suggestion: "Please check the message ID and try again.",
    });
  }

  return {
    message: "Message deleted successfully",
  };
};

export const getMessage = async (messageId, receiverId) => {
  const result = await messageRepo.findOneDocument({
    _id: messageId,
    receiverId,
  });

  if (!result) {
    throw new NotFoundException("Message not found", {
      error: "MESSAGE_NOT_FOUND",
      suggestion: "Please check the message ID and try again.",
    });
  }

  return {
    message: "Message retrieved successfully",
    result,
  };
};
//////////////////////////////////////////////////////////////////////////////////////
