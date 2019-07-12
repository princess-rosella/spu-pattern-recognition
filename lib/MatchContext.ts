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

import { MatchInfo } from "./MatchInfo";

export interface MatchRange {
    start: number,
    end:   number
};

const min = Math.min;
const max = Math.max;

export class MatchRanges {
    ranges: MatchRange[];

    constructor(start: number, end: number) {
        if (end < start)
            throw new Error(`Invalid range: (${start}, ${end})`);

        this.ranges = [{ start, end }];
    }

    public contains(index: number): boolean {
        for (const range of this.ranges) {
            if (index >= range.start && index <= range.end) {
                return true;
            }
        }

        return false;
    }

    private intersecting(start: number, end: number): MatchRange[] {
        const ranges: MatchRange[] = [];

        for (const range of this.ranges) {
            if (min(end, range.end) < max(start, range.start))
                continue;

            ranges.push(range);
        }

        return ranges;
    }

    public add(start: number, end: number): MatchRanges {
        if (start === end)
            return this;

        if (end < start)
            throw new Error(`Invalid range: (${start}, ${end})`);

        const intersections = this.intersecting(start, end);

        for (const intersection of intersections) {
            start = min(start, intersection.start);
            end   = max(end,   intersection.end);
        }

        const newRanges = new MatchRanges(start, end);
        for (const range of this.ranges) {
            if (intersections.includes(range))
                continue;

            newRanges.ranges.push(range);
        }

        return newRanges;
    }

    get start(): number {
        let m = this.ranges[0].start;

        for (const range of this.ranges) {
            m = min(m, range.start);
        }

        return m;
    }

    get end(): number {
        let m = this.ranges[0].end;

        for (const range of this.ranges) {
            m = max(m, range.end);
        }

        return m;
    }

    get last(): number {
        return this.end - 1;
    }

    get length(): number {
        return this.end - this.start;
    }

    toJSON(): any {
        return this.ranges;
    }

    toString(): string {
        return `[MatchRanges; start=${this.start}; end=${this.end}]`;
    }
}

export class MatchContext<T> {
    readonly captures: { [name: string]: MatchRanges };

    constructor(captures: { [name: string]: MatchRanges } = {}) {
        this.captures = Object.assign({}, captures);
    }

    clone(): MatchContext<T> {
        return new MatchContext(this.captures);
    }

    capture(name: string, info: MatchInfo<T>): MatchContext<T> {
        const clone = this.clone();
        const existingCapture = clone.captures[name];

        if (existingCapture) {
            clone.captures[name] = clone.captures[name].add(info.start, info.end);
        }
        else {
            clone.captures[name] = new MatchRanges(info.start, info.end);
        }

        return clone;
    }
};
