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

import { AbstractArray, AbstractPattern } from "./AbstractPattern";
import { MatchContext } from "./MatchContext";
import { MatchInfo } from "./MatchInfo";

export class QuantifierQualifier<T> implements AbstractPattern<T> {
    readonly pattern:      AbstractPattern<T>
    readonly min:          number;
    readonly max:          number;
    readonly lazyRange:    boolean;
    readonly lazyQuantity: boolean;

    constructor(pattern: AbstractPattern<T>, min: number, max: number, lazyRange: boolean = false, lazyQuantity: boolean = lazyRange) {
        this.pattern      = pattern;
        this.min          = min;
        this.max          = max;
        this.lazyRange    = lazyRange;
        this.lazyQuantity = lazyQuantity;
    }

    protected isQuantityValid(quantity: number): boolean {
        return (quantity >= this.min) && (quantity <= this.max);
    }

    private *tryMatchImpl(context: MatchContext<T>, array: AbstractArray<T>, start: number, end: number, matchCount: number): IterableIterator<MatchInfo<T>> {
        if (this.lazyQuantity && this.isQuantityValid(matchCount)) {
            yield {
                context: context,
                start:   start,
                end:     start
            };
        }

        matchCount++;

        for (const patternMatch of this.pattern.tryMatch(context, array, start, end)) {
            if (patternMatch.end >= end) {
                // Matched everything...
                if (this.isQuantityValid(matchCount)) {
                    yield patternMatch;
                }

                return;
            }

            if (this.lazyQuantity && this.isQuantityValid(matchCount)) {
                yield {
                    context: patternMatch.context,
                    start:   start,
                    end:     patternMatch.end
                };
            }

            for (const subMatch of this.tryMatchImpl(patternMatch.context, array, patternMatch.end, end, matchCount)) {
                yield {
                    context: subMatch.context,
                    start:   start,
                    end:     subMatch.end
                };
            }

            if (!this.lazyQuantity && this.isQuantityValid(matchCount)) {
                yield {
                    context: patternMatch.context,
                    start:   start,
                    end:     patternMatch.end
                };
            }
        }
    }

    *tryMatch(context: MatchContext<T>, array: AbstractArray<T>, start: number, end: number): IterableIterator<MatchInfo<T>> {
        if (this.max <= 0) {
            yield {
                context: context,
                start:   start,
                end:     start
            };

            return;
        }

        if (this.lazyRange) {
            for (let index = start; index <= end; index++) {
                yield *this.tryMatchImpl(context, array, start, index, 0);
            }
        }
        else {
            for (let index = end; index >= start; index--) {
                yield *this.tryMatchImpl(context, array, start, index, 0);
            }
        }

        if (this.min <= 0) {
            yield {
                context: context,
                start:   start,
                end:     start
            };
        }
    }
};

export class StarQualifier<T> extends QuantifierQualifier<T> {
    constructor(pattern: AbstractPattern<T>, lazy: boolean = false) {
        super(pattern, 0, Number.MAX_SAFE_INTEGER, lazy);
    }
};

export class OptionalQualifier<T> extends QuantifierQualifier<T> {
    constructor(pattern: AbstractPattern<T>, lazy: boolean = false) {
        super(pattern, 0, 1, lazy);
    }
};

export class PlusQualifier<T> extends QuantifierQualifier<T> {
    constructor(pattern: AbstractPattern<T>, lazy: boolean = false) {
        super(pattern, 1, Number.MAX_SAFE_INTEGER, lazy);
    }
};
