import { Element } from ".";

export function pickFirst(root: Element, name: string): Element | null {
  const queue = [root];

  while (queue.length) {
    const candidate = <Element>queue.shift();
    if (candidate.name === name) {
      return candidate;
    }

    if (candidate.children) {
      queue.push.apply(queue, <Array<Element>>(
        candidate.children.filter(item => (<Element>item).name)
      ));
    }
  }

  return null;
}

export function pickAll(root: Element, name: string): Array<Element> {
  const queue = [root];

  const result = <Array<Element>>[];
  while (queue.length) {
    const candidate = <Element>queue.shift();
    if (candidate.name === name) {
      result.push(candidate);
    }

    if (candidate.children) {
      queue.push.apply(queue, <Array<Element>>(
        candidate.children.filter(item => (<Element>item).name)
      ));
    }
  }

  return result;
}
