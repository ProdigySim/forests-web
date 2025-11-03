import { Signal, useSignal, useSignalEffect } from "@preact/signals";

export function SiteControls() {
  const mode = useSignal<"dark" | "light">("light");
  const toggleMode = () => {
    if(mode.value === "dark") {
      mode.value = "light";
    } else {
      mode.value = "dark";
    }
  }
  mode.subscribe((modeVal) => {
    globalThis.document?.body.classList.toggle("darkmode", modeVal === "dark");
    globalThis.localStorage?.setItem("theme", modeVal);
  });
  useSignalEffect(() => {
    mode.value = localStorage.getItem("theme") as "dark" | "light" ?? 'light';
  });

  return (
    <div class="sitecontrols">
        <button onClick={toggleMode} type="button" id="darkmode">{ mode.value === "dark" ? 'Light Mode' : 'Dark Mode'}</button>
    </div>
  );
}
