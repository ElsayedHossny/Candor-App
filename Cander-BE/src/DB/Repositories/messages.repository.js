import BaseRepository from "./base.repository.js";
import messageModel from "../models/messages.model.js";

export default class MessageRepository extends BaseRepository {
  constructor() {
    super(messageModel);
  }
  findAllMessagesWithUserInfo(filters = {}) {
    return messageModel.find(filters);
  }
}
