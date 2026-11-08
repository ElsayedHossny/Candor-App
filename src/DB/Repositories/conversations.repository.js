import BaseRepository from "./base.repository.js";
import conversationModel from "../models/conversations.model.js";

export default class ConversationRepository extends BaseRepository {
  constructor() {
    super(conversationModel);
  }
  findAllMessagesWithUserInfo(filters = {}) {
    return conversationModel.find(filters);
  }
}
