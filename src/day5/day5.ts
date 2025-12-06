export const day5 = (input: string[]) => {
    const part1Result: number = part1(input);
    const part2Result: number = part2(input);
    return { part1: part1Result, part2: part2Result};
};

export const parseInput = (input: string[]): {ranges: [number, number][], numbers: number[]} => {
    const rangeStrings: string[] = []
    const numbers: number[] = [];
    let flop = false;
    for (const line of input) {
        if (line === "") {
            flop = true;
            continue;
        }
        if (!flop) {
            rangeStrings.push(line);
        } else {
            numbers.push(parseInt(line));
        }
    }
    const ranges = rangeStrings.map(r => r.split("-").map(rtuple => parseInt(rtuple)) as [number, number]);
    return { ranges, numbers };
};

export const checkNumInRanges = (num: number, ranges: [number, number][]): boolean => {
    for (const [start, end] of ranges) {
        if (num >= start && num <= end) {
            return true;
        }
    }
    return false;
};



export const condenseRanges = (ranges: [number, number][]): [number, number][] => {
    console.log(`-----Condensing ranges: ${JSON.stringify(ranges)}`);
    let sortedRanges = ranges.sort((a, b) => a[0] - b[0]);
    if (sortedRanges.length === 0) {
        throw new Error("No ranges to process");
    }
    const finishedRanges: [number, number][] = [];
    while(sortedRanges.length > 0) {
        console.log(`Ranges still to process: ${JSON.stringify(sortedRanges)}`);
        const firstRange = sortedRanges[0];
        sortedRanges.shift();
        if (firstRange === undefined) {
            throw new Error("Undefined range encountered");
        }
        if (sortedRanges.length !== 0) {
            let aggregate = {start: firstRange[0], end: firstRange[1]};
            for (let i = 0; i < sortedRanges.length; i++) {
                const currentRange = sortedRanges[i];
                console.log(`-Check ${currentRange} against agg ${aggregate.start},${aggregate.end}`);
                if (currentRange === undefined) throw new Error("Undefined range encountered");
                if (currentRange[0] <= aggregate.end) { //start of current range is equal to or before end of agg.
                    
                    aggregate.end = Math.max(aggregate.end, currentRange[1]); //add curr to agg.
                    console.log(`Overlap found. New aggregate: ${aggregate.start},${aggregate.end}`);
                } else {
                    
                    finishedRanges.push([aggregate.start, aggregate.end]);
                    sortedRanges = sortedRanges.slice(i);
                    console.log(`No overlap. Pushing aggregate ${aggregate.start},${aggregate.end}. ${sortedRanges.length} ranges rem.`);
                    break;
                }
                if (i === sortedRanges.length - 1) {
                    sortedRanges = [];
                    finishedRanges.push([aggregate.start, aggregate.end]);
                    console.log(`All remaining ranges condensed. Pushing final aggregate ${aggregate.start},${aggregate.end}.`);
                }
            }
        } else {
            console.log(`Only one range left: ${firstRange}. Pushing to finished.`);
            finishedRanges.push(firstRange);
        }
    }
    return finishedRanges;
    
}
    






export const part1 = (input: string[]): number => {
    const parsedInput = parseInput(input);
    let count = 0;
    for (const num of parsedInput.numbers) {
        if (checkNumInRanges(num, parsedInput.ranges)) {
            count++;
        }
    }
    return count;
};

export const part2 = (input: string[]): number => {
    const parsedInput = parseInput(input);
    const condensedRanges = condenseRanges(parsedInput.ranges);
    let count = 0;
    for (const range of condensedRanges) {
        count += (range[1] - range[0] + 1);
    }
    return count;
};