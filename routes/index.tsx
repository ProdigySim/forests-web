import { useSignal } from "@preact/signals";
import { define } from "../utils.ts";
import forests from "../data/forests.json" with { type: "json" };
import type { Card } from "scryfall-api";
import { getPsimCollection } from "../db/index.ts";
import { Controls } from "../islands/Controls.tsx";
import { sortCards } from "../utils/cards.ts";
import { PrintList } from "../islands/PrintList.tsx";
import { SiteControls } from "../islands/SiteControls.tsx";

function parseCard(c: Card): Card {
  return {
    ...c,
    released_at: new Date(c.released_at),
  };
}
const parsedForests = (forests as unknown as Card[]).map(parseCard).sort(
  sortCards,
);

const flatForests = parsedForests.flatMap((card) =>
  card.finishes.map((finish) => ({ finish, card }))
);
export const handler = define.handlers({
  async GET(ctx) {
    return {
      data: {
        collection: await getPsimCollection(),
        prints: flatForests,
      },
    };
  },
});
export default define.page<typeof handler>(function Home(ctx) {
  const collection = useSignal(new Set<string>(ctx.data.collection.collection));

  return (
    <div>
      <SiteControls />
      <Controls
        totalPrints={ctx.data.prints.length}
        updateFromTimestamp={ctx.data.collection.timestamp}
        collection={collection}
      />
      <PrintList collection={collection} prints={ctx.data.prints} />
    </div>
  );
});
