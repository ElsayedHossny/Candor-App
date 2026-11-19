import { Router } from "express";

import * as requestsServices from "./requests.service.js";
import { authentication } from "../../Middleware/authentication.middleware.js";
import { ValidationMiddleWare } from "../../Middleware/validation.middleware.js";
import { getAllRequestsZodSchema } from "./requests.validation.js";

const requestRouter = new Router();

requestRouter.get("/", (req, res, next) => {
  const result = requestsServices.test();
  res.json({ message: "message Good", result });
});

// receiver have an account and send this request

/**
 * @api{/identity-message/:messageId}
 *
 * i need {
 * 1 - userid (sender request) from req.authUser
 * 2 - receiverId ::
 * 3 - messageId From Params
 * 4 - note (optional)
 * 5 - request Status (pending)
 * }
 */

requestRouter.post(
  "/identity-message/:messageId",
  authentication,
  async (req, res, next) => {
    const {
      body: { note },
      params: { messageId },
    } = await req;

    const loggedInUserId = req.authUser.id;

    const result = await requestsServices.sendRequest(
      messageId,
      loggedInUserId,
      note,
    );
    res.json({ message: "message Good", result });
  },
);
//////////////////////////////////////////
requestRouter.get(
  "/getallrequests",
  authentication,
  ValidationMiddleWare(getAllRequestsZodSchema),
  async (req, res, next) => {
    const result = await requestsServices.ListAllRequests(
      req.authUser.id,
      req.validate.query,
    );
    res.status(201).json({
      message: "Messages retrieved successfully",
      result,
    });
  },
);

//////////////////////////////////////////
requestRouter.patch(
  "/accepted-request/:requestId",
  authentication,
  async (req, res, next) => {
    const response = await requestsServices.acceptedRejectedRequests(
      req.authUser.id,
      req.params.requestId,
      req.body.status,
    );

    res.status(200).json(response);
  },
);

export default requestRouter;
