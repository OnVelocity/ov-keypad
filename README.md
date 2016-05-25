# ov-keypad [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Extend a 4x4 matrix keypad into an Alpha-Numeric keypad with six function keys and extended characters.

Note only compatible with ECMAScript 6 (ES6).

```
4x4 Matrix with Keys labeled as follows:
1 2 3 F
4 5 6 C
7 8 9 D
A 0 B C

Interpret multiple key presses to return extended characters:
1) 1 . @ _ :
2) 2 a b c |
3) 3 d e f !
4) 4 g h i $
5) 5 j k l /
6) 6 m n o ,
7) 7 p q r s
8) 8 t u v \
9) 9 w x y z
0) 0 ? + - =
A) F1 * space #
B) F2
C) F3
D) F4
E) F5
F) F6
```

## Installation

```sh
$ npm install --save ov-keypad
```

## Usage

```js
var ovKeypad = require('ov-keypad');

var keypad = new ovKeypad();
```
## License

MIT © [OnVelocity]()


[npm-image]: https://badge.fury.io/js/ov-keypad.svg
[npm-url]: https://npmjs.org/package/ov-keypad
[travis-image]: https://travis-ci.org/OnVelocity/ov-keypad.svg?branch=master
[travis-url]: https://travis-ci.org/OnVelocity/ov-keypad
[daviddm-image]: https://david-dm.org/OnVelocity/ov-keypad.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/OnVelocity/ov-keypad
[coveralls-image]: https://coveralls.io/repos/OnVelocity/ov-keypad/badge.svg
[coveralls-url]: https://coveralls.io/r/OnVelocity/ov-keypad
