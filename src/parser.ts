import { parser, Tag } from "sax";
import { Element } from ".";

export function parse(source: string): Promise<Element> {
  return new Promise((resolve, reject) => {
    const saxParser = parser(true, {});

    const stack: Element[] = [];

    let root: Element;

    saxParser.onopentag = tag => {
      if (root) {
        throw new Error(
          `Root node already closed, can't open a new one for ${tag.name}`
        );
      }

      const obj: Element = {
        name: tag.name
      };

      if (Object.keys(tag.attributes).length) {
        obj.attrs = (<Tag>tag).attributes;
      }

      if (stack.length) {
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [obj];
        } else {
          parent.children.push(obj);
        }
      }

      stack.push(obj);
    };

    saxParser.onclosetag = () => {
      const obj = <Element>stack.pop();

      // filtering out all whitespace between elements
      if (obj.children) {
        obj.children = obj.children.filter(
          (node: any) => node.name || node.text.trim()
        );
      }

      if (!stack.length) {
        root = obj;
      }
    };

    function pushText(text: string) {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [{ text }];
      } else {
        parent.children.push({ text });
      }
    }

    saxParser.onopencdata = () => {
      if (!stack.length) {
        throw new Error(`Spotted CDATA outside root elements.`);
      }
    };

    saxParser.oncdata = pushText;

    saxParser.ontext = text => {
      if (!stack.length) {
        if (!text.trim()) {
          // whitespace outside root elements is perfectly fine
          return;
        }
        throw new Error(`Spotted unexpected text outside elements: \n${text}`);
      }

      pushText(text);
    };

    // spotting error situations
    let processinginstructionProcessed = false;
    saxParser.onprocessinginstruction = () => {
      if (processinginstructionProcessed) {
        throw new Error(`Second processing instruction spotted!`);
      }
      processinginstructionProcessed = true;
    };

    saxParser.onerror = reject;

    saxParser.onend = () => {
      return root ? resolve(root) : reject(new Error("No content found!"));
    };

    saxParser.write(source).close();
  });
}
