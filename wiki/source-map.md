---
title: Source Map
type: summary
---

# Source Map

## Leitbild Repo Files

Canonical implementation lives in [`michaelhil/leitbild`](https://github.com/michaelhil/leitbild). The main server is `src/core/api/server.ts`. Core models live in `src/core/model`. Pack interfaces live in `src/core/packs`. Built-in packs live in `src/packs`.

## Scenario Source Files

The executable scenario configs currently live in the Leitbild repo:

- `src/scenarios/oslo-ambulance.scenario.json`
- `src/scenarios/halden.scenario.json`

The copies in [[scenarios]], [[scenarios/oslo-ambulance]], and [[scenarios/halden]] are mirrored for humans and AI agents. Run `bun run sync:leitbild` in the wiki repo after scenario JSON changes.

## ADR Source Files

Architecture decision records live in `docs/adr` in the Leitbild repo and are mirrored as separate pages under the wiki `adrs/` directory. Run `bun run sync:leitbild` in the wiki repo after ADR changes.

## Pack Source Files

The ambulance pack lives under `src/packs/ambulance`. It owns ambulance, hospital, incident domain data, commands, presentation, scenario expansion, simulation mechanics, and arrival interactions. The traffic pack lives under `src/packs/traffic` and owns traffic condition data and scenario expansion.

## UI Source Files

The Svelte control surface lives under `src/ui`. Map rendering uses MapLibre. Operational truth is rendered through MapLibre sources/layers, while richer UI such as rail rows, status indicators, scenario guidance, and modals live in Svelte components.

## API Source Files

Control-instance API routing lives under `src/core/api`. Client-side API helpers live under `src/ui/control-instance-client.ts` and route helpers live under `src/ui/control-instance-route.ts`.

## Generated From

This wiki was first generated from the Leitbild project documentation, current scenario JSON, and architectural decisions in the application repo. It also follows patterns from `samsinn-wikis/pwr-ops` and the `michaelhil/llm-wiki-skills` project.

## Future Project Sources

The NPP process control pack concept in [[future-projects]] is a forward-looking design note. It is informed by the Leitbild pack/surface/event architecture and by the public [PWR Operations wiki](https://samsinn-wikis.github.io/pwr-ops/), especially its organization of Westinghouse-style PWR operating knowledge, procedure markdown, procedure families, and Samsinn integration notes. It is not an executable plant model or a licensing-grade engineering analysis.

## Screenshot Sources

Screenshots live in `wiki/assets/screenshots` and are captured from the production Leitbild app. They illustrate scenario overviews, dispatch routing, settings, startup status, category visibility, and update indicators.

Related pages: [[index]], [[concepts]], [[specs]], [[scenarios]], [[future-projects]].
