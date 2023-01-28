# dnd-kit-tree-example

[dnd-kit](https://github.com/clauderic/dnd-kit)
is the modern, lightweight, performant, accessible
and extensible drag & drop toolkit for React.

This repository contains several examples derived from the
examples in the dnd-kit source code.

As the purpose of this code is didactic and exploratory
the code is sometimes duplicated across `src` subdirectories.
Each subdirectory is intended to be a complete,
self-contained example.

I think this is how you shoud write your examples, by the way,
to be didactic; DRY has no place in examples.

##Examples

### original

This is the source code for the
[original tree-view example](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/examples-tree-sortable--all-features) in the `original` directory, with
following changes:

- the directory strucure has been tidied up bit;
- the original code has no comments; I've added my
own comments describing what the code does;
- the dnd-kit uses some packages (`css-loader`, `postcss`, etc.)
that I didn't want to include here so I have converted the original
`.module.css` into plain `.css` files that are imported
directly into the component files;
- some minor code changes that simplifies the code
(mostly functions called once).

Take a look at the git history if you want to see the details
(look for `original code added` in the `git log`).

### MUI

This is just the original example with the plain
HTML elements replaced by [MUI](https://mui.com/) components.

## Development

The project uses [CRA](https://create-react-app.dev/)
so you can just:

```bash
yarn start
pnpm start
npm run start
```

Each example has its own route (`react-router-dom` 
is used for that).

I used [pnpm](https://pnpm.io/) in local development but any
package manager should do.
