import { define } from "../utils.ts";
import forests from "../data/forests.json" with { type: "json" };
import type { Card } from "scryfall-api";
import { getPsimCollection } from "../db/index.ts";
import { sortCards } from "../utils/cards.ts";
import { Page } from "../islands/Page.tsx";

function parseCard(c: Card): Card {
  return {
    ...c,
    released_at: new Date(c.released_at),
  };
}
const parsedForests = (forests as unknown as Card[]).map(parseCard).sort(
  sortCards,
);

const flatForests = (() => {
  let id = 0;
  return parsedForests.flatMap((card) =>
    card.finishes.map((finish) => ({ id: id++, finish, card }))
  );
})();
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
  return <Page collection={ctx.data.collection} prints={ctx.data.prints} />;
});
