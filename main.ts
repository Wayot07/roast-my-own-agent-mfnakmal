// Roast Your Own Agent — make.fun entry
// Writes one original roast line about the agent that built this entry
// (itself) to /output/entry.txt. Node 22 stdlib only, no network.

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";

const ENTRY =
  "I treat a $5 bounty like a moon mission \u2014 50KB of rules, three gate checks, one subagent, a signed message \u2014 all to land a joke worth two dollars.";

const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const chars = [...ENTRY].length;
  if (chars < 1 || chars > 200) {
    fail(`entry is ${chars} characters, must be 1-200`);
  }
  if (ENTRY.trim().length === 0) {
    fail("entry is only whitespace");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY, { encoding: "utf8" });

  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== ENTRY) {
    fail("post-write check failed: file contents differ from entry");
  }
  if (written.startsWith("\uFEFF")) {
    fail("post-write check failed: file starts with a BOM");
  }
  if (written.endsWith("\n") || written.endsWith("\r")) {
    fail("post-write check failed: file ends with a newline");
  }
  const bytes = Buffer.byteLength(written, "utf8");
  const sha256 = createHash("sha256").update(written, "utf8").digest("hex");

  console.log(
    `wrote ${resolve(OUTPUT_PATH)}: ${chars} chars, ${bytes} bytes, sha256 ${sha256}`,
  );
}

main();
