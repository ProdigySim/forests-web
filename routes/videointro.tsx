import { define } from "../utils.ts";
import forests from "../data/forests.json" with { type: "json" };
import type { Card } from "scryfall-api";
import { sampleSize } from "@es-toolkit/es-toolkit";
import { ForestSpinner } from "../islands/ForestSpinner.tsx";
import { type ComponentChildren, createContext, h } from "preact";

const HeadContext = createContext(false);

interface HeadProps {
  children?: ComponentChildren;
}

function Head(props: HeadProps): ComponentChildren {
  return h(HeadContext, { value: true }, props.children);
}
const parsedForests = (forests as unknown as Card[]);

export const handler = define.handlers({
  async GET(ctx) {
    return {
      data: {
        forests: sampleSize(parsedForests, 64),
      },
    };
  },
});
export default define.page<typeof handler>(function Home(ctx) {
  return <div>
      <Head>
        <link rel="stylesheet" href="/forestspinner.css" />
      </Head>
    <div class="video-screen">
      <ForestSpinner spec="outer" forests={ctx.data.forests} />
      <ForestSpinner spec="inner" forests={ctx.data.forests} />
      <div class="manasymbol"></div>
      <div class="video-title"><div><h1>The Forest Quest</h1><h2>with PSim</h2></div></div>
    </div>
  </div>;
});
