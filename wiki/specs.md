---
title: Specifications
type: spec
---

# Specifications

## Scenario Config Spec

Scenario configs are JSON documents with `schemaVersion`, `id`, `title`, `packs`, `world`, `objects`, `surface`, and optional `script`. They are authoring documents, not arbitrary executable code. Pack-specific object specs are expanded by pack-owned scenario codecs.

Required high-level fields include an id, a schema version, a title, active pack IDs, world startup information, initial objects, and a surface definition. Provider overrides and provider config are allowed but should remain keyed by pack-level concepts when exposed to scenario authors.

## Scenario Script Spec

V1 scenario scripts support steps scheduled relative to scenario start: `after_scenario_start` with seconds. Supported actions include showing or hiding guidance, highlighting or clearing objects, creating objects, updating objects through pack operations, and deleting objects.

Scripts are for tutorial flow, timed incidents, delayed fact revelation, and scenario-authored changes. Scripts should not contain loops, arbitrary expressions, or domain business logic.

## Operational Object Spec

An Operational Object has identity, kind, domain, label, lifecycle, spatial state, operational state, optional tasking, alerts, provenance, timestamps, optional `domainData`, and optional `context`. The envelope is generic. Domain packs own the domain-specific content.

## Object Context Spec

Object Context is perspective-bearing awareness. It can store facts, activity, references, and summaries. It is useful for artificial situation awareness, radio history, memory, and agent handoff. It must not blur with canonical `domainData`.

## Command API Spec

Commands are sent to a control instance and routed to the provider that accepts the command kind. Commands have lifecycle events: issued, accepted, rejected, and resulting object updates. Agents should verify command outcomes by reading command status or updated projected state.

## Pack Query API Spec

Pack queries are read-only questions sent to the active provider for a pack through the generic Control Instance API. The route is `POST /api/control-instances/:id/queries`; the request envelope names a `packId`, a query `kind`, and a validated `payload`.

The important rule is that this is one generic surface, not a new endpoint family for every pack. Weather, ambulance, traffic, and future packs use the same query envelope. The simulation hub routes the query to the provider that owns the requested pack. If the pack is not active in the current scenario run, the query fails explicitly instead of guessing or returning hidden defaults.

Current query kinds include weather point, route, area, field-stat, and map-feature queries; ambulance object and dispatch-state queries; and traffic condition and route-intersection queries. Queries must not mutate the run. Commands and interaction signals remain the mutation surfaces.

Request envelope:

```json
{
  "packId": "weather",
  "kind": "weather.sampleAtPoint",
  "payload": {
    "point": { "type": "Point", "coordinates": [10.75, 59.91] }
  }
}
```

Current weather queries:

- `weather.sampleAtPoint`: sample the provider-owned sparse H3 field at a point.
- `weather.sampleAlongRoute`: sample weather along a line route at a requested interval.
- `weather.summarizeArea`: summarize materialized weather cells in a polygon.
- `weather.fieldStats`: return field size and provider-side weather-field metadata.
- `weather.mapFeatures`: project base H3 grid outlines, affected H3 cells, and influence shapes for a viewport/zoom/time into generic map features.

Current ambulance queries:

- `ambulance.objects`: return ambulance-domain operational objects, optionally filtered by ambulance, hospital, or incident type.
- `ambulance.object`: return one ambulance-domain object by id.
- `ambulance.dispatchState`: return a dispatch-oriented summary of ambulances, incidents, hospitals, assignments, and availability.

Current traffic queries:

- `traffic.conditions`: return traffic condition objects.
- `traffic.condition`: return one traffic condition by id.
- `traffic.conditionsForRoute`: return route-relevant traffic conditions that intersect or affect a route geometry.

Current process-plant queries:

- `process-plant.systems.list`: list active process systems.
- `process-plant.graph.read`: return compiled graph topology and signal metadata.
- `process-plant.variables.read`: read current variable snapshots by variable path.
- `process-plant.variables.search`: search variable snapshots by text, domain, quantity, and publication policy.
- `process-plant.signals.resolve`: resolve `{path}` or `{tagId}` references inside an explicit `systemId`.
- `process-plant.signals.read`: resolve signals and return current variable snapshots.
- `process-plant.signals.search`: search signal bindings by tag, equipment, text, domain, quantity, writability, and publication policy.
- `process-plant.runtime.status`: summarize process runtime status.
- `process-plant.telemetry.published`: return currently published telemetry variables.
- `process-plant.trends.read`: read configured trend buffers.
- `process-plant.protection.status`: read configured protection-rule state.

Agents should use pack queries when they need provider-owned read data. They should still use snapshots/object reads for canonical projected objects and command endpoints for changes.

## Process Signal Binding Spec

Process signal bindings are graph-owned metadata attached to component and link variables. They expose process values to humans, procedures, AI agents, and control-room surfaces without creating a separate binding catalog.

The authoritative runtime identity is `{controlRunId, systemId, variablePath}`. Procedure-facing tags are optional aliases inside one process system. Every API read/write that uses a tag must include `systemId`.

Allowed signal metadata fields:

- `tagId`: compact procedure/operator tag such as `PT-455`.
- `equipmentId`: equipment or component reference.
- `description`: short explanation.
- `externalRefs`: optional stable external references.
- `capabilities`: compiled/overridden operational visibility metadata.
- `limits`: optional normal, operating, hard, and alarm ranges.

`tagId` replaces separate sensor/actuator namespaces. Writability is the variable descriptor's `writable` flag.

Compiled capabilities are `readable`, `writable`, `trendable`, `alarmable`, `operatorFacing`, `aiVisible`, and `procedureRelevant`. Defaults come from `writable`, `publish`, and `tagId`; overrides should be used only when the default would misrepresent the operational surface.

`hardRange` is enforced by the runtime. Other ranges and alarm limits are interpretation metadata. This distinction keeps safety validation real without turning every generic process value into an arbitrary bounded variable.

## Process Control/Protection Rule Spec

Process control/protection rules are typed declarative data evaluated by the process-plant pack. They are not arbitrary expressions or generated code.

Supported V1 condition forms:

- comparison/equality against a signal value,
- `all`,
- `any`,
- `not`,
- simple voting,
- delay/latch/reset metadata.

Supported effects:

- emit alarm interaction signal,
- emit trip interaction signal,
- queue a validated variable write for the next solver tick.

Rules run after a physics tick and before telemetry sampling. They read the completed tick snapshot and never mutate variables mid-solver.

## Event Model Spec

Domain Events are accepted canonical changes ordered by the Control Instance runtime. The Durable Journal records meaningful history. The Live Feed broadcasts updates to connected clients. Volatile movement updates can affect snapshots without bloating the durable journal.

## Pack Interface Spec

A pack contributes domain schemas, commands, simulation providers, presentation, object categories, scenario codecs, interaction handlers, and optional AI guidance. A pack is the user-facing installable unit; provider IDs are internal runtime wiring.

## Process Plant Graph Spec

Process plant systems are scenario-owned graph specs under `processSystems`. A `PlantGraphSpec` declares a fixed timestep, component instances, typed connections, optional process-link metadata, process-link variables, and published variables. The graph compiler validates component kinds, parameters, port refs, port compatibility, process link kinds, unit-bearing variables, and publication paths before runtime.

The process-plant pack uses scenario data as the canonical plant topology and keeps component physics code-backed and tested. Stable process variable paths, typed ports, structured quantities/units, and rich process links are documented in [[domains/process-plant]].

## Surface Definition Spec

A Surface Definition declares safe UI primitives for a scenario. V1 primitives include map, object rail, system footer, and guidance overlay. Scenarios should not rely on hidden map or rail defaults. Generated or adaptive UI must remain constrained by safe primitive registries.

## Stability Levels

The control-instance identity model, pack concept, scenario config shape, and ambulance domain basics are evolving but stable enough for documentation. Object Context, mission definitions, and advanced adaptive UI remain experimental. Future changes should preserve explicit validation and avoid silent fallback behavior.

Related pages: [[concepts]], [[scenarios]], [[domains/ambulance]], [[agent-guides]], [[source-map]].
