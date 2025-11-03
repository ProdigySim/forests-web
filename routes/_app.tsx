import { define } from "../utils.ts";

function setupBaseClass() {
  function getInitialTheme() {
    const storedTheme = localStorage.getItem("theme");
    console.log("loading theme: ", storedTheme);
    if(storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }
    if(globalThis.window?.matchMedia("(prefers-color-scheme: dark)").matches) {
      return 'dark'
    }
    return 'light';
  }
  document.body.classList.toggle("darkmode", getInitialTheme() === 'dark');
}
const baseClassScript = (setupBaseClass.toString() + ";setupBaseClass();").replace(";\n", "\n");
export default define.page(function App({ Component, state }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Forests</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" type="image/png" href="favicon.png" />
      </head>
      <body>
        <script 
          dangerouslySetInnerHTML={{
            __html: baseClassScript,
          }} />
        <Component />
      </body>
    </html>
  );
});
