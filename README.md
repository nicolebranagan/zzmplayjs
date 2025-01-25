# zzmplayjs

A JS ZZM player. Download the code and run `index.html` locally and you can open and play files. There is no build step. Note that this uses the WebAudio API, which may only be available in HTTPS contexts. The `index.html` is meant primarily as a proof of concept.

## Implementing

There are three JS files in the `static/js` folder.

* `audio.js` Use the function `playZzmAudio`, passing it a ZZT audio string (like you would pass to `#play`) in string form.
* `zzm.js` This will allow you to load ZZM files directly. `parseZzmAsText` will convert the text of a ZZM file into an object that will give the title and songs, each song with its own title as well as the string that can be passed into `playZzmAudio`.
* `ui.js` This code implements the example UI. Most implementers will not need this code, but it's left as an example.

## Credits

Some code used from the Reconstruction of ZZT <https://github.com/asiekierka/reconstruction-of-zzt/tree/master?tab=readme-ov-file>, whose license is reproduced below:

Copyright (c) 2020 Adrian Siekierka

Based on a reconstruction of code from ZZT,
Copyright 1991 Epic MegaGames, used with permission.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

