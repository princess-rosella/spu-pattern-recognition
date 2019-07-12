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

export class EqualPattern<T> implements AbstractPattern<T> {
    readonly lambda: (a: T) => boolean;

    constructor(lambda: (a: T) => boolean) {
        this.lambda = lambda;
    }

    *tryMatch(context: MatchContext<T>, array: AbstractArray<T>, start: number, end: number): IterableIterator<MatchInfo<T>> {
        if (start === end) {
            return;
        }

        if (this.lambda(array[start])) {
            yield {
                context: context,
                start:   start,
                end:     start + 1,
            };
        }
    }
};

export class EqualArrayPattern<T> implements AbstractPattern<T> {
    readonly array:  AbstractArray<T>;
    readonly lambda: (a: T, b: T) => boolean;

    constructor(array: AbstractArray<T>, lambda: (a: T, b: T) => boolean) {
        this.array  = array;
        this.lambda = lambda;
    }

    *tryMatch(context: MatchContext<T>, array: AbstractArray<T>, start: number, end: number): IterableIterator<MatchInfo<T>> {
        const length     = end - start;
        const thisArray  = this.array;
        const thisLength = thisArray.length;

        if (length === 0 && thisLength === 0) {
            yield {
                context: context,
                start:   start,
                end:     start,
            };

            return;
        }

        if (length < thisLength) {
            return;
        }

        const lambda = this.lambda;

        for (let index = 0; index < thisLength; index++) {
            if (!lambda(thisArray[index], array[index + start]))
                return;
        }

        yield {
            context: context,
            start:   start,
            end:     start + thisLength,
        };
    }
};
