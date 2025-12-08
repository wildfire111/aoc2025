import { day1 } from "./day1/day1";
import { day2 } from "./day2/day2";
import { day3 } from "./day3/day3";
import { day4 } from "./day4/day4";
import { day5 } from "./day5/day5";
import { day6 } from "./day6/day6";
import { day7 } from "./day7/day7";
import { getInput } from "./utils/textTools";

type days = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const entrypoints: Record<days, (input: string[]) => unknown> = {
  1: day1,
  2: day2,
  3: day3,
  4: day4,
  5: day5,
  6: day6,
  7: day7,
};

const runDay = async (day: days) => {
  const input = await getInput(day);
  const handler = entrypoints[day];
  return handler(input);
};

console.log("results are:", await runDay(7));
