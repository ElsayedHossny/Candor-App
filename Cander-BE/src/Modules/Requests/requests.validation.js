import * as z from "zod";
import { requestStatusEnum } from "../../common/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "Invalid ObjectId",
});

const requestSchema = z.object({
  note: z.string().min(3).max(100),
  messageId: objectIdSchema,
  senderId: objectIdSchema,
  receiverId: objectIdSchema,
  status: z.enum(Object.values(requestStatusEnum)),
});

export const requestZodSchema = z.object({
  body: requestSchema,
});
export const createRequestZodSchema = z.object({
  body: z.object({
    note: z.string().min(3).max(100),
  }),
});

export const getAllRequestsZodSchema = z.object({
  query: z.object({
    requestStatus: z
      .enum(Object.values(requestStatusEnum))
      .or(z.literal(""))
      .optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(5),
  }),
});
