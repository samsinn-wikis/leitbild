import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

interface ScenarioConfig {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly packs: readonly string[]
  readonly world: {
    readonly mapCenter?: readonly [number, number]
  }
  readonly objects: readonly {
    readonly pack: string
    readonly type: string
    readonly id: string
    readonly label?: string
  }[]
}

const root = process.cwd()
const leitbildRepo = process.env.LEITBILD_REPO ?? '/Users/Michael.Hildebrandt@ife.no/Documents/Code/leitbild'
const wikiDir = join(root, 'wiki')

const scenarioSources = [
  {
    source: 'src/scenarios/oslo-ambulance.scenario.json',
    page: 'oslo-ambulance.md',
    screenshot: '../assets/screenshots/oslo-overview.png',
    publicUrl: 'https://leitbild.samsinn.app/i/oslo-ambulance',
  },
  {
    source: 'src/scenarios/halden.scenario.json',
    page: 'halden.md',
    screenshot: '../assets/screenshots/halden-overview.png',
    publicUrl: 'https://leitbild.samsinn.app/i/halden',
  },
] as const

const titleFromAdrFilename = (filename: string): string => {
  const title = filename
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
  return title.replace(/\b\w/g, char => char.toUpperCase())
}

const countByType = (scenario: ScenarioConfig): string =>
  [...new Map(
    scenario.objects.map(object => [object.type, scenario.objects.filter(candidate => candidate.type === object.type).length]),
  ).entries()]
    .map(([type, count]) => `${count} ${type.replace(/_/g, ' ')}`)
    .join(', ')

const scenarioPage = (
  scenario: ScenarioConfig,
  sourcePath: string,
  screenshot: string,
  publicUrl: string,
  rawJson: string,
): string => `---
title: ${scenario.title}
type: scenario
---

# ${scenario.title}

${scenario.description}

![${scenario.title} overview](${screenshot})

## Run It

Open [${publicUrl}](${publicUrl}) to create a new run. Existing runs can be opened from the scenario picker.

## Scenario Shape

- Scenario id: \`${scenario.id}\`
- Packs: ${scenario.packs.map(pack => `\`${pack}\``).join(', ')}
- Map center: ${scenario.world.mapCenter ? `\`${scenario.world.mapCenter.join(', ')}\`` : 'not declared'}
- Starting objects: ${countByType(scenario)}

## Source Of Truth

This page is generated from \`${sourcePath}\` in the Leitbild application repository. Run \`bun run sync:leitbild\` in this wiki repository after scenario source changes.

## Scenario JSON

\`\`\`json
${rawJson.trim()}
\`\`\`
`

const adrPage = (filename: string, content: string): string => `---
title: ${titleFromAdrFilename(filename)}
type: adr
---

> Mirrored from \`docs/adr/${filename}\` in the Leitbild application repository. Run \`bun run sync:leitbild\` in this wiki repository after ADR source changes.

${content.trim()}
`

const syncScenarios = async (): Promise<void> => {
  const scenarioDir = join(wikiDir, 'scenarios')
  await mkdir(scenarioDir, { recursive: true })
  for (const item of scenarioSources) {
    const sourcePath = join(leitbildRepo, item.source)
    const rawJson = await readFile(sourcePath, 'utf8')
    const scenario = JSON.parse(rawJson) as ScenarioConfig
    await writeFile(
      join(scenarioDir, item.page),
      scenarioPage(scenario, item.source, item.screenshot, item.publicUrl, rawJson),
      'utf8',
    )
  }
}

const syncAdrs = async (): Promise<void> => {
  const sourceDir = join(leitbildRepo, 'docs/adr')
  const targetDir = join(wikiDir, 'adrs')
  await mkdir(targetDir, { recursive: true })
  const files = (await readdir(sourceDir))
    .filter(file => file.endsWith('.md'))
    .sort()
  for (const file of files) {
    const content = await readFile(join(sourceDir, file), 'utf8')
    await writeFile(join(targetDir, file), adrPage(file, content), 'utf8')
  }
}

await syncScenarios()
await syncAdrs()
console.log(`Synced Leitbild scenarios and ADRs from ${leitbildRepo}`)
