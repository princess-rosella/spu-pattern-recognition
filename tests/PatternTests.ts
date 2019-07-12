/*
 * Copyright (c) 2019 Princess Rosella. All rights reserved.
 *
 * @LICENSE_HEADER_START@
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @LICENSE_HEADER_END@
 */

import { MatchInfo, Pattern, PlusQualifier, StarQualifier, EqualPattern, CapturePattern, SequencePattern } from "../lib/index";

import { describe } from "mocha";
import *  as assert from "assert";

describe("Pattern", function() {
    describe("StarPattern", function() {
        describe("Greedy", function() {
            const pattern = new CapturePattern("star", new StarQualifier(new EqualPattern((a) => a === "a")));

            it("match no prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 4);
            });

            it("match no prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 4);
            });

            it("match with prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "baaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 0);
            });

            it("match with prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "baaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 0);
            });
        });

        describe("Lazy", function() {
            const pattern = new CapturePattern("star", new StarQualifier(new EqualPattern((a) => a === "a"), true));

            it("match no prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 0);
            });

            it("match no prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 0);
            });

            it("match with prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "baaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 0);
            });

            it("match with prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "baaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 0);
            });
        });
    });

    describe("PlusPattern", function() {
        describe("Greedy", function() {
            const pattern = new CapturePattern("plus", new PlusQualifier(new EqualPattern((a) => a === "a")));

            it("match no prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 0);
                assert.strictEqual(match.context.captures["plus"].end, 4);
            });

            it("match no prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 0);
                assert.strictEqual(match.context.captures["plus"].end, 4);
            });

            it("match with prefix, no suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaa"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 1);
                assert.strictEqual(match.context.captures["plus"].end, 5);
            });

            it("match with prefix, with suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaab"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 1);
                assert.strictEqual(match.context.captures["plus"].end, 5);
            });
        });

        describe("Lazy", function() {
            const pattern = new CapturePattern("plus", new PlusQualifier(new EqualPattern((a) => a === "a"), true));

            it("match no prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 0);
                assert.strictEqual(match.context.captures["plus"].end, 1);
            });

            it("match no prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 0);
                assert.strictEqual(match.context.captures["plus"].end, 1);
            });

            it("match with prefix, no suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaa"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 1);
                assert.strictEqual(match.context.captures["plus"].end, 2);
            });

            it("match with prefix, with suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaab"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus"].start, 1);
                assert.strictEqual(match.context.captures["plus"].end, 2);
            });
        });
    });

    describe("SequencePattern", function() {
        describe("Star(G) + Plus(G)", function() {
            const pattern = new SequencePattern([
                new StarQualifier(new CapturePattern("star", new EqualPattern((a) => a === "a"))),
                new PlusQualifier(new CapturePattern("plus", new EqualPattern((a) => a === "a"))),
            ]);

            it("match no prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 3);
                assert.strictEqual(match.context.captures["plus"].start, 3);
                assert.strictEqual(match.context.captures["plus"].end, 4);
            });

            it("match no prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 0);
                assert.strictEqual(match.context.captures["star"].end, 3);
                assert.strictEqual(match.context.captures["plus"].start, 3);
                assert.strictEqual(match.context.captures["plus"].end, 4);
            });

            it("match with prefix, no suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaa"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 1);
                assert.strictEqual(match.context.captures["star"].end, 4);
                assert.strictEqual(match.context.captures["plus"].start, 4);
                assert.strictEqual(match.context.captures["plus"].end, 5);
            });

            it("match with prefix, with suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaab"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["star"].start, 1);
                assert.strictEqual(match.context.captures["star"].end, 4);
                assert.strictEqual(match.context.captures["plus"].start, 4);
                assert.strictEqual(match.context.captures["plus"].end, 5);
            });
        });

        describe("Plus(L) + Plus(L)", function() {
            const pattern = new SequencePattern([
                new PlusQualifier(new CapturePattern("plus1", new EqualPattern((a) => a === "a")), true),
                new PlusQualifier(new CapturePattern("plus2", new EqualPattern((a) => a === "a")), true),
            ]);

            it("match no prefix, no suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus1"].start, 0);
                assert.strictEqual(match.context.captures["plus1"].end, 1);
                assert.strictEqual(match.context.captures["plus2"].start, 1);
                assert.strictEqual(match.context.captures["plus2"].end, 2);
            });

            it("match no prefix, with suffix", function() {
                const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus1"].start, 0);
                assert.strictEqual(match.context.captures["plus1"].end, 1);
                assert.strictEqual(match.context.captures["plus2"].start, 1);
                assert.strictEqual(match.context.captures["plus2"].end, 2);
            });

            it("match with prefix, no suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaa"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaa");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus1"].start, 1);
                assert.strictEqual(match.context.captures["plus1"].end, 2);
                assert.strictEqual(match.context.captures["plus2"].start, 2);
                assert.strictEqual(match.context.captures["plus2"].end, 3);
            });

            it("match with prefix, with suffix", function() {
                assert.strictEqual(Pattern.match<string>(pattern, "baaaab"), null);
                const match = <MatchInfo<string>>Pattern.search<string>(pattern, "baaaab");
                assert.notStrictEqual(match, null);
                assert.strictEqual(match.context.captures["plus1"].start, 1);
                assert.strictEqual(match.context.captures["plus1"].end, 2);
                assert.strictEqual(match.context.captures["plus2"].start, 2);
                assert.strictEqual(match.context.captures["plus2"].end, 3);
            });
        });

        it("Plus(L) + Plus(L) + Equal", function() {
            const pattern = new SequencePattern([
                new PlusQualifier(new CapturePattern("plus1", new EqualPattern((a) => a === "a")), true),
                new PlusQualifier(new CapturePattern("plus2", new EqualPattern((a) => a === "a")), true),
                new EqualPattern((a) => a === "b"),
            ]);

            const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
            assert.notStrictEqual(match, null);
            assert.strictEqual(match.context.captures["plus1"].start, 0);
            assert.strictEqual(match.context.captures["plus1"].end, 1);
            assert.strictEqual(match.context.captures["plus2"].start, 1);
            assert.strictEqual(match.context.captures["plus2"].end, 4);
        });

        it("Star(L) + Plus(L) + Equal", function() {
            const pattern = new SequencePattern([
                new CapturePattern("star", new StarQualifier(new EqualPattern((a) => a === "a"), true)),
                new CapturePattern("plus", new PlusQualifier(new EqualPattern((a) => a === "a"), true)),
                new EqualPattern((a) => a === "b"),
            ]);

            const match = <MatchInfo<string>>Pattern.match<string>(pattern, "aaaab");
            assert.notStrictEqual(match, null);
            assert.strictEqual(match.context.captures["star"].start, 0);
            assert.strictEqual(match.context.captures["star"].end, 0);
            assert.strictEqual(match.context.captures["plus"].start, 0);
            assert.strictEqual(match.context.captures["plus"].end, 4);
        });

        it("Plus(Plus + Plus) + Equal", function() {
            const pattern = new SequencePattern([
                new PlusQualifier(
                    new CapturePattern("plus", 
                        new SequencePattern([
                            new PlusQualifier(new EqualPattern((a) => a === "x")),
                            new PlusQualifier(new EqualPattern((a) => a === "x")),
                        ]),
                    ),
                ),
                new EqualPattern((a) => a === "y"),
            ]);

            const match = <MatchInfo<string>>Pattern.match<string>(pattern, "xxxxxxxxxxy");
            assert.notStrictEqual(match, null);
            assert.strictEqual(match.start, 0);
            assert.strictEqual(match.end, 11);
            assert.strictEqual(match.context.captures["plus"].start, 0);
            assert.strictEqual(match.context.captures["plus"].end, 10);
        });
    });
});

export function PatternTests() {
}
