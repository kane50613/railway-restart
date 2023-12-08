import { object, optional, parseAsync, string, transform } from "valibot";
import { transformPlugin, transformService } from "./util.js";

export const env = await parseAsync(
  object({
    PLUGINS: transform(
      optional(string()),
      (str) => str?.split(",").map(transformPlugin),
    ),
    SERVICES: transform(
      optional(string()),
      (str) => str?.split(",").map(transformService),
    ),
    RAILWAY_API_KEY: string(),
  }),
  process.env,
);
