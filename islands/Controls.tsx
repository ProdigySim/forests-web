import { Signal, useSignal } from "@preact/signals";

export interface ControlsProps {
  collection: Signal<Set<string>>;
}

export function Controls(props: ControlsProps) {
  const passphrase = useSignal("");
  const statusText = useSignal("");

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
      </div>
      <div class="status">{statusText}</div>
    </div>
  );
}
