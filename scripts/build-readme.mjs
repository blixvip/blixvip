// Regenerates the project grid in README.md.
//
// The six repositories shown are the six with the most stars, recomputed on
// every run, so the grid reorders itself as the ranking changes. Copy and
// screenshots for each repository live in projects.json; a repository with no
// screenshot there falls back to a listing of its real top-level folders.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const USER = "blixvip";
const COUNT = 6;
const HERE = dirname(fileURLToPath(import.meta.url));
const README = join(HERE, "..", "README.md");
const START = "<!-- projects:start -->";
const END = "<!-- projects:end -->";

const api = async (path) => {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": `${USER}-profile`,
      ...(process.env.GITHUB_TOKEN
        ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  });
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
};

const stars = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

// Repositories with no screenshot get their real top-level folders instead, so
// the cell still shows something true about the project rather than a graphic.
async function folders(repo) {
  try {
    const entries = await api(`/repos/${USER}/${repo.name}/contents`);
    const names = entries
      .filter((e) => e.type === "dir" && !e.name.startsWith(".") && !/^[0-9]+$/.test(e.name))
      .map((e) => e.name)
      .slice(0, 12);
    if (!names.length) return "";
    return `<pre><code>${names.join("\n")}</code></pre>`;
  } catch {
    return "";
  }
}

function cell(repo, meta, media) {
  const url = `https://github.com/${USER}/${repo.name}`;
  const title = meta.title ?? repo.name;
  const blurb = meta.blurb ?? repo.description ?? "";
  const home = repo.homepage
    ? ` &nbsp;·&nbsp; <a href="${repo.homepage}">${repo.homepage.replace(/^https?:\/\/(www\.)?|\/$/g, "")}</a>`
    : "";
  return [
    `<td width="50%" valign="top">`,
    media.startsWith("<img") ? `<a href="${url}">${media}</a>` : media,
    `<h3><a href="${url}">${title}</a></h3>`,
    `<p>${blurb}</p>`,
    `<p><sub>★ ${stars(repo.stargazers_count)}${home}</sub></p>`,
    `</td>`,
  ].join("\n");
}

const all = await api(`/users/${USER}/repos?per_page=100&type=owner&sort=pushed`);
const meta = JSON.parse(await readFile(join(HERE, "projects.json"), "utf8"));

const top = all
  .filter((r) => !r.fork && !r.private && !r.archived && r.name !== USER)
  .filter((r) => !(meta[r.name] ?? {}).hidden)
  .sort(
    (a, b) =>
      b.stargazers_count - a.stargazers_count ||
      Date.parse(b.pushed_at) - Date.parse(a.pushed_at),
  )
  .slice(0, COUNT);

const cells = [];
for (const repo of top) {
  const m = meta[repo.name] ?? {};
  const media = m.shot
    ? `<img src="${m.shot}" width="100%" alt="${m.title ?? repo.name}">`
    : await folders(repo);
  cells.push(cell(repo, m, media));
}

const rows = [];
for (let i = 0; i < cells.length; i += 2) {
  rows.push(`<tr>\n${cells.slice(i, i + 2).join("\n")}\n</tr>`);
}

const table = `<table>\n${rows.join("\n")}\n</table>`;
const rest = all
  .filter((r) => !r.fork && !r.private && !r.archived && r.name !== USER)
  .filter((r) => !(meta[r.name] ?? {}).hidden)
  .filter((r) => !top.includes(r))
  .sort((a, b) => b.stargazers_count - a.stargazers_count);

const more = rest.length
  ? "\n\n" +
    rest
      .map((r) => {
        const m = meta[r.name] ?? {};
        return `- **[${m.title ?? r.name}](https://github.com/${USER}/${r.name})** — ${m.blurb ?? r.description ?? ""}`;
      })
      .join("\n")
  : "";

const block = `${START}\n\n${table}${more}\n\n${END}`;
const readme = await readFile(README, "utf8");
const from = readme.indexOf(START);
const to = readme.indexOf(END);
if (from === -1 || to === -1 || to < from) {
  throw new Error("README is missing the projects markers");
}
const next = readme.slice(0, from) + block + readme.slice(to + END.length);

if (next === readme) {
  console.log("no change");
} else {
  await writeFile(README, next);
  console.log(`updated: ${top.map((r) => r.name + " (" + r.stargazers_count + ")").join(", ")}`);
}
