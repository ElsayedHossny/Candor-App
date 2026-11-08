import { requestStatusEnum } from "../../common/constants.js";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "../../common/Utils/Error/exception.error.js";
import MessageRepository from "../../DB/Repositories/messages.repository.js";
import RequestRepository from "../../DB/Repositories/requests.repository.js";
import UserRepository from "../../DB/Repositories/user.repository.js";
import { pagenation } from "../../common/Utils/pagenation.js";
import ConversationRepository from "../../DB/Repositories/conversations.repository.js";

const messageRepo = new MessageRepository();
const requestRepo = new RequestRepository();
const userRepo = new UserRepository();
const ConvRepo = new ConversationRepository();

export const test = () => {
  return "Hellooooo test request ";
};

export const sendRequest = async (messageId, loggedInUserId, note) => {
  // 1. Find the original message
  const messageInfo = await messageRepo.findDocumentById(messageId);

  if (!messageInfo) {
    throw new NotFoundException("Message not found", {
      field: "MessageId",
      code: "Message_NOT_FOUND",
      message: "The Messageed Message does not exist",
      suggestion: "Check the Message ID and try again",
    });
  }

  // 2. Verify message ownership
  if (messageInfo.receiverId.toString() !== loggedInUserId.toString()) {
    throw new ForbiddenException(
      "You are not allowed to send a request for this message",
      {
        field: "receiverId",
        code: "UNAUTHORIZED_REQUEST_ACTION",
        message: "Only the request receiver can accept this request",
        suggestion: "Make sure you are logged in as the request receiver",
      },
    );
  }

  // 3. Reverse sender and receiver
  const senderId = messageInfo.receiverId;
  const receiverId = messageInfo.senderId;

  // 4. Check receiver existence
  const receiverUser = await userRepo.findDocumentById(receiverId);

  if (!receiverUser) {
    throw new NotFoundException("Receiver user not found", {
      field: "receiverId",
      code: "RECEIVER_NOT_FOUND",
      message: "The receiver user does not exist",
      suggestion: "Make sure the receiver ID is valid and try again",
    });
  }

  // 5. Check existing request
  const existingRequest = await requestRepo.findOneDocument({ messageId });

  if (existingRequest) {
    throw new BadRequestException("Request already exists", {
      field: "messageId",
      code: "REQUEST_ALREADY_EXISTS",
      message: "A request has already been created for this message",
      suggestion: "You cannot send another request for the same message",
    });
  }
  // 6. Create request
  return requestRepo.createOneDocument({
    messageId,
    senderId,
    receiverId,
    note,
    requestStatus: requestStatusEnum.PENDING,
  });
};

export const ListAllRequests = async (userId, query) => {
  //pagination
  const { requestStatus, page, limit } = query;

  const filter = {
    receiverId: userId,
    ...(requestStatus && { requestStatus }),
  };

  const { pagenate, skip } = await pagenation(requestRepo, page, limit);
  const result = await requestRepo.findAllDocuments(filter, {
    populate: [
      { path: "receiverId", select: "firstName lastName email profilePicture" },
    ],
    limit,
    skip,
  });

  return {
    Requests: result,
    pagenate,
  };
};

export const acceptedRejectedRequests = async (userId, requestId, status) => {
  // 1. Find request
  const request = await requestRepo.findDocumentById(requestId);

  if (!request) {
    throw new NotFoundException("Request not found", {
      field: "requestId",
      code: "REQUEST_NOT_FOUND",
      message: "The requested request does not exist",
      suggestion: "Check the request ID and try again",
    });
  }

  // 2. Check receiver authorization
  if (request.receiverId.toString() !== userId.toString()) {
    throw new ForbiddenException("You are not allowed to perform this action", {
      field: "receiverId",
      code: "UNAUTHORIZED_REQUEST_ACTION",
      message: "Only the request receiver can perform this action",
      suggestion: "Make sure you are logged in as the request receiver",
    });
  }

  // 3. Check current status
  if (request.requestStatus !== requestStatusEnum.PENDING) {
    throw new BadRequestException("Request already processed", {
      field: "requestStatus",
      code: "REQUEST_ALREADY_PROCESSED",
      status: request.requestStatus,
      message: `This request is already ${request.requestStatus}`,
      suggestion: "You can only accept or reject pending requests",
    });
  }

  // 4. Accept or Reject
  if (status === requestStatusEnum.ACCEPTED) {
    const result = await requestRepo.findOneAndUpdateDocument(
      { _id: requestId },
      { requestStatus: requestStatusEnum.ACCEPTED },
      { new: true },
    );
    const conversation = await ConvRepo.createOneDocument({
      participants: [request.senderId, request.receiverId],
      requestId: request._id,
      originalMessageId: request.messageId,
    });

    return {
      message: "Request accepted successfully",
      result,
      conversation,
    };
  }

  if (status === requestStatusEnum.REJECTED) {
    await requestRepo.findByIdAndDeleteDocument(requestId);

    return {
      message: "Request rejected successfully",
      result: null,
    };
  }
};
