import { getPsimCollection, setPsimCollection } from "../../db/index.ts";
import { define } from "../../utils.ts";

const passphrase = Deno.env.get("UPDATE_PASSPHRASE") ?? crypto.randomUUID();
console.log("initialized with passphrase:", passphrase);

function areCollectionIdsValid(coll: Array<string>): boolean {
  return Array.isArray(coll) && coll.every(id => {
    return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[a-z]+$/.test(id)
  });
}
export const handler = define.handlers({
  async PUT(ctx) {
    const body = await ctx.req.json() as {
      passphrase: string;
      updateFromTimestamp: string;
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
    if(!areCollectionIdsValid(body.collection)) {
      return new Response("Invalid collection format", { status: 400 })
    }
    // validate against last saved timestamp
    const savedTimestamp = (await getPsimCollection()).timestamp;
    if(body.updateFromTimestamp !== savedTimestamp) {
      console.log("Timestamp mismatch on save:", body.updateFromTimestamp, savedTimestamp)
      return new Response("Collection timestamp out of date. Please refresh and try again.", { status: 400 });
    }
    await setPsimCollection({
      version:'v1',
      timestamp: (new Date()).toISOString(),
      collection: body.collection,
    });
    return new Response(null, {
      status: 204
    });
  },
});
