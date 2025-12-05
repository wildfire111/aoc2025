import { parse } from "path";

export const day2 = (input: string[]) => {
  const parsedInput: [number, number][] = input.map(parseInput);
  const part1Result: number = part1(parsedInput);
  const part2Result: number = part2(parsedInput);
  return { part1: part1Result, part2: part2Result };
};

export const parseInput = (line: string): [number, number] => {
  const [a, b] = line.trim().split("-") as [string, string];
  return [parseInt(a, 10), parseInt(b, 10)];
};

export const halveString = (str: string): [string, string] => {
  const mid = Math.floor(str.length / 2);
  const firstHalf = str.slice(0, mid);
  const secondHalf = str.slice(mid);
  return [firstHalf, secondHalf];
};

export const getInvalidIDsP1 = (input: [number, number]): number[] => {
  let current = input[0];
  const invalidIDs: number[] = [];
  const stop = input[1];
  while (current <= stop) {
    if (current.toString().length % 2 === 0) {
      const [front, back] = halveString(current.toString());
      if (front === back) {
        invalidIDs.push(current);
      }
    }
    current += 1;
  }
  return invalidIDs;
};

export const part1 = (input: [number, number][]) => {
  let sumInvalid = 0;
  for (const range of input) {
    const invalidIDs = getInvalidIDsP1(range);
    if (invalidIDs.length > 0) {
      for (const id of invalidIDs) {
        sumInvalid += id;
      }
    }
  }
  return sumInvalid;
};

export const arrayAllSame = (arr: string[]): boolean => {
  return arr.every((v) => v === arr[0]);
};

export const chunkString = (str: string, size: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
};

export const getInvalidIDsP2 = (input: [number, number]): number[] => {
  let current = input[0];
  const invalidIDs: number[] = [];
  const stop = input[1];
  while (current <= stop) {
    for (let i = 1; i <= Math.floor(current.toString().length / 2); i++) {
      if (current.toString().length % i === 0) {
        const segments: string[] = chunkString(current.toString(), i);
        if (arrayAllSame(segments)) {
          invalidIDs.push(current);
          break;
        }
      }
    }
    current += 1;
  }
  return invalidIDs;
};

export const part2 = (input: [number, number][]) => {
    let sumInvalid = 0;
    for (const range of input) {
        const invalidIDs = getInvalidIDsP2(range);
        if (invalidIDs.length > 0) {
            for (const id of invalidIDs) {
                sumInvalid += id;
            }
        }
    }
    return sumInvalid;
};
