// Runs after `vite build` + `vite build --ssr`. Writes static HTML for the public pages into dist/
// so crawlers get real content; every other route falls back to the untouched SPA shell (spa.html).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, 'dist')
const serverDir = path.join(rootDir, 'dist-ssr')

const ROOT_PLACEHOLDER = '<div id="root"></div>'

const { render, PRERENDER_PAGES, SITE_URL } = await import(
  pathToFileURL(path.join(serverDir, 'entry-server.js')).href
)

const template = await readFile(path.join(distDir, 'index.html'), 'utf8')
if (!template.includes(ROOT_PLACEHOLDER)) {
  throw new Error(`dist/index.html is missing ${ROOT_PLACEHOLDER}`)
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function replaceOrThrow(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Prerender: could not find ${label} in index.html`)
  return html.replace(pattern, replacement)
}

function setMetaContent(html, attribute, key, value) {
  const pattern = new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*(")`)
  return replaceOrThrow(html, pattern, `$1${escapeHtml(value)}$2`, `<meta ${attribute}="${key}">`)
}

// React emits resource hints (e.g. image preloads) at the start of the rendered markup; they belong in <head>.
function splitLeadingResourceHints(appHtml) {
  const match = appHtml.match(/^(?:<link\b[^>]*\/?>)+/)
  if (match === null) return { hints: [], body: appHtml }
  return { hints: match[0].match(/<link\b[^>]*\/?>/g), body: appHtml.slice(match[0].length) }
}

function applyHead(html, page, extraHeadTags) {
  const url = new URL(page.path, SITE_URL).href
  let result = replaceOrThrow(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`, '<title>')
  result = setMetaContent(result, 'name', 'description', page.description)
  result = setMetaContent(result, 'property', 'og:title', page.title)
  result = setMetaContent(result, 'property', 'og:description', page.description)
  result = setMetaContent(result, 'property', 'og:url', url)
  result = setMetaContent(result, 'name', 'twitter:title', page.title)
  result = setMetaContent(result, 'name', 'twitter:description', page.description)
  const headTags = [`<link rel="canonical" href="${escapeHtml(url)}" />`, ...extraHeadTags]
  return replaceOrThrow(result, /\n(\s*)<\/head>/, (_, indent) => {
    return `\n${headTags.map((tag) => `${indent}  ${tag}\n`).join('')}${indent}</head>`
  }, '</head>')
}

await writeFile(path.join(distDir, 'spa.html'), template)

for (const page of PRERENDER_PAGES) {
  const appHtml = await render(page.path)
  const { hints, body } = splitLeadingResourceHints(appHtml)
  const html = applyHead(template, page, hints).replace(
    ROOT_PLACEHOLDER,
    () => `<div id="root" data-prerendered="${escapeHtml(page.path)}">${body}</div>`,
  )

  // `/foo` -> dist/foo.html, served at /foo by Vercel `cleanUrls` and by `vite preview`.
  const fileName = page.path === '/' ? 'index.html' : `${page.path.replace(/^\/+|\/+$/g, '')}.html`
  const outFile = path.join(distDir, fileName)
  await mkdir(path.dirname(outFile), { recursive: true })
  await writeFile(outFile, html)
  console.log(`Prerendered ${page.path} (${Math.round(appHtml.length / 1024)} kB)`)
}

await rm(serverDir, { recursive: true, force: true })
