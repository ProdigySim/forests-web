import { useSignal, useComputed } from "@preact/signals";
import { define } from "../utils.ts";
import forests from "../data/forests.json" with { type: "json" };
import type { Card } from "scryfall-api";
import { getPsimCollection } from "../db/index.ts";
import { PrintFilterOptions, Controls } from '../islands/Controls.tsx';
import { sortCards } from '../utils/cards.ts';
import { PrintList } from '../islands/PrintList.tsx';
import { SiteControls } from "../islands/SiteControls.tsx";

function parseCard(c: Card): Card {
  return {
    ...c,
    released_at: new Date(c.released_at),
  }
}
const parsedForests = (forests as unknown as Card[]).map(parseCard).sort(sortCards);

const flatForests = parsedForests.flatMap(card => card.finishes.map(finish => ({ finish, card })));
export const handler = define.handlers({
  async GET(ctx) {
    return {
      data: {
        collection: JSON.parse(await getPsimCollection()) as string[],
        prints: flatForests
      }
    };
  },
});
export default define.page<typeof handler>(function Home(ctx) {
  const collection = useSignal(new Set<string>(ctx.data.collection));
  
  const printFilterOptions = useSignal<PrintFilterOptions>({
    finishMode: 'nonfoil',
  });
  printFilterOptions.subscribe(x => console.log("CHANGE", x));
  const displayPrints = useComputed(() => {
    switch(printFilterOptions.value.finishMode) {
      case 'both': return ctx.data.prints;
      case 'nonfoil': return ctx.data.prints.filter(x => x.finish === 'nonfoil');
      case 'foil+': return ctx.data.prints.filter(x => x.finish !== 'nonfoil');
    }
    return ctx.data.prints;
  });
  const displayedCollection = useComputed(() => {
    switch(printFilterOptions.value.finishMode) {
      case 'both': return Array.from(collection.value);
      case 'nonfoil': return Array.from(collection.value).filter(x => x.endsWith("nonfoil"));
      case 'foil+': return Array.from(collection.value).filter(x => !x.endsWith('nonfoil'));
    }
  })
  return (
    <div>
      <SiteControls  />
      <Controls printFilterOptions={printFilterOptions} totalPrints={displayPrints.value.length} collection={collection} displayedCollection={displayedCollection} />
      <PrintList collection={collection} prints={displayPrints.value}/>
    </div>
  );
});
