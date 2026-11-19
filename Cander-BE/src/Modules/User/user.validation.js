import * as z from "zod";

export const userPagenation = z.object({
  query: z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(5),
  }),
});
