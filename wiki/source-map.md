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

The copies in [[scenarios]] are mirrored for humans and AI agents. If the code repo changes, the wiki copies should be updated by automation or explicit sync.

## Pack Source Files

The ambulance pack lives under `src/packs/ambulance`. It owns ambulance, hospital, incident domain data, commands, presentation, scenario expansion, simulation mechanics, and arrival interactions. The traffic pack lives under `src/packs/traffic` and owns traffic condition data and scenario expansion.

## UI Source Files

The Svelte control surface lives under `src/ui`. Map rendering uses MapLibre. Operational truth is rendered through MapLibre sources/layers, while richer UI such as rail rows, status indicators, scenario guidance, and modals live in Svelte components.

## API Source Files

Control-instance API routing lives under `src/core/api`. Client-side API helpers live under `src/ui/control-instance-client.ts` and route helpers live under `src/ui/control-instance-route.ts`.

## Generated From

This wiki was first generated from the Leitbild project documentation, current scenario JSON, and architectural decisions in the application repo. It also follows patterns from `samsinn-wikis/pwr-ops` and the `michaelhil/llm-wiki-skills` project.

## Screenshot Sources

Screenshot slots are reserved in `wiki/assets/screenshots`. The first dispatch could not capture screenshots because the available Playwright browser backend was closed in the current Codex session. Screenshots can be supplied manually or captured in a later session.

Related pages: [[index]], [[concepts]], [[specs]], [[scenarios]].
