import { getPsimCollection } from "../../db/index.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    return new Response(
      await getPsimCollection(),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },
});
