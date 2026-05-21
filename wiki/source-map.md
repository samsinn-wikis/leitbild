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

The ambulance pack lives under `src/packs/ambulance`. It owns ambulance, hospital, incident domain data, commands, presentation, scenario expansion, simulation mechanics, and arrival interactions. The traffic pack lives under `src/packs/traffic` and owns traffic condition data and scenario expansion. The weather pack lives under `src/packs/weather` and owns weather influence objects, sparse H3 field computation, weather queries, and weather map feature projection. The process-plant pack lives under `src/packs/process-plant` and owns process-system graph schemas, component definitions, compilation, headless runtime behavior, process-link behavior, and runtime tests.

## UI Source Files

The Svelte control surface lives under `src/ui`. Map rendering uses MapLibre. Operational truth is rendered through MapLibre sources/layers, while richer UI such as rail rows, status indicators, scenario guidance, and modals live in Svelte components.

## API Source Files

Control-instance API routing lives under `src/core/api`. Client-side API helpers live under `src/ui/control-instance-client.ts` and route helpers live under `src/ui/control-instance-route.ts`.

The generic pack query API is routed in `src/core/api/control-instance-routes.ts`, exposed to the runtime through `src/core/control-instances/runtime.ts`, and routed to active providers through `src/simulation/hub.ts`. The shared query envelope is defined in `src/core/packs/protocol.ts`. Current built-in query handlers live in `src/packs/weather/query.ts`, `src/packs/ambulance/query.ts`, and `src/packs/traffic/query.ts`.

## Generated From

This wiki was first generated from the Leitbild project documentation, current scenario JSON, and architectural decisions in the application repo. It also follows patterns from `samsinn-wikis/pwr-ops` and the `michaelhil/llm-wiki-skills` project.

## Future Project Sources

The advanced simulation report in [[simulation-technologies]] is a forward-looking technical survey and roadmap. It combines Leitbild's current pack/provider architecture with public references such as SUMO, MATSim, PX4, Gazebo, WRF, FARSITE, RELAP5, MOOSE, FMI, BlueSky, SimPy, and related open-source or public simulation systems.

The NPP process control pack concept in [[future-projects]] is a forward-looking design note. It is informed by the Leitbild pack/surface/event architecture, [[simulation-technologies]], and by the public [PWR Operations wiki](https://samsinn-wikis.github.io/pwr-ops/), especially its organization of Westinghouse-style PWR operating knowledge, procedure markdown, procedure families, and Samsinn integration notes. It is not an executable plant model or a licensing-grade engineering analysis.

## Screenshot Sources

Screenshots live in `wiki/assets/screenshots` and are captured from the production Leitbild app. They illustrate scenario overviews, dispatch routing, settings, startup status, category visibility, and update indicators.

Related pages: [[index]], [[concepts]], [[specs]], [[scenarios]], [[simulation-technologies]], [[future-projects]].
