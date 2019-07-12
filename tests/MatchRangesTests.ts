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

import { MatchRanges } from "../lib/index";

import { describe } from "mocha";
import *  as assert from "assert";

export function MatchRangesTests() {
}

describe("MatchRanges", function() {
    describe("#constructor", function() {
        it("should be construct", function() {
            const range = new MatchRanges(1, 2);
            assert.strictEqual(range.start, 1);
            assert.strictEqual(range.last, 1);
            assert.strictEqual(range.end, 2);
        });

        it("should construct empty", function() {
            const range = new MatchRanges(1, 1);
            assert.strictEqual(range.start, 1);
            assert.strictEqual(range.last, 0);
            assert.strictEqual(range.end, 1);
            assert.strictEqual(range.length, 0);
        });

        it("should throw when end is less than start", function() {
            try {
                new MatchRanges(1, 0);
            }
            catch (e) {
                return;
            }

            assert.fail("Didn't throw exception");
        });
    });
    
    describe("length", function() {
        it("should be valid", function() {
            assert.strictEqual((new MatchRanges(1, 2)).length, 1);
            assert.strictEqual((new MatchRanges(1, 3)).length, 2);
        });
    });

    describe("add", function() {
        it("should works with two non-intersecting ranges", function() {
            let ranges = new MatchRanges(1, 2);
            ranges = ranges.add(3, 4);
            assert.strictEqual(ranges.ranges.length, 2);
            assert.strictEqual(ranges.start, 1);
            assert.strictEqual(ranges.end, 4);
            assert.strictEqual(ranges.last, 3);
            assert.strictEqual(ranges.length, 3);
        });

        it("should merge ranges that are adjacent", function() {
            let ranges = new MatchRanges(1, 2);
            ranges = ranges.add(2, 3);
            assert.strictEqual(ranges.ranges.length, 1);
            assert.strictEqual(ranges.length, 2);
            assert.strictEqual(ranges.start, 1);
            assert.strictEqual(ranges.end, 3);
            assert.strictEqual(ranges.last, 2);
        });

        it("should merge multiples ranges if they become adjacent", function() {
            let ranges = new MatchRanges(1, 2);
            ranges = ranges.add(3, 4);
            assert.strictEqual(ranges.ranges.length, 2);
            ranges = ranges.add(2, 3);
            assert.strictEqual(ranges.ranges.length, 1);
            assert.strictEqual(ranges.length, 3);
            assert.strictEqual(ranges.start, 1);
            assert.strictEqual(ranges.end, 4);
            assert.strictEqual(ranges.last, 3);
        });
    });
});