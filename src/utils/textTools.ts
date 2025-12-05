import { readFile } from "fs/promises";

export const getInput = async (day: number) => {
  const relativePath = `input/day${day}.txt`;
  const file = await loadFile(`./res/${relativePath}`);
  let input = file.split("\n");
  if (input.length === 1) {
    input = file.split(",");
  }
  return input;
};

const loadFile = async (path: string) => {
  const content = await readFile(path, "utf8");
  return content;
};
