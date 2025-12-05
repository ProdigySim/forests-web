import type { Card } from "scryfall-api";
import { ReadonlySignal, Signal } from "@preact/signals";
import { useMemo } from "preact/hooks";
import { toPrintId } from "../utils/cards.ts";

type CardPlus = Card & { sld_drop_name?: string };

interface PrintProps {
  index: number;
  card: Card;
  finish: string;
  collection: Signal<Set<string>>;
  isEditable: ReadonlySignal<boolean>;
}

function dateFmt(released_at: Date) {
  return released_at.toISOString().split("T")[0];
}

function shortenSetName(s: string) {
  return s
    .replace("World Championship Decks", "World Champ. Deck")
    .replace(
      "Fourth Edition Foreign Black Border",
      "4th Ed. Foreign Black Border",
    )
    .replace("The Lord of the Rings", "LotR")
    .replace("Commander Legends:", "CL:")
    .replace("Global Series", "G.S.")
    .replace("Duel Decks:", "DD:")
    .replace("Duel Decks Anthology:", "DDA:")
    .replace(
      "SpongeBob SquarePants: Lands Under the Sea",
      "SpongeBob SquarePants",
    )
    .replace("KEXP: Where the Music Matters", "KEXP")
    .replace("Special Guest: Kozyndan: The Lands", "Special Guest: Kozyndan")
    .replace("Marvel's Spider-Man: Mana Symbiote", "Spider-Man: Mana Symbiote");
}

export function Print(props: PrintProps) {
  const { index, card: origCard, finish } = props;
  const card = origCard as CardPlus;
  const image = card.image_uris
    ? card.image_uris.normal
    : card.card_faces?.[0]?.image_uris?.normal;

  const collected = props.collection.value.has(`${card.id}-${finish}`);
  const toggle = () => {
    if (!props.isEditable.value) {
      return;
    }
    const s = new Set(props.collection.value);
    if (collected) {
      s.delete(`${card.id}-${finish}`);
    } else {
      s.add(`${card.id}-${finish}`);
    }
    props.collection.value = s;
  };

  const setName = card.sld_drop_name
    ? `SLD: ${card.sld_drop_name}`
    : card.set_name;
  const displaySetName = useMemo(() => {
    return shortenSetName(setName);
  }, [setName]);
  const frontClasses = `front finish-${props.finish}`;
  return (
    <div
      onClick={toggle}
      class={"print" + (collected ? " collected" : "")}
      id={index.toString(10)}
      data-scryfall-id={card.id}
      data-finish={finish}
    >
      <div class="num">{index.toString(10).padStart(4, "0")}</div>
      <div class={frontClasses} style={{ backgroundImage: `url(${image})` }} />
      <div class="name">{displaySetName}</div>
      <div class="set">{toPrintId(card, finish)}</div>
      <div class="date">{dateFmt(card.released_at)}</div>
    </div>
  );
}
