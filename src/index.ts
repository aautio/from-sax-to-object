export interface Attribute {
  name: string;
  value: string;
}

export interface TextNode {
  text: string;
}

export interface Element {
  name: string;
  children?: Array<Element | TextNode>;
  attrs?: { [key: string]: string };
}

export { parse } from "./parser";
export { pickFirst, pickAll } from "./selector";
