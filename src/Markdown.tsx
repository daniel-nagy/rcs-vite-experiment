import Markdown_ from "markdown-to-jsx";
import type { ComponentProps, ComponentType } from "react";

type P = ComponentType<ComponentProps<"p">>;

export const P: P = ({ style, ...props }) => (
  <p style={{ lineHeight: 1.875, ...style }} {...props} />
);

export const Markdown: typeof Markdown_ = ({
  options: { overrides: { p = {}, ...overrides } = {}, ...options } = {},
  ...props
}) => (
  <Markdown_
    options={{
      overrides: {
        p: {
          component: P,
          ...(p as {}),
        },
        ...overrides,
      },
      ...options,
    }}
    {...props}
  />
);
