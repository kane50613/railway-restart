import { z } from "zod";
import { transformPlugin, transformService } from "./util.js";

export const env = z
  .object({
    PLUGINS: z
      .string()
      .transform((str) => str.split(",").map(transformPlugin))
      .nullish(),
    SERVICES: z
      .string()
      .transform((str) => str.split(",").map(transformService))
      .nullish(),
    RAILWAY_API_KEY: z.string(),
  })
  .parse(process.env);
