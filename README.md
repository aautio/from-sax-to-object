Using `sax` to create objects.

## Features

- One dependency: `sax`
- `function parse(source: string): Promise<Element>`
- `function pickFirst(root: Element, name: string): Element | null`
- `function pickAll(root: Element, name: string): Array<Element>`
- 150 lines of TypeScript
- Tests included

## Example usage

```
const { parse, pickFirst } = require('from-sax-to-object')

const object = parse(
  '<hello zip="zap">world<inner/>foo<inner id="2"/>kick</hello>'
)

console.log(pickFirst(object, 'inner'))

console.log(JSON.stringify(object, null, 2))

```

will print

```
{
"name": "inner"
}
```

and

```
{
 "name": "hello",
 "children": [
  {
   "text": "world"
  },
  {
   "name": "inner"
  },
  {
   "text": "foo"
  },
  {
   "name": "inner",
   "attrs": {
    "id": "2"
   }
  },
  {
   "text": "kick"
  }
 ],
 "attrs": {
  "zip": "zap"
 }
}
```

## parse(string)

Returns the root node to the parsed xml.

- Root node is an element node.
- Each node is either an text node or element node.
- Each element node has a `name`
- Each element node can have `attrs`. It is an object with attributes as keys & values.
- Each element node can have `children` which is a array of nodes.
- Each text node carries the text value with key `text`

## pickFirst(node, string)

Looks up the node and its children to find the first element node with the specified name.

## pickAll(node, string)

Looks up the node and its children to find the all element nodes with the specified name.
