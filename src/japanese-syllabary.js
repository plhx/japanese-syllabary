/**
 * @file japanese-syllabary.js
 * @version 1.0.0
 * @copyright 2026 PlasticHeart
 */

/**
 * UMD: CommonJS (Node.js, Bun, bundlers), AMD (RequireJS), and browser / Web Worker /
 * Deno globals (`JapaneseSyllabary`). ESM can `import` it as a default import from CommonJS.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.JapaneseSyllabary = factory();
    }
})(
    typeof globalThis !== 'undefined' ? globalThis
        : typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
        : this,
    () => {
    const voiceableHiragana = String.fromCodePoint(
        0x3046, 0x304b, 0x304d, 0x304f, 0x3051, 0x3053, 0x3055, 0x3057,
        0x3059, 0x305b, 0x305d, 0x305f, 0x3061, 0x3064, 0x3066, 0x3068,
        0x306f, 0x3072, 0x3075, 0x3078, 0x307b, 0x309d
    );
    const voiceableKatakana = String.fromCodePoint(
        0x30a6, 0x30ab, 0x30ad, 0x30af, 0x30b1, 0x30b3, 0x30b5, 0x30b7,
        0x30b9, 0x30bb, 0x30bd, 0x30bf, 0x30c1, 0x30c4, 0x30c6, 0x30c8,
        0x30cf, 0x30d2, 0x30d5, 0x30d8, 0x30db, 0x30fd
    );
    const voicedHiragana = String.fromCodePoint(
        0x3094, 0x304c, 0x304e, 0x3050, 0x3052, 0x3054, 0x3056, 0x3058,
        0x305a, 0x305c, 0x305e, 0x3060, 0x3062, 0x3065, 0x3067, 0x3069,
        0x3070, 0x3073, 0x3076, 0x3079, 0x307c, 0x309e
    );
    const voicedKatakana = String.fromCodePoint(
        0x30f4, 0x30ac, 0x30ae, 0x30b0, 0x30b2, 0x30b4, 0x30b6, 0x30b8,
        0x30ba, 0x30bc, 0x30be, 0x30c0, 0x30c2, 0x30c5, 0x30c7, 0x30c9,
        0x30d0, 0x30d3, 0x30d6, 0x30d9, 0x30dc, 0x30fe
    );
    const semiVoiceableHiragana = String.fromCodePoint(
        0x306f, 0x3072, 0x3075, 0x3078, 0x307b
    );
    const semiVoiceableKatakana = String.fromCodePoint(
        0x30cf, 0x30d2, 0x30d5, 0x30d8, 0x30db
    );
    const semiVoicedHiragana = String.fromCodePoint(
        0x3071, 0x3074, 0x3077, 0x307a, 0x307d
    );
    const semiVoicedKatakana = String.fromCodePoint(
        0x30d1, 0x30d4, 0x30d7, 0x30da, 0x30dd
    );
    const fullKatakanaLetters = String.fromCodePoint(
        0x3002, 0x300c, 0x300d, 0x3001, 0x30fb, 0x30f2, 0x30a1, 0x30a3,
        0x30a5, 0x30a7, 0x30a9, 0x30e3, 0x30e5, 0x30e7, 0x30c3, 0x30fc,
        0x30a2, 0x30a4, 0x30a6, 0x30a8, 0x30aa, 0x30ab, 0x30ad, 0x30af,
        0x30b1, 0x30b3, 0x30b5, 0x30b7, 0x30b9, 0x30bb, 0x30bd, 0x30bf,
        0x30c1, 0x30c4, 0x30c6, 0x30c8, 0x30ca, 0x30cb, 0x30cc, 0x30cd,
        0x30ce, 0x30cf, 0x30d2, 0x30d5, 0x30d8, 0x30db, 0x30de, 0x30df,
        0x30e0, 0x30e1, 0x30e2, 0x30e4, 0x30e6, 0x30e8, 0x30e9, 0x30ea,
        0x30eb, 0x30ec, 0x30ed, 0x30ef, 0x30f3, 0x3099, 0x309a
    );
    const halfKatakanaLetters = String.fromCodePoint(
        0xff61, 0xff62, 0xff63, 0xff64, 0xff65, 0xff66, 0xff67, 0xff68,
        0xff69, 0xff6a, 0xff6b, 0xff6c, 0xff6d, 0xff6e, 0xff6f, 0xff70,
        0xff71, 0xff72, 0xff73, 0xff74, 0xff75, 0xff76, 0xff77, 0xff78,
        0xff79, 0xff7a, 0xff7b, 0xff7c, 0xff7d, 0xff7e, 0xff7f, 0xff80,
        0xff81, 0xff82, 0xff83, 0xff84, 0xff85, 0xff86, 0xff87, 0xff88,
        0xff89, 0xff8a, 0xff8b, 0xff8c, 0xff8d, 0xff8e, 0xff8f, 0xff90,
        0xff91, 0xff92, 0xff93, 0xff94, 0xff95, 0xff96, 0xff97, 0xff98,
        0xff99, 0xff9a, 0xff9b, 0xff9c, 0xff9d, 0xff9e, 0xff9f
    );

    const voiceableLetters = voiceableHiragana + voiceableKatakana;
    const voicedLetters = voicedHiragana + voicedKatakana;
    const semiVoiceableLetters = semiVoiceableHiragana + semiVoiceableKatakana;
    const semiVoicedLetters = semiVoicedHiragana + semiVoicedKatakana;

    const voiceableToVoicedMap = Object.fromEntries(
        [...voiceableLetters].map((x, i) => [x, voicedLetters[i]])
    );
    const voicedToVoiceableMap = Object.fromEntries(
        [...voiceableLetters].map((x, i) => [voicedLetters[i], x])
    );
    const semiVoiceableToSemiVoicedMap = Object.fromEntries(
        [...semiVoiceableLetters].map((x, i) => [x, semiVoicedLetters[i]])
    );
    const semiVoicedToSemiVoiceableMap = Object.fromEntries(
        [...semiVoiceableLetters].map((x, i) => [semiVoicedLetters[i], x])
    );
    const fullToHalfKatakanaMap = Object.fromEntries(
        [...fullKatakanaLetters].map((x, i) => [x, halfKatakanaLetters[i]])
    );
    const halfToFullKatakanaMap = Object.fromEntries(
        [...fullKatakanaLetters].map((x, i) => [halfKatakanaLetters[i], x])
    );

    const hiraganaPattern = new RegExp(
        `^([\u0020\u3000\u3041-\u3096\u309d\u309e\u30fb\u30fc]`
            + `|[${voiceableHiragana}]\u3099`
            + `|[${semiVoiceableHiragana}]\u309a)*$`
    );
    const katakanaPattern = new RegExp(
        `^([\u0020\u3000\u30a1-\u30f6\u30fd\u30fe\u30fb\u30fc]`
            + `|[${voiceableKatakana}]\u3099`
            + `|[${semiVoiceableKatakana}]\u309a)*$`
    );
    const halfKatakanaPattern = new RegExp(`^[\u0020\uff61-\uff9f]*$`);
    const combiningLetterPattern = new RegExp(`([${voiceableLetters}])\u3099|([${semiVoiceableLetters}])\u309a`, 'g');
    const normalizedLetterPattern = new RegExp(`([${voicedLetters}])|([${semiVoicedLetters}])`, 'g');

    function hiraganaToKatakana(value) {
        return String.fromCodePoint(...[...value].map(x => {
            const c = x.codePointAt(0);
            return 0x3041 <= c && c <= 0x3094 || c == 0x309d || c == 0x309e ? c + 0x60 : c;
        }));
    };

    function katakanaToHiragana(value) {
        return String.fromCodePoint(...[...value].map(x => {
            const c = x.codePointAt(0);
            return 0x30a1 <= c && c <= 0x30f4 || c == 0x30fd || c == 0x30fe ? c - 0x60 : c;
        }));
    };

    function katakanaToHalfKatakana(value) {
        return [...denormalizeKana(value)].map(x => fullToHalfKatakanaMap[x] ?? x).join('');
    };

    function halfKatakanaToKatakana(value) {
        return normalizeKana([...value].map(x => halfToFullKatakanaMap[x] ?? x).join(''));
    };

    /**
        * @param {string} value
        * @returns {boolean}
        */
    function isHiragana(value) {
        return hiraganaPattern.test(value);
    };

    /**
        * @param {string} value
        * @returns {boolean}
        */
    function isKatakana(value) {
        return katakanaPattern.test(value);
    };

    /**
        * @param {string} value
        * @returns {boolean}
        */
    function isHalfKatakana(value) {
        return halfKatakanaPattern.test(value);
    };

    /**
        * @param {string} value
        * @returns {string}
        */
    function normalizeKana(value) {
        return value.replace(combiningLetterPattern, (_, s, sv) => s
            ? voiceableToVoicedMap[s]
            : semiVoiceableToSemiVoicedMap[sv]
        );
    };

    /**
        * @param {string} value
        * @returns {string}
        */
    function denormalizeKana(value) {
        return value.replace(normalizedLetterPattern, (_, s, sv) => s
            ? voicedToVoiceableMap[s] + '\u3099'
            : semiVoicedToSemiVoiceableMap[sv] + '\u309a'
        );
    };

    /**
        * @param {string} value
        * @returns {string}
        */
    function toHiragana(value) {
        return katakanaToHiragana(halfKatakanaToKatakana(value));
    };

    /**
        * @param {string} value
        * @returns {string}
        */
    function toKatakana(value) {
        return halfKatakanaToKatakana(hiraganaToKatakana(value));
    };

    /**
        * @param {string} value
        * @returns {string}
        */
    function toHalfKatakana(value) {
        return katakanaToHalfKatakana(hiraganaToKatakana(value));
    };

    return Object.freeze({
        isHiragana,
        isKatakana,
        isHalfKatakana,
        normalizeKana,
        denormalizeKana,
        toHiragana,
        toKatakana,
        toHalfKatakana
    });
    }
);
