import { ReadonlySignal, signal, Signal, useComputed } from "@preact/signals";
import { Card } from "scryfall-api";
import { FilterSettings } from "../components/Filters.tsx";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { groupBy } from '@es-toolkit/es-toolkit';

interface CardPrint {
  id: number;
  card: Card;
  finish: string;
}
export interface CollectionCtx {
  updateFromTimestamp: string;
  collection: Signal<Set<string>>;
  prints: Array<CardPrint>;
  filters: Signal<FilterSettings>;
}

export interface CollectionInfo extends CollectionCtx {
  visiblePrints: ReadonlySignal<Array<CardPrint>>;
}

export const Collection = createContext<CollectionCtx>({
  updateFromTimestamp: '',
  collection: signal(new Set<string>()),
  prints: [],
  filters: signal({
    collected: true,
    missing: true,
    nonfoil: true,
    foil: true,
  }),
});

export function useCollection(): CollectionInfo {
  const { filters, collection, prints, updateFromTimestamp } = useContext(Collection);
  
  const printsByFinish = useComputed(() => {
    return groupBy(prints, ({finish}) => finish === 'nonfoil' ? 'nonfoil' : 'foil');
  });
  const visiblePrints = useComputed(() => {
    console.log("Updating prints");
    if(Object.values(filters.value).every(x => !!x)) {
      return prints;
    }
    const fv = filters.value;
    const collectionFilter = ({card, finish}: CardPrint) => {
      if(collection.value.has(`${card.id}-${finish}`)) {
        return filters.value.collected;
      }
      return filters.value.missing;
    }
    if(fv.foil && fv.nonfoil) {
      return prints.filter(collectionFilter);
    } else if (fv.foil) {
      return printsByFinish.value.foil.filter(collectionFilter);
    } else if (fv.nonfoil) {
      return printsByFinish.value.nonfoil.filter(collectionFilter);
    } else return [];
  });
  return {
    filters,
    collection,
    prints,
    visiblePrints,
    updateFromTimestamp,
  };
}
