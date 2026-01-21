import { Signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { Filters } from "../components/Filters.tsx";
import { useCollection } from "../contexts/Collection.ts";

export interface ControlsProps {
  editMode: Signal<boolean>;
}

export function Controls(props: ControlsProps) {
  const { collection, filters, prints, updateFromTimestamp } = useCollection();
  const totalPrints = prints.length;
  const collected = collection.value.size;
  const remaining = totalPrints - collected;
  const total = totalPrints;
  const completionPct = (Math.round((collected / total) * 1000) / 10).toString(
    10,
  );
  const showFilters = useSignal(false);
  const passwordInput = useRef<HTMLInputElement>(null);
  const statusText =
    `${completionPct}% Complete!\nCollected: ${collected} Remaining: ${remaining} Total: ${total}`;

  const saveCollection = async () => {
    console.log("saving");
    const passphrase = passwordInput.current?.value;
    const res = await fetch("/api/save-collection", {
      method: "PUT",
      body: JSON.stringify({
        passphrase,
        updateFromTimestamp: updateFromTimestamp,
        collection: Array.from(collection.value),
      }),
    });
    if (res.ok) {
      globalThis.alert("Saved");
    } else {
      globalThis.alert("Failed to save");
    }
  };

  const clipboardLoad = async () => {
    try {
      const data = await navigator.clipboard.readText();
      const newCollection = JSON.parse(data);
      if (
        Array.isArray(newCollection) && typeof newCollection[0] === "string"
      ) {
        // 6f1c8cb0-38eb-408b-94e8-16db83999b3b-foil
        collection.value = new Set(
          newCollection.filter((id) =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[a-z]+$/
              .test(id)
          ),
        );
      }
    } catch (e) {
      console.error("Failed to read clipboard collection", e);
    }
  };
  return (
    <div class="controls">
      <h1>
        <img class="forestlogo" src="favicon.png" />PSim's Forest Collection
      </h1>
      <p class="subtitle"><a target="_blank" href="mailto:mtgforestguy@gmail.com">mtgforestguy@gmail.com</a></p>
      <p>
        This page tracks the progress of the Every Forest in MTG Project. <br />
        <a href="https://www.youtube.com/watch?v=Hj1ov-S0CNA" target="_blank">
          Check it out on Youtube.
        </a>
      </p>
      <div
        class={props.editMode.value ? "clipboardbtns visible" : "clipboardbtns"}
      >
        <span>
          <a
            href="javascript:void(0)"
            onClick={() => props.editMode.value = true}
          >
            Edit Mode
          </a>
        </span>
        <input
          ref={passwordInput}
          type="password"
          name="passphrase"
          id="passphrase"
          placeholder="Passphrase"
        />
        <button onClick={saveCollection} type="button" id="save">Save</button>
        <button onClick={clipboardLoad} type="button" id="loadclip">
          📋 Load
        </button>
      </div>
      <div class="status">{statusText}</div>
      {showFilters.value
        ? (
          <>
            <hr />
            <Filters settings={filters} />
          </>
        )
        : (
          <p>
            <a
              href="javascript:void(0)"
              onClick={() => showFilters.value = true}
            >
              Show Filters
            </a>
          </p>
        )}
    </div>
  );
}
