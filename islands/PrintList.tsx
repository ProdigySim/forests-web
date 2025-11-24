import { ReadonlySignal } from "@preact/signals";
import { Print } from "./Print.tsx";
import { useCollection } from "../contexts/Collection.ts";

interface PrintListProps {
  editMode: ReadonlySignal<boolean>;
}

export function PrintList({ editMode }: PrintListProps) {
  const { visiblePrints, collection } = useCollection();

  return (
    <div class="prints">
      {visiblePrints.value.map(({ card, finish }, i) => (
        <Print
          index={i}
          card={card}
          finish={finish}
          collection={collection}
          isEditable={editMode}
        />
      ))}
    </div>
  );
}
