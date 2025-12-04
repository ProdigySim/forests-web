import { Signal } from "@preact/signals";
import { JSX } from "preact";

export interface FilterSettings {
  collected: boolean;
  missing: boolean;
  nonfoil: boolean;
  foil: boolean;
}

export interface FiltersProps {
  settings: Signal<FilterSettings>;
}
export function Filters({ settings }: FiltersProps) {
  const handleChange = (e: JSX.TargetedInputEvent<HTMLInputElement>) => {
    const newSettings = { ...settings.value };
    const ct = e.currentTarget;
    switch (ct.id) {
      case "filter-collected":
        newSettings.collected = ct.checked;
        break;
      case "filter-missing":
        newSettings.missing = ct.checked;
        break;
      case "filter-nonfoil":
        newSettings.nonfoil = ct.checked;
        break;
      case "filter-foil":
        newSettings.foil = ct.checked;
        break;
    }
    settings.value = newSettings;
  };
  const sv = settings.value;
  return (
    <div>
      <h3>Filters</h3>
      <div class="filterboxes">
        <input
          type="checkbox"
          id="filter-collected"
          onChange={handleChange}
          checked={sv.collected}
        >
        </input>
        <label for="filter-collected">Collected</label>
        <input
          type="checkbox"
          id="filter-missing"
          onChange={handleChange}
          checked={sv.missing}
        >
        </input>
        <label for="filter-missing">Missing</label>
        <input
          type="checkbox"
          id="filter-nonfoil"
          onChange={handleChange}
          checked={sv.nonfoil}
        >
        </input>
        <label for="filter-nonfoil">Non-Foil</label>
        <input
          type="checkbox"
          id="filter-foil"
          onChange={handleChange}
          checked={sv.foil}
        >
        </input>
        <label for="filter-foil">Foil+</label>
      </div>
    </div>
  );
}
