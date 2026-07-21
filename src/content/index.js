import MarkdownIt from "markdown-it"

const md = new MarkdownIt({ html: false, linkify: true, typographer: true })

// Russian chapters live directly in ./chapters/*.md
// Other languages live in ./chapters/<locale>/*.md (e.g. ./chapters/th/*.md)
const files = import.meta.glob("./chapters/**/*.md", { query: "?raw", import: "default", eager: true })

function localeFromPath(p) {
  const rest = p.replace(/^\.\/chapters\//, "")
  const parts = rest.split("/")
  return parts.length > 1 ? parts[0] : "ru"
}

function parseFrontmatter(raw) {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw)
  if (!m) return { data: {}, body: raw }
  const data = {}
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "")
    data[key] = val
  }
  return { data, body: m[2] }
}

function buildSections(body, aux) {
  const trimmed = body.trim()
  // Explicit author-defined breaks always win.
  if (/^%%%\s*$/m.test(trimmed)) {
    return trimmed
      .split(/^%%%\s*$/m)
      .map(function (s) { return s.trim() })
      .filter(Boolean)
      .map(function (s) { return md.render(s) })
  }
  // Auxiliary sections (assignment, doors, colophon) stay whole.
  if (aux) return [md.render(trimmed)]

  const blocks = trimmed.split(/\n{2,}/).map(function (b) { return b.trim() }).filter(Boolean)
  if (blocks.length <= 4) return [md.render(trimmed)]

  // Aim for readable subchapters of roughly five blocks each.
  const count = Math.max(2, Math.round(blocks.length / 5))
  const per = Math.ceil(blocks.length / count)
  const groups = []
  for (let i = 0; i < blocks.length; i += per) {
    groups.push(blocks.slice(i, i + per))
  }
  return groups.map(function (g) { return md.render(g.join("\n\n")) })
}

function toChapter(path, raw) {
  const parsed = parseFrontmatter(raw)
  const data = parsed.data
  const slug = data.slug || path.split("/").pop().replace(/\.md$/, "")
  const aux = /^(true|1|yes)$/i.test(data.aux || "")
  const sections = buildSections(parsed.body, aux)
  return {
    slug: slug,
    order: Number(data.order || 0),
    title: data.title || slug,
    subtitle: data.subtitle || "",
    label: data.label || "",
    aux: aux,
    source: data.source || "",
    excerpt: (data.excerpt || "").trim(),
    sections: sections,
    html: sections.join("\n"),
  }
}

const byLocale = {}
for (const entry of Object.entries(files)) {
  const path = entry[0]
  const raw = entry[1]
  const loc = localeFromPath(path)
  if (!byLocale[loc]) byLocale[loc] = []
  byLocale[loc].push(toChapter(path, raw))
}
for (const loc of Object.keys(byLocale)) {
  byLocale[loc].sort(function (a, b) { return a.order - b.order })
}

export function getChapters(locale) {
  return byLocale[locale] || byLocale.ru || []
}

export function getChapter(locale, slug) {
  const list = getChapters(locale)
  return list.find(function (c) { return c.slug === slug })
}
