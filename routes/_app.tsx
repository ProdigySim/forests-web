import { define } from "../utils.ts";

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
        <Component />
      </body>
    </html>
  );
});
