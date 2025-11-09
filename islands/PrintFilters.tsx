import { Signal, useSignal } from "@preact/signals";

export interface ControlsProps {
  collection: Signal<Set<string>>;
  totalPrints: number;
}

export function Controls(props: ControlsProps) {
  return (
    <div class="printFilters">
    </div>
  );
}
