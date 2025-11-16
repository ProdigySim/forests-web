import { getPsimCollection } from "../../db/index.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    return new Response(
      JSON.stringify(await getPsimCollection()),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
});
