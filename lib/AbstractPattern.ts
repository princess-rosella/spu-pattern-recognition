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

export interface AbstractArray<T> {
    readonly [index: number]: T;
    readonly length: number;
}

export interface AbstractPattern<T> {
    /**
     * Try to match a part of an array.
     * 
     * Implementations of this method should try to match the maximum amount of entries from the array they can, but
     * they aren't required to match perfectly, unless it's part of their requirement.
     * 
     * @param context Match context
     * @param array   Array to look at
     * @param start   Start index
     * @param end     End index
     */
    tryMatch(context: MatchContext<T>, array: AbstractArray<T>, start: number, end: number): IterableIterator<MatchInfo<T>>;
};
