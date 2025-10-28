import { Signal, useSignal } from "@preact/signals";

export interface ControlsProps {
  collection: Signal<Set<string>>;
  totalPrints: number;
}

export function Controls(props: ControlsProps) {
  const passphrase = useSignal("");
  const collected = props.collection.value.size;
  const remaining = props.totalPrints - collected;
  const total = props.totalPrints;
  const completionPct = (Math.round(((collected/total)*1000))/10).toString(10);
  const statusText = `${completionPct}% Complete!\nCollected: ${collected} Remaining: ${remaining} Total: ${props.totalPrints}`;

  const saveCollection = async () => {
    console.log('saving');
    const res = await fetch('/api/save-collection', {
      method: 'PUT',
      body: JSON.stringify({
        passphrase,
        collection: Array.from(props.collection.value),
      }),
    });
    if(res.ok) {
      globalThis.alert("Saved");
    } else {
      globalThis.alert("Failed to save");
    }
  };

  const clipboardLoad = async () => {
    try {
      const data = await navigator.clipboard.readText();
      const collection = JSON.parse(data);
      if(Array.isArray(collection) && typeof collection[0] === 'string') {
        // 6f1c8cb0-38eb-408b-94e8-16db83999b3b-foil
        props.collection.value = new Set(collection.filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[a-z]+$/.test(id)));
      }
    } catch(e) {
      console.error("Failed to read clipboard collection", e);
    }  
  };
  return (
    <div class="controls">
      <h1><img class="forestlogo" src="favicon.png" />PSim's Forest Collection</h1>
      <p>This page tracks the progress of the Every Forest in MTG Project. <br /><a href="https://www.youtube.com/watch?v=Hj1ov-S0CNA" target="_blank">Check it out on Youtube.</a></p>
      <div class="clipboardbtns">
        <input 
          onInput={(e) => passphrase.value = e.currentTarget.value} 
          type="password" 
          name="passphrase"
          id="passphrase" 
          placeholder="Passphrase" 
        />
        <button onClick={saveCollection} type="button" id="save">Save</button>
        <button onClick={clipboardLoad} type="button" id="loadclip">📋 Load</button>
      </div>
      <div class="status">{statusText}</div>
    </div>
  );
}
