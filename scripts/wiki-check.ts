import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, extname, join, relative } from 'node:path'

interface Issue { readonly severity: 'error' | 'warning'; readonly category: string; readonly message: string }

const root = process.cwd()
const wikiDir = join(root, 'wiki')
const rawDir = join(root, 'raw')

const collect = async (dir: string, extension: string): Promise<string[]> => {
  const out: string[] = []
  let entries: Awaited<ReturnType<typeof readdir>>
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await collect(path, extension))
    else if (entry.isFile() && extname(entry.name) === extension) out.push(path)
  }
  return out
}

const exists = async (path: string): Promise<boolean> => {
  try { await stat(path); return true } catch { return false }
}

const frontmatter = (content: string): Record<string, string | string[]> => {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const result: Record<string, string | string[]> = {}
  let key = ''
  let list: string[] | null = null
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/)
    if (kv) {
      if (list && key) result[key] = list
      list = null
      key = kv[1]
      if (kv[2] === '') list = []
      else result[key] = kv[2].replace(/^['"]|['"]$/g, '')
    } else if (list && /^\s+-\s+/.test(line)) {
      list.push(line.replace(/^\s+-\s+/, '').replace(/^['"]|['"]$/g, ''))
    }
  }
  if (list && key) result[key] = list
  return result
}

const wikilinks = (content: string): string[] =>
  [...content.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)].map(match => match[1])

const pageAliases = (files: readonly string[]): Set<string> => {
  const aliases = new Set<string>()
  for (const file of files) {
    const rel = relative(wikiDir, file).replace(/\.md$/, '')
    aliases.add(rel)
    aliases.add(basename(file, '.md'))
  }
  return aliases
}

const main = async (): Promise<void> => {
  const files = await collect(wikiDir, '.md')
  const rawFiles = await collect(rawDir, '')
  const rawSet = new Set(rawFiles.map(file => relative(root, file)))
  const pageNames = pageAliases(files)
  const infra = new Set(['index'])
  const linked = new Set<string>()
  const issues: Issue[] = []

  for (const file of files) {
    const rel = relative(wikiDir, file)
    const name = basename(file, '.md')
    const content = await readFile(file, 'utf8')
    const fm = frontmatter(content)
    if (!fm.title) issues.push({ severity: 'error', category: 'MISSING_TITLE', message: `${rel}: missing title frontmatter` })
    if (!fm.type) issues.push({ severity: 'error', category: 'MISSING_TYPE', message: `${rel}: missing type frontmatter` })
    for (const link of wikilinks(content)) {
      linked.add(link)
      if (!pageNames.has(link)) issues.push({ severity: 'error', category: 'DEAD_LINK', message: `${rel}: [[${link}]] does not exist` })
    }
    const sources = fm.sources
    if (Array.isArray(sources)) {
      for (const source of sources) {
        if (!rawSet.has(source) && !await exists(join(root, source))) {
          issues.push({ severity: 'error', category: 'BAD_SOURCE', message: `${rel}: source ${source} not found` })
        }
      }
    }
    if (fm.type !== 'adr' && !infra.has(name) && content.replace(/^---\n[\s\S]*?\n---/, '').trim().split(/\s+/).length < 120) {
      issues.push({ severity: 'warning', category: 'SPARSE', message: `${rel}: short page; check if intentional` })
    }
  }

  for (const file of files) {
    const name = basename(file, '.md')
    const rel = relative(wikiDir, file)
    if (!infra.has(name) && !linked.has(name) && dirname(rel) === '.') {
      issues.push({ severity: 'warning', category: 'ORPHAN', message: `${rel}: not linked from another wiki page` })
    }
  }

  const errors = issues.filter(issue => issue.severity === 'error')
  console.log(`wiki-check: scanned ${files.length} pages`)
  for (const issue of issues) console.log(`${issue.severity.toUpperCase()} ${issue.category}: ${issue.message}`)
  if (errors.length > 0) process.exit(1)
}

await main()
