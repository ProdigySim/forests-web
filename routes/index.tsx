import { useSignal } from "@preact/signals";
import { define } from "../utils.ts";
import forests from "../data/forests.json" with { type: "json" };
import type { Card } from "scryfall-api";
import Print from "../islands/Print.tsx";
import { getPsimCollection } from "../db/index.ts";
import { Controls } from '../islands/Controls.tsx';

function parseCard(c: Card): Card {
  return {
    ...c,
    released_at: new Date(c.released_at),
  }
}
const parsedForests = (forests as unknown as Card[]).map(parseCard);

const flatForests = parsedForests.flatMap(card => card.finishes.map(finish => ({ finish, card })));
export const handler = define.handlers({
  async GET(ctx) {
    return {
      data: {
        collection: JSON.parse(await getPsimCollection()) as string[],
      }
    };
  },
});
export default define.page<typeof handler>(function Home(ctx) {
  const collection = useSignal(new Set<string>(ctx.data.collection));
  
  return (
    <div>
      <Controls collection={collection}/>
      <div class="prints">
        { 
          flatForests.map(({card, finish}, i) => (
          <Print 
            index={i}
            card={card}
            finish={finish}
            collection={collection}
            />
          ))
        }
      </div>
    </div>
  );
});
