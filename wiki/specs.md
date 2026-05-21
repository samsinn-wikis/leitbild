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

Agents should use pack queries when they need provider-owned read data. They should still use snapshots/object reads for canonical projected objects and command endpoints for changes.

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
