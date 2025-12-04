import type { Card } from "scryfall-api";
import { Collection } from "../contexts/Collection.ts";
import { SiteControls } from "./SiteControls.tsx";
import { ScrollToTop } from "./ScrollToTop.tsx";
import { Controls } from "./Controls.tsx";
import { PrintList } from "./PrintList.tsx";
import { useSignal } from "@preact/signals";
import { FilterSettings } from "../components/Filters.tsx";
import { CardCollectionDto } from "../db/index.ts";

interface PageProps {
  collection: CardCollectionDto;
  prints: Array<{ id: number; card: Card; finish: string }>;
}

export function Page({ collection: rawCollection, prints }: PageProps) {
  const collection = useSignal(new Set<string>(rawCollection.collection));
  const editMode = useSignal(false);
  const filters = useSignal<FilterSettings>({
    collected: true,
    missing: true,
    nonfoil: true,
    foil: true,
  });

  return (
    <div>
      <Collection.Provider
        value={{
          collection,
          filters,
          prints,
          updateFromTimestamp: rawCollection.timestamp,
        }}
      >
        <SiteControls />
        <ScrollToTop />
        <Controls
          editMode={editMode}
        />
        <PrintList editMode={editMode} />
      </Collection.Provider>
    </div>
  );
}
