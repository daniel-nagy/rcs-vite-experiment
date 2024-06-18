import type { FC } from "react";

// vite-node enables importing static assets
import coco from "./coco.jpeg";
import { P } from "../Markdown.js";

export namespace Home {
  export type Props = {};
}

/*
 * `Home` is a server component. It renders an image and a short bio about Coco.
 */
export const Home: FC<Home.Props> = () => (
  <>
    <img
      width={256}
      src={coco}
      style={{ aspectRatio: 1, borderRadius: "100%" }}
    />
    <h1>It's ya boi, Coco</h1>
    <P>
      Yo, what's up? Name's Coco, the coolest cat on the block. I'm the ultimate
      underdog story—started from the bottom, now we here, ruling the house with
      my sharp claws and even sharper wit.
    </P>
    <P>
      Once a stray, now I'm living the high life, lounging on plush couches and
      devouring gourmet kibble. I've got the swagger, the style, and the
      attitude to match. Watch out, world, because this feline is here to stay.
    </P>
    <div style={{ marginBlock: 56 }}>
      <b>What is this?</b>
      <P>
        This is an experiment using React server components and actions with
        Vite. You can view the source code on{" "}
        <a href="https://github.com/daniel-nagy/rcs-vite-experiment">GitHub</a>.
      </P>
    </div>
  </>
);
