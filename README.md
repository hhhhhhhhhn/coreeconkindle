# [Core Econ](https://core-econ.org/the-economy/) for the Kindle
This repo contains a script to make the [The Economy 2.0: Microeconomics](https://core-econ.org/the-economy/)
epub kindle-compatible (particularly, [KOReader](https://koreader.rocks/) compatible, as my kindle is jailbroken).

The regular epub uses [MathJax](https://www.mathjax.org) to render math equations,
which requires the reader program to implement Javascript.
This script simply loads each chapter into [Puppeteer](https://pptr.dev/),
waits for MathJax to load the equations,
and uses the HTML for the new epub file.
Additionally, it removes the global SVG cache,
which is not compatible with KOReader,
increases the equations' font size,
and removes all Javascript files and `<script>` tags.

The approach is a bit janky,
but it has the best results.
I tried using [KaTeX](https://katex.org/),
but the KaTeX parser is a bit to strict for some of the LaTeX
errors in the original epub,
and even after manually fixing errors,
the output still had some inconsistencies.
Likewise, using MathJax with CHTML output,
yielded an perfect result for some ebook readers,
but KOReader didn't render fractions correctly.

## Usage
The typical usage is:

```shell
# Install dependencies
bun install

# Unzip the epub into book/
mkdir book
cd book
cp ../../the-economy-2-0-microeconomics-epub.epub .
unzip the-economy-2-0-microeconomics-epub.epub
rm the-economy-2-0-microeconomics-epub.epub
cd ..

# Run the script
bun run index.ts

# Zip the ebook
cd dist/
zip -r finalresult.epub .
```

You may, before zipping the final result,
remove unnecessary files from the `dist/` directory,
including audio files.

## A Note
The original book is [licensed under CC BY-NC-ND 4.0](https://www.core-econ.org/terms-of-use/).
Thus, this repo does and will not contain content nor derivatives of the book
(like the original or the kindle-compatible epub file).
This repo does contain a script to create a derivative work,
and as per the original license, you may not redistribute the modified epubs.
Please verify compliance the website above before doing anything.
