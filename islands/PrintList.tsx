import { Signal } from "@preact/signals";
import type { Card } from "scryfall-api";
import {Print} from "./Print.tsx";

interface PrintListProps {
  collection: Signal<Set<string>>;
  prints: Array<{ card: Card, finish: string }>;
}

export function PrintList(props: PrintListProps) {
  return (
    <div class="prints">
      { 
        props.prints.map(({card, finish}, i) => (
        <Print
          index={i}
          card={card}
          finish={finish}
          collection={props.collection}
          />
        ))
      }
    </div>)
}