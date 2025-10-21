import { setPsimCollection } from "../../db/index.ts";
import { define } from "../../utils.ts";

const passphrase = Deno.env.get("UPDATE_PASSPHRASE") ?? crypto.randomUUID();
console.log("initialized with passphrase:", passphrase);
export const handler = define.handlers({
  async PUT(ctx) {
    const body = await ctx.req.json() as {
      passphrase: string;
      collection: string[];
    };
    if(body.passphrase !== passphrase) {
      return new Response(
        'Unauthorized',
        {
          status: 403
        }
      );
    }
    if(!Array.isArray(body.collection) || !body.collection.every(id => {
      return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[a-z]+$/.test(id)
    })) {
      return new Response("Invalid collection format", { status: 400 })
    }
    await setPsimCollection(JSON.stringify(body.collection));
    return new Response(null, {
      status: 204
    });
  },
});
