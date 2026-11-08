import BaseRepository from "./base.repository.js";
import privateMessageModel from "../models/privateconversation.model.js";

export default class PrivateConversationRepository extends BaseRepository {
  constructor() {
    super(privateMessageModel);
  }
  findAllMessagesWithUserInfo(filters = {}) {
    return privateMessageModel.find(filters);
  }
}
