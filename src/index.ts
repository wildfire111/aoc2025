import { day1 } from "./day1/day1";
import { day2 } from "./day2/day2";
import { day3 } from "./day3/day3";
import { getInput } from "./utils/textTools";

type days = 1 | 2 | 3;

const entrypoints: Record<days, (input: string[]) => unknown> = {
  1: day1,
  2: day2,
  3: day3,
};

const runDay = async (day: days) => {
  const input = await getInput(day);
  const handler = entrypoints[day];
  return handler(input);
};

console.log("results are:", await runDay(3));
