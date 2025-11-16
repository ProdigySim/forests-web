import { useSignal } from "@preact/signals";

export function SiteControls() {
  const theme = useSignal<"dark" | "light">(
    globalThis.document?.body.classList.contains("darkmode") ? "dark" : "light",
  );
  const toggleMode = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
    console.log("togglemode");
    globalThis.document.body.classList.toggle(
      "darkmode",
      theme.value === "dark",
    );
    globalThis.localStorage.setItem("theme", theme.value);
  };
  return (
    <div class="sitecontrols">
      <button onClick={toggleMode} type="button" id="darkmode">
        {theme.value === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}
