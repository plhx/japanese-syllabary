# japanese-syllabary

Japanese kana utilities: detect and convert hiragana, katakana and half-width katakana.
Zero dependencies; works in Node.js, browsers, Web Workers, Deno, Bun and bundlers.

## Install

```sh
npm install japanese-syllabary
```

## Usage

```js
// ESM
import { toHiragana, toKatakana, toHalfKatakana, isHiragana } from 'japanese-syllabary';
// CommonJS
const { toHiragana } = require('japanese-syllabary');
```

```html
<!-- Browser (global: JapaneseSyllabary) -->
<script src="https://cdn.jsdelivr.net/npm/japanese-syllabary"></script>
<script>JapaneseSyllabary.toKatakana('ひらがな');</script>
```

```js
toKatakana('ひらがな');   // 'ヒラガナ'
toHiragana('ｶﾀｶﾅ');       // 'かたかな'
toHalfKatakana('ガ');     // 'ｶﾞ'
isHiragana('あいう');     // true
```

## API

| Function | Description |
|---|---|
| `isHiragana(value)` | `true` if the string consists only of hiragana (plus space, `ー`, `・`). |
| `isKatakana(value)` | `true` if the string consists only of full-width katakana (plus space, `ー`, `・`). |
| `isHalfKatakana(value)` | `true` if the string consists only of half-width katakana (and ASCII space). |
| `normalizeKana(value)` | Composes base kana + combining (semi-)voiced mark (`か` + U+3099 → `が`). |
| `denormalizeKana(value)` | Decomposes voiced / semi-voiced kana into base + combining mark. |
| `toHiragana(value)` | Katakana / half-width katakana → hiragana. |
| `toKatakana(value)` | Hiragana / half-width katakana → full-width katakana. |
| `toHalfKatakana(value)` | Hiragana / katakana → half-width katakana. |

Empty strings are accepted by `isHiragana` and `isKatakana` (returns `true`).
Other characters are passed through unchanged by the converters.

## Development

```sh
npm install
npm test            # node:test
npm run test:vitest # vitest
npm run build       # esbuild -> dist/
```

## License

MIT
