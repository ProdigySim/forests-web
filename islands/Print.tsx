import type { Card } from "scryfall-api";
import { Signal } from "@preact/signals";

interface PrintProps {
  index: number;
  card: Card;
  finish: string;
  collection: Signal<Set<string>>;
}

function dateFmt(released_at: Date) {
  return released_at.toISOString().split("T")[0];
}
function toCardId(c: Card) {
  const collNumFixed = c.collector_number.replace("★", "");
  return `${c.set.toUpperCase()} ${collNumFixed}`;
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
    .replace("Duel Decks Anthology:", "DDA:");
}

function foilText(card: Card, finish: string) {
  const promoTypeFoils = card.promo_types?.find((x) =>
    x.includes("foil")
  ) as string;
  switch (promoTypeFoils) {
    case "surgefoil":
      return "SURGE ";
    case "galaxyfoil":
      return "GALAXY ";
    case "ripplefoil":
      return "RIPPLE ";
    default:
      return finish === "nonfoil" ? "" : `${finish.toUpperCase()} `;
  }
}

export function Print(props: PrintProps) {
  const { index, card, finish } = props;
  const image = card.image_uris
    ? card.image_uris.normal
    : card.card_faces?.[0]?.image_uris?.normal;
  const finishText = foilText(card, finish);

  const collected = props.collection.value.has(`${card.id}-${finish}`);
  const toggle = () => {
    const s = new Set(props.collection.value);
    if (collected) {
      s.delete(`${card.id}-${finish}`);
    } else {
      s.add(`${card.id}-${finish}`);
    }
    props.collection.value = s;
  };
  return (
    <div
      onClick={toggle}
      class={"print" + (collected ? " collected" : "")}
      id={index.toString(10)}
      data-scryfall-id={card.id}
      data-finish={finish}
    >
      <div class="num">{index.toString(10).padStart(4, "0")}</div>
      <img class="front" src={image} />
      <div class="name">{shortenSetName(card.set_name)}</div>
      <div class="set">{finishText}{toCardId(card)}</div>
      <div class="date">{dateFmt(card.released_at)}</div>
    </div>
  );
}
