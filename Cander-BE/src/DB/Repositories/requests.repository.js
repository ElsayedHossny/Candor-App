import BaseRepository from "./base.repository.js";
import requestModel from "../models/requests.model.js";

export default class RequestRepository extends BaseRepository {
  constructor() {
    super(requestModel);
  }
}

/**
 * 
 *   findAllMessagesWithUserInfo(filters = {}) {
    return messageModel.find(filters);
  }
 */
