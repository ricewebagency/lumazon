import { rmSync, mkdirSync, cpSync, existsSync, readdirSync, copyFileSync } from "node:fs";
import { execSync } from "node:child_process";

const SRC = "src";
const DOCS = "docs";

function clean() {
  if (existsSync(DOCS)) rmSync(DOCS, { recursive: true, force: true });
  mkdirSync(`${DOCS}/css`, { recursive: true });
  mkdirSync(`${DOCS}/js`, { recursive: true });
  mkdirSync(`${DOCS}/assets`, { recursive: true });
}

function copyStatic() {
  // kopieer alle .html bestanden in src root
  for (const file of readdirSync(SRC)) {
    if (file.endsWith(".html")) {
      cpSync(`${SRC}/${file}`, `${DOCS}/${file}`, { force: true });
    }
  }

  cpSync(`${SRC}/js`, `${DOCS}/js`, { recursive: true, force: true });
  cpSync(`${SRC}/assets`, `${DOCS}/assets`, { recursive: true, force: true });

  // kopieer root-bestanden die direct in docs moeten staan
  for (const file of ["sitemap.xml", "robots.txt", "site.webmanifest"]) {
    if (existsSync(`${SRC}/${file}`)) {
      copyFileSync(`${SRC}/${file}`, `${DOCS}/${file}`);
    }
  }
}

function buildCss() {
  execSync(
    "npx tailwindcss -i ./src/css/main.css -o ./docs/css/main.css --postcss --minify",
    { stdio: "inherit" }
  );
}

clean();
copyStatic();
buildCss();
