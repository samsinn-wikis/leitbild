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

## Event Model Spec

Domain Events are accepted canonical changes ordered by the Control Instance runtime. The Durable Journal records meaningful history. The Live Feed broadcasts updates to connected clients. Volatile movement updates can affect snapshots without bloating the durable journal.

## Pack Interface Spec

A pack contributes domain schemas, commands, simulation providers, presentation, object categories, scenario codecs, interaction handlers, and optional AI guidance. A pack is the user-facing installable unit; provider IDs are internal runtime wiring.

## Surface Definition Spec

A Surface Definition declares safe UI primitives for a scenario. V1 primitives include map, object rail, system footer, and guidance overlay. Scenarios should not rely on hidden map or rail defaults. Generated or adaptive UI must remain constrained by safe primitive registries.

## Stability Levels

The control-instance identity model, pack concept, scenario config shape, and ambulance domain basics are evolving but stable enough for documentation. Object Context, mission definitions, and advanced adaptive UI remain experimental. Future changes should preserve explicit validation and avoid silent fallback behavior.

Related pages: [[concepts]], [[scenarios]], [[domains/ambulance]], [[agent-guides]], [[source-map]].
