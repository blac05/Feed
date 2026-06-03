import { z } from "zod";

export const createEventSchema =
  z.object({
    title:
      z.string().min(3),

    description:
      z.string().optional(),

    location:
      z.string().optional(),

    date:
      z.string(),
  });