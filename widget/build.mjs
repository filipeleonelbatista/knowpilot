import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "widget");
fs.mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(process.cwd(), "widget", "src", "widget.ts")],
  outfile: path.join(outDir, "v1.js"),
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2020"],
});

console.log("Widget built → public/widget/v1.js");
