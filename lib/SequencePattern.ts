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

import { MatchContext } from "./MatchContext";
import { MatchInfo } from "./MatchInfo";
import { AbstractArray, AbstractPattern } from "./AbstractPattern";

export class SequencePattern<T> implements AbstractPattern<T> {
    readonly patterns: AbstractPattern<T>[];

    constructor(patterns: AbstractPattern<T>[]) {
        this.patterns = patterns;
    }

    private *tryMatchImpl(context: MatchContext<T>, array: AbstractArray<T>, start: number, end: number, index: number): IterableIterator<MatchInfo<T>> {
        for (const subMatch of this.patterns[index].tryMatch(context, array, start, end)) {
            if ((index + 1) === this.patterns.length) {
                yield subMatch;
                break;
            }

            for (const nextPatternMatch of this.tryMatchImpl(subMatch.context, array, subMatch.end, end, index + 1)) {
                yield {
                    context: nextPatternMatch.context,
                    start:   start,
                    end:     nextPatternMatch.end
                };
            }
        }
    }

    *tryMatch(context: MatchContext<T>, array: AbstractArray<T>, start: number, end: number): IterableIterator<MatchInfo<T>> {
        if (this.patterns.length === 0) {
            yield {
                context: context,
                start:   start,
                end:     start,
            };

            return;
        }

        yield *this.tryMatchImpl(context, array, start, end, 0);
    }
}
