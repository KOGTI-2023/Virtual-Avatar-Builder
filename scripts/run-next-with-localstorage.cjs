#!/usr/bin/env node

const { spawn } = require("node:child_process");
const { resolve, dirname } = require("node:path");
const { mkdirSync } = require("node:fs");

const storageFile = resolve(process.cwd(), ".next/localstorage.json");
mkdirSync(dirname(storageFile), { recursive: true });

const nodeOptions = (process.env.NODE_OPTIONS || "")
  .split(/\s+/)
  .filter(Boolean);

const filteredOptions = [];
for (let index = 0; index < nodeOptions.length; index += 1) {
  const option = nodeOptions[index];

  if (option === "--localstorage-file") {
    index += 1;
    continue;
  }

  if (option.startsWith("--localstorage-file")) {
    continue;
  }

  filteredOptions.push(option);
}

filteredOptions.push(`--localstorage-file=${storageFile}`);
process.env.NODE_OPTIONS = filteredOptions.join(" ");

const nextBinary = require.resolve("next/dist/bin/next");
const args = process.argv.slice(2);

const child = spawn(process.execPath, [nextBinary, ...args], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
