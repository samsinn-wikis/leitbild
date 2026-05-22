---
title: Process Plant Pack
type: domain
---

# Process Plant Pack

The Leitbild `process-plant` pack is the foundation for running detailed process-control simulations inside the same multi-pack world as maps, vehicles, weather, traffic, incidents, and AI agents. It is meant for systems whose important state is an evolving network of process variables: flows, pressures, temperatures, powers, inventories, valve positions, pump states, trips, alarms, and operator commands. A nuclear plant is the current feasibility example because it stresses the architecture, but the pack is deliberately generic enough to support future hospital utilities, chemical plants, water-treatment facilities, ship machinery plants, district heating networks, or other interconnected process systems.

The key architectural boundary is simple: continuous physics stays inside the process-plant runtime. Leitbild events record discrete accepted history such as commands, alarms, trips, fault injections, and threshold crossings. A pump does not emit “water moved” messages to a steam generator; the fixed-step runtime computes flow, heat transfer, inventory changes, and process state from a compiled component graph.

```mermaid
flowchart LR
  Scenario["Scenario definition"] --> System["processSystems[]"]
  System --> Graph["PlantGraphSpec or graphRef"]
  Graph --> Compiler["Graph compiler"]
  Compiler --> Runtime["Fixed-step runtime"]
  Runtime --> Table["Authoritative variable table"]
  Table --> Queries["Pack query surface"]
  Table --> Telemetry["Trends and acceptance traces"]
  Table --> FutureUi["Future process surface"]
  Runtime --> Events["Discrete alarms / trips / command results"]
  Events --> Leitbild["Leitbild control instance"]
```

## Current Status

The pack now has a real graph compiler, scenario-owned system assembly, a fixed-step headless runtime, provider lifecycle integration, provider-private snapshot/restore, a generic pack query surface, writable-variable commands, timed pack-owned schedules, telemetry buffers, multi-system testbeds, benchmark scripts, and acceptance traces. It is not yet a finished control-room product. The current work is about making the runtime and model strong enough to bear more detailed process displays, alarms, procedures, and AI-agent interaction later.

The built-in demonstration graph is `process-plant.pressurized-water-reactor.v1`. It is a medium-fidelity research model, not licensing-grade analysis software. It currently models a four-loop PWR-like plant skeleton with core, vessel, pressurizer, four steam generators, four reactor coolant pumps, main and auxiliary feedwater paths, main steam paths, turbine, generator, condenser, condensate pumps, charging, letdown, volume-control tank, process links, link sensors, link valves, and link leak modifiers.

## Scenario-Owned Plant Assembly

Plant systems are assembled from scenario data. A scenario may instantiate one or many process systems, each with a `graphRef` or inline graph, parameter overlays, initial state, schedules, and telemetry configuration.

```json
{
  "processSystems": [
    {
      "id": "unit-1",
      "pack": "process-plant",
      "componentLibrary": "process-plant",
      "graphRef": "process-plant.pressurized-water-reactor.v1",
      "parameters": {
        "core": {
          "ratedPowerMw": 2890
        }
      },
      "initialState": {
        "core.rodInsertionFraction": 0.18,
        "sgA.secondaryInventoryKg": 60000
      }
    }
  ],
  "providerConfigs": {
    "process-plant": {
      "systems": {
        "unit-1": {
          "schedule": {
            "actions": [
              {
                "id": "trip-rcp-a",
                "atMs": 60000,
                "type": "tripComponent",
                "componentId": "rcpA"
              }
            ]
          },
          "telemetry": {
            "sampleIntervalMs": 5000,
            "variables": ["core.powerMw", "sgA.levelPercent", "turbine.electricMw"]
          }
        }
      }
    }
  }
}
```

This design keeps topology configurable without letting scenarios execute arbitrary code. Scenarios instantiate components and links; component physics remains code-backed, typed, reviewed, and tested. A future AI agent can author a graph or choose a known `graphRef`, but the compiler still rejects invalid topology, parameters, units, link contracts, initial state, schedules, and commands before runtime.

## Component Graph

The canonical model is `PlantGraphSpec`. It contains `schemaVersion`, `id`, `title`, `timestep`, `components`, `connections`, and `publishedVariables`. Components declare an id, kind, label, parameters, ports, and process variables. Connections link typed ports and may carry physical metadata plus link-local variables.

The compiler validates and indexes the graph before runtime. It rejects duplicate ids, unknown component kinds, invalid parameters, impossible port connections, missing published variables, bad initial values, invalid link actuators, duplicate variable paths, incompatible fluid link solver models, and broken primary-loop topology. Runtime code receives compiled component/link tables and adjacency indexes, not raw strings to reparse on every tick.

```mermaid
flowchart TD
  Raw["PlantGraphSpec JSON"] --> Schema["Schema validation"]
  Schema --> Components["Resolve component definitions"]
  Components --> Ports["Parse port refs"]
  Ports --> Links["Validate typed links"]
  Links --> Variables["Compile component + link variables"]
  Variables --> Contracts["Validate fluid solver contracts"]
  Contracts --> Indexes["Build adjacency indexes"]
  Indexes --> Runtime["Runtime-ready graph"]
```

Current component kinds include `reactorCore`, `reactorVessel`, `steamGenerator`, `centrifugalPump`, `processHeader`, `steamHeader`, `processTank`, `processValve`, `steamValve`, `pressurizer`, `pressurizerHeaters`, `generatorSink`, `turbineLoadSink`, and `condenserSink`. Some are richer behaviors, while others are still topology or simple lumped models. That is intentional: the graph can become more detailed without forcing every component to become high-fidelity at once.

## Rich Process Links

Connections are also process links. A link may be a pure topology edge, or it may own physical metadata and link-local variables such as flow, pressure, pressure drop, temperature, radiation, valve position, leak area, or leak flow. This avoids graph explosion. A simple valve or instrument does not need to become its own component between two pipe segments unless it has multiple ports, independent dynamics, or a meaningful standalone failure mode.

Current fluid links declare `connectionKind`, `service`, `nominalFluid`, `designPhase`, and `solverModel`. These fields are not prose labels. The graph compiler treats them as a contract. For example, primary-coolant links must expose pressure and pressure-drop variables, and steam links must expose the state surfaces required by the steam solver model.

```json
{
  "id": "sg-a-steam-to-msiv-a",
  "from": "sgA.steamOutlet",
  "to": "mainSteamIsolationValveA.inlet",
  "connectionKind": "fluidFlow",
  "service": "mainSteam",
  "nominalFluid": "steam",
  "designPhase": "steam",
  "solverModel": "compressibleSteam",
  "physical": {
    "lengthM": 38,
    "diameterM": 0.72,
    "volumeM3": 15.5,
    "nominalResistance": 0.08
  },
  "variables": [
    {
      "path": "flowKgPerS",
      "label": "Main steam flow",
      "kind": "derived",
      "domain": "hydraulic",
      "writable": false,
      "publish": "telemetry",
      "quantity": "flowRate",
      "unit": "kg/s",
      "initialValue": 0,
      "sensorId": "FT-SG-A-001"
    },
    {
      "path": "valve.positionFraction",
      "label": "Main steam isolation valve position",
      "kind": "control",
      "domain": "control",
      "writable": true,
      "publish": "telemetry",
      "quantity": "ratio",
      "unit": "fraction",
      "initialValue": 1,
      "actuatorId": "MSIV-A"
    }
  ]
}
```

Compiled link variables become stable paths such as `sg-a-steam-to-msiv-a.flowKgPerS`, `sg-a-steam-to-msiv-a.pressureMPa`, `sg-a-steam-to-msiv-a.radiationMSvPerH`, `sg-a-steam-to-msiv-a.valve.positionFraction`, and `sg-a-steam-to-msiv-a.leak.areaFraction`.

## Solver Models And Runtime

The runtime is fixed-step and headless. It owns one authoritative process variable table and runs ordered solver phases:

1. apply commands,
2. update control logic,
3. solve fluid-flow components,
4. solve fluid-flow links,
5. solve thermal transfer,
6. solve electrical behavior,
7. update component state,
8. update process-link state.

Behavior modules do not mutate arbitrary global state. Each component or link behavior runs through a constrained behavior context with declared read surfaces and declared write outputs. The execution-plan compiler expands behavior invocations once, validates declared write paths, and then reuses the plan on every tick. This gives future components a firm contract without building a general-purpose plugin engine too early.

The current physics is lumped and directional but increasingly coherent. Reactor core behavior includes fission power, decay heat, fuel temperature, primary coolant heat-up, and simple negative temperature feedback. Reactor coolant pumps own loop-flow inertia and developed head. Steam generators track primary/secondary temperatures, tube-metal temperature, heat transfer, boiling rate, secondary inventory, steam mass, pressure, collapsed level, void fraction, and swell level. The pressurizer now has explicit steam mass accounting: heaters create steam mass, spray condenses it, relief removes it, and steam-mass deviation contributes to pressure response. The vessel tracks primary coolant inventory and pressure bias. SGTR-like tube leakage transfers primary mass into secondary inventory and raises the affected secondary/main-steam radiation indication.

The model is deliberately not a RELAP, Modelica, or CFD replacement. Its value is first-order process behavior that is strong enough for control-room workflow research, scenario scripting, AI-agent studies, and cross-pack interaction. The next level of fidelity should continue this approach: deepen specific component physics only when it unlocks scenario value and can be tested without compromising runtime clarity.

## Pack Query And Command Surface

The pack uses Leitbild's generic pack query surface. It does not add a separate `/api/process-plant/*` endpoint family.

Implemented queries include:

- `process-plant.systems.list`
- `process-plant.graph.read`
- `process-plant.variables.read`
- `process-plant.variables.search`
- `process-plant.runtime.status`
- `process-plant.telemetry.published`
- `process-plant.trends.read`

Implemented command:

- `process-plant.control.write`

This is important for AI agents. An agent can inspect systems, read graph topology, search variables, read current values, inspect configured trends, and write only variables that the runtime declares writable. Suggested actions are not plant truth until accepted through the command path and applied by the runtime.

## Multi-System Runs

A scenario can instantiate multiple process systems using the same graphRef or different graphRefs. There is no special fleet runtime. Each system has its own compiled runtime, variable table, schedule, telemetry recorder, and provider-private snapshot. The six-unit benchmark is just a measurement fixture, not a design limit.

![Six-unit process benchmark](../assets/process-plant-six-unit-trace.svg)

The current six-system benchmark runs six expanded plant graphs independently for five simulated minutes with different scheduled faults. It demonstrates that the architecture can support multi-unit use cases such as SMR clusters without duplicating graph definitions inline. The benchmark script reports machine metadata and realtime factor so local and deployed performance can be compared.

## Acceptance Traces

The process-plant pack now has a dedicated acceptance trace harness:

```sh
bun run process-plant:acceptance
```

The harness compiles the real graphRef, runs six representative cases, samples selected telemetry, creates plots, and fails if high-level physical trend checks do not pass. The current cases are baseline, SGTR-like leak, loss of feedwater, RCP A trip, pressurizer relief opening, and turbine load reduction.

![Process plant acceptance traces](../assets/process-plant-acceptance-traces.svg)

Acceptance traces are not proof of engineering fidelity. They are regression guardrails. They make sure that a physics change does not accidentally remove SGTR leak/radiation coupling, break feedwater-level response, make pump coastdown instantaneous, disconnect relief flow from pressurizer steam mass, or leave turbine output insensitive to load demand.

## Authoring Guidance For Humans And AI Agents

When authoring a process scenario, start with the operational purpose. Decide what must be observable, controllable, and faultable. Then choose a graphRef or define an inline graph. Publish only variables that surfaces, agents, tests, or study instrumentation need. Use link-local variables for simple sensors, valve positions, leaks, and radiation monitors on one connection. Use components for items with multiple ports, independent state, or rich internal behavior.

Do not use process events for continuous physics. Do not turn every process variable into an operational object. Do not add arbitrary scenario-authored equations. Do not use free-text units. Do not create a new solver model without a compiler contract and tests. Do not deepen physics without a trend-level test or acceptance trace showing the intended behavior.

## Specification Summary

Important data types and concepts:

- `PlantGraphSpec`: canonical graph data.
- `ComponentInstanceSpec`: scenario-defined component instance.
- `ConnectionSpec`: scenario-defined typed connection/process link.
- `ProcessLinkVariableDescriptor`: link-local process variable.
- `CompiledPlantGraph`: runtime-ready indexed graph.
- `ProcessPlantRuntime`: fixed-step runtime.
- `ProcessPlantVariableSnapshot`: typed variable readout.
- `ProcessPlantScheduleConfig`: pack-owned timed actions.
- `ProcessPlantTelemetryConfig`: pack-owned trend sampling.

Important files in the Leitbild repo:

- `src/packs/process-plant/graph/model.ts`
- `src/packs/process-plant/graph/compiler.ts`
- `src/packs/process-plant/graph/link-contracts.ts`
- `src/packs/process-plant/graph/component-registry.ts`
- `src/packs/process-plant/specs/pressurized-water-reactor.graph.json`
- `src/packs/process-plant/runtime/runtime.ts`
- `src/packs/process-plant/runtime/component-behaviors.ts`
- `src/packs/process-plant/runtime/process-link-behaviors.ts`
- `src/packs/process-plant/runtime/link-flow-helpers.ts`
- `src/packs/process-plant/runtime/thermophysics.ts`
- `scripts/process-plant/acceptance-traces.ts`
- `scripts/process-plant/six-unit-benchmark.ts`

## Next Work

The strongest next step is not a bigger UI yet. The pack should first finish the current physical-depth phase: make remaining feedwater/condensate behavior more persuasive, strengthen primary pressure/inventory edge cases, add more conservative energy/mass checks where needed, and keep extracting shared physics helpers when formulas recur. After that, the project can widen the component library and add more plant systems. Control/protection logic, alarms, procedures, and process-control surfaces should follow once the physical substrate is stable enough.

