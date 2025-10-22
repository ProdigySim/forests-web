import { Signal, useSignal } from "@preact/signals";

export interface ControlsProps {
  collection: Signal<Set<string>>;
  totalPrints: number;
}

export function Controls(props: ControlsProps) {
  const passphrase = useSignal("");
  const collected = props.collection.value.size;
  const remaining = props.totalPrints - collected;
  const statusText = `Collected: ${collected} Remaining: ${remaining} Total: ${props.totalPrints}`;

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
