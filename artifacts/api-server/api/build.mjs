import { build } from "esbuild";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

globalThis.require = createRequire(import.meta.url);
const dir = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.join(dir, "index.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: path.join(dir, "built.mjs"),
  external: ["nodemailer"],
  banner: {
    js: `import{createRequire as __cr}from"node:module";import __p from"node:path";import __u from"node:url";globalThis.require=__cr(import.meta.url);globalThis.__filename=__u.fileURLToPath(import.meta.url);globalThis.__dirname=__p.dirname(globalThis.__filename);`,
  },
});

console.log("Built api/built.mjs successfully");
