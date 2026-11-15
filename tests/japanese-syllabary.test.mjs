import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

// Runs under both `node --test` and vitest.
const { describe, test } = process.env.VITEST ? await import('vitest') : await import('node:test');

const require = createRequire(import.meta.url);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'src', 'japanese-syllabary.js');
const kana = require(file);
const API = ['denormalizeKana', 'isHalfKatakana', 'isHiragana', 'isKatakana',
    'normalizeKana', 'toHalfKatakana', 'toHiragana', 'toKatakana'];

const NFD = s => s.normalize('NFD');

describe('module shape', () => {
    test('exposes the documented API as a frozen object', () => {
        assert.ok(kana, 'IIFE should produce an object');
        assert.ok(Object.isFrozen(kana));
        assert.deepEqual(Object.keys(kana).sort(), [
            'denormalizeKana', 'isHalfKatakana', 'isHiragana', 'isKatakana',
            'normalizeKana', 'toHalfKatakana', 'toHiragana', 'toKatakana'
        ]);
    });
});

describe('isHiragana', () => {
    test('accepts hiragana, spaces, prolonged mark and middle dot', () => {
        for (const s of ['あいうえお', 'ぁぃぅぇぉ', 'ゔ', 'ゝゞ', 'あ い', 'あ　い', 'らーめん', 'あ・い', 'ゕゖ'])
            assert.equal(kana.isHiragana(s), true, s);
    });
    test('accepts combining voiced marks after voiceable letters', () => {
        assert.equal(kana.isHiragana('が'), true);
        assert.equal(kana.isHiragana('ぱ'), true);
    });
    test('rejects combining marks after non-applicable letters', () => {
        assert.equal(kana.isHiragana('あ゙'), false);
        assert.equal(kana.isHiragana('か゚'), false);
        assert.equal(kana.isHiragana('゙'), false);
    });
    test('rejects katakana, half-width katakana, kanji, latin, digits', () => {
        for (const s of ['ア', 'ｱ', '漢', 'a', '1', 'あA', 'ひらがなカナ'])
            assert.equal(kana.isHiragana(s), false, s);
    });
    test('empty string is accepted (documenting current behavior)', () => {
        assert.equal(kana.isHiragana(''), true);
    });
    test('rejects strings containing a newline', () => {
        assert.equal(kana.isHiragana('あ\nい'), false);
    });
});

describe('isKatakana', () => {
    test('accepts katakana, spaces, prolonged mark and middle dot', () => {
        for (const s of ['アイウエオ', 'ァィゥェォ', 'ヴ', 'ヽヾ', 'ア イ', 'ア　イ', 'ラーメン', 'ア・イ'])
            assert.equal(kana.isKatakana(s), true, s);
    });
    test('accepts combining marks after voiceable katakana', () => {
        assert.equal(kana.isKatakana('ガ'), true);
        assert.equal(kana.isKatakana('パ'), true);
    });
    test('rejects invalid combining marks', () => {
        assert.equal(kana.isKatakana('ア゙'), false);
        assert.equal(kana.isKatakana('カ゚'), false);
    });
    test('rejects hiragana, half-width katakana, kanji, latin', () => {
        for (const s of ['あ', 'ｱ', '漢', 'A', 'アあ'])
            assert.equal(kana.isKatakana(s), false, s);
    });
});

describe('isHalfKatakana', () => {
    test('accepts half-width katakana and ASCII space', () => {
        for (const s of ['ｱｲｳｴｵ', 'ｶﾞ', 'ﾊﾟ', '｡｢｣､･', 'ﾗｰﾒﾝ', 'ｱ ｲ'])
            assert.equal(kana.isHalfKatakana(s), true, s);
    });
    test('rejects full-width kana, kanji, latin', () => {
        for (const s of ['ア', 'あ', '漢', 'a', 'ｱア', 'ｱ　ｲ'])
            assert.equal(kana.isHalfKatakana(s), false, s);
    });
});

describe('normalizeKana / denormalizeKana', () => {
    test('normalizeKana composes base + combining mark', () => {
        assert.equal(kana.normalizeKana('が'), 'が');
        assert.equal(kana.normalizeKana('ぱ'), 'ぱ');
        assert.equal(kana.normalizeKana('ガ'), 'ガ');
        assert.equal(kana.normalizeKana('パ'), 'パ');
        assert.equal(kana.normalizeKana('ゔ'), 'ゔ');
        assert.equal(kana.normalizeKana('ヴ'), 'ヴ');
        assert.equal(kana.normalizeKana('ゞ'), 'ゞ');
        assert.equal(kana.normalizeKana('ヾ'), 'ヾ');
    });
    test('normalizeKana leaves other text untouched', () => {
        assert.equal(kana.normalizeKana('あいう abc 漢字'), 'あいう abc 漢字');
        assert.equal(kana.normalizeKana('あ゙'), 'あ゙');
        assert.equal(kana.normalizeKana('が'), 'が');
        assert.equal(kana.normalizeKana(''), '');
    });
    test('denormalizeKana decomposes voiced / semi-voiced letters', () => {
        assert.equal(kana.denormalizeKana('が'), 'が');
        assert.equal(kana.denormalizeKana('ぱ'), 'ぱ');
        assert.equal(kana.denormalizeKana('ガ'), 'ガ');
        assert.equal(kana.denormalizeKana('パ'), 'パ');
        assert.equal(kana.denormalizeKana('ヴ'), 'ヴ');
        assert.equal(kana.denormalizeKana('ゞ'), 'ゞ');
    });
    test('denormalizeKana leaves other text untouched', () => {
        assert.equal(kana.denormalizeKana('あかさ abc'), 'あかさ abc');
        assert.equal(kana.denormalizeKana(''), '');
    });
    test('matches Unicode NFD / NFC for every voiced and semi-voiced kana', () => {
        const all = 'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゔゞガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヾ';
        for (const ch of all) {
            assert.equal(kana.denormalizeKana(ch), NFD(ch), `denormalize ${ch}`);
            assert.equal(kana.normalizeKana(NFD(ch)), ch, `normalize ${ch}`);
        }
    });
    test('round trip', () => {
        const s = 'ぎゃがぱぴゔガパヴ、ゞヾ';
        assert.equal(kana.normalizeKana(kana.denormalizeKana(s)), s);
    });
});

describe('toKatakana', () => {
    test('converts hiragana to katakana', () => {
        assert.equal(kana.toKatakana('あいうえお'), 'アイウエオ');
        assert.equal(kana.toKatakana('がぱゔゝゞ'), 'ガパヴヽヾ');
        assert.equal(kana.toKatakana('ぁっゃ'), 'ァッャ');
    });
    test('converts half-width katakana to full-width, composing marks', () => {
        assert.equal(kana.toKatakana('ｱｲｳ'), 'アイウ');
        assert.equal(kana.toKatakana('ｶﾞﾊﾟｳﾞ'), 'ガパヴ');
        assert.equal(kana.toKatakana('｡｢｣､･ｰ'), '。「」、・ー');
    });
    test('keeps other characters', () => {
        assert.equal(kana.toKatakana('ア漢字abc 1ー'), 'ア漢字abc 1ー');
        assert.equal(kana.toKatakana(''), '');
    });
});

describe('toHiragana', () => {
    test('converts katakana to hiragana', () => {
        assert.equal(kana.toHiragana('アイウエオ'), 'あいうえお');
        assert.equal(kana.toHiragana('ガパヴヽヾ'), 'がぱゔゝゞ');
    });
    test('converts half-width katakana to hiragana', () => {
        assert.equal(kana.toHiragana('ｱｲｳ'), 'あいう');
        assert.equal(kana.toHiragana('ｶﾞﾊﾟ'), 'がぱ');
    });
    test('keeps other characters and prolonged mark', () => {
        assert.equal(kana.toHiragana('ラーメン abc漢'), 'らーめん abc漢');
    });
    test('does not convert katakana-only letters without hiragana equivalent', () => {
        // ヷヸヹヺ have no hiragana counterpart; they must not become unrelated chars
        assert.equal(kana.toHiragana('ヷ'), 'ヷ');
    });
});

describe('toHalfKatakana', () => {
    test('converts hiragana and katakana to half-width katakana', () => {
        assert.equal(kana.toHalfKatakana('あいう'), 'ｱｲｳ');
        assert.equal(kana.toHalfKatakana('アイウ'), 'ｱｲｳ');
        assert.equal(kana.toHalfKatakana('。「」、・ー'), '｡｢｣､･ｰ');
    });
    test('decomposes voiced / semi-voiced letters into base + mark', () => {
        assert.equal(kana.toHalfKatakana('がぱ'), 'ｶﾞﾊﾟ');
        assert.equal(kana.toHalfKatakana('ガパヴ'), 'ｶﾞﾊﾟｳﾞ');
    });
    test('keeps other characters', () => {
        assert.equal(kana.toHalfKatakana('漢字abc'), '漢字abc');
        assert.equal(kana.toHalfKatakana(''), '');
    });
    test('result is recognised by isHalfKatakana', () => {
        assert.equal(kana.isHalfKatakana(kana.toHalfKatakana('ぎゃがぱヴ')), true);
    });
});

describe('cross-conversion round trips', () => {
    const hira = 'あいうえおかきくけこがぎぐげごぱぴぷぺぽゔっゃー';
    test('hiragana -> half -> hiragana', () => {
        assert.equal(kana.toHiragana(kana.toHalfKatakana(hira)), hira);
    });
    test('hiragana -> katakana -> hiragana', () => {
        assert.equal(kana.toHiragana(kana.toKatakana(hira)), hira);
    });
    test('converted output satisfies the corresponding predicate', () => {
        assert.equal(kana.isHiragana(kana.toHiragana('カタカナｶﾞ')), true);
        assert.equal(kana.isKatakana(kana.toKatakana('ひらがなｶﾞ')), true);
    });
});

const source = fs.readFileSync(file, 'utf8');

describe('environment support (UMD)', () => {
    test('CommonJS: require()', () => {
        assert.deepEqual(Object.keys(require(file)).sort(), API);
    });
    test('ESM: default import', async () => {
        const m = await import(pathToFileURL(file).href);
        assert.equal(m.default.toHiragana('ｶﾞ'), 'が');
    });
    test('browser / worker: defines global JapaneseSyllabary', () => {
        const sandbox = {};
        sandbox.window = sandbox;
        vm.runInNewContext(source, sandbox);
        assert.equal(sandbox.JapaneseSyllabary.toKatakana('が'), 'ガ');
    });
    test('AMD: calls define([], factory)', () => {
        let args;
        const define = (...a) => { args = a; };
        define.amd = {};
        vm.runInNewContext(source, { define });
        assert.equal(args[0].length, 0);
        assert.deepEqual(Object.keys(args[1]()).sort(), API);
    });
    test('does not leak other globals', () => {
        const sandbox = {};
        vm.runInNewContext(source, sandbox);
        assert.deepEqual(Object.keys(sandbox), ['JapaneseSyllabary']);
    });
});

const { build } = require(path.join(root, 'build.js'));
const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'japanese-syllabary-'));
await build(dist);

describe('dist bundles', () => {
    test('cjs', () => {
        const m = require(path.join(dist, 'japanese-syllabary.cjs'));
        assert.deepEqual(Object.keys(m).sort(), API);
        assert.equal(m.toHalfKatakana('が'), 'ｶﾞ');
    });
    test('esm: named and default exports', async () => {
        const m = await import(pathToFileURL(path.join(dist, 'japanese-syllabary.mjs')).href);
        assert.deepEqual(Object.keys(m).filter(k => k !== 'default').sort(), API);
        assert.equal(m.toKatakana('が'), 'ガ');
        assert.equal(m.default.toHiragana('ｶﾞ'), 'が');
    });
    for (const name of ['japanese-syllabary.js', 'japanese-syllabary.min.js']) {
        test(`iife ${name}: global JapaneseSyllabary`, () => {
            const sandbox = {};
            vm.runInNewContext(fs.readFileSync(path.join(dist, name), 'utf8'), sandbox);
            assert.deepEqual(Object.keys(sandbox.JapaneseSyllabary).sort(), API);
            assert.equal(sandbox.JapaneseSyllabary.toHiragana('ガ'), 'が');
        });
    }
});
