import * as z from "zod";
import { TypeSenderReceiverEnum } from "../../common/constants.js";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  message: "Invalid ObjectId",
});

const messageSchema = z
  .object({
    content: z.string().min(3).max(50000).optional(),

    attachments: z.array(z.string()).optional(),

    senderId: objectIdSchema.optional(),

    receiverId: objectIdSchema,
  })
  .refine(
    (data) =>
      Boolean(data.content?.trim()) || (data.attachments?.length ?? 0) > 0,
    {
      message: "Message content or attachments is required.",
      path: ["content"],
    },
  );

export const messageZodSchema = z.object({
  body: messageSchema,
});

export const Type_Sender_Receriver = z.object({
  query: z.object({
    type: z
      .enum(Object.values(TypeSenderReceiverEnum))
      .default(TypeSenderReceiverEnum.RECEIVER),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(5),
  }),
});
