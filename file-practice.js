import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const directory = path.dirname(filename);
const filePath = path.join(directory, "message.txt");

async function main() {
  await writeFile(filePath, "I'm learning Node.js!");

  const message = await readFile(filePath, "utf8");

  console.log(message);
}

main().catch(console.error);