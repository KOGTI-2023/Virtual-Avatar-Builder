import type { JSX as ReactJSX } from "react";

declare global {
  namespace JSX {
    type Element = ReactJSX.Element;
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty
      extends ReactJSX.ElementAttributesProperty {}
    interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }
}
