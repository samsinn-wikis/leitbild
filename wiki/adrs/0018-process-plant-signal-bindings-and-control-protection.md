---
title: Process Plant Signal Bindings And Control Protection
type: adr
---

# ADR 0018: Process Plant Signal Bindings And Control/Protection Substrate

## Status

Accepted.

## Decision Summary

Process-plant signal identity is graph-owned metadata compiled into each process system. The authoritative identity is `{controlRunId, systemId, variablePath}`. Procedure tags such as `PT-455` are aliases inside an explicit process system, not global variables and not fleet-wide shortcuts.

`tagId` replaces separate `sensorId` and `actuatorId` namespaces. Whether a signal can be commanded is determined by the variable descriptor's `writable` flag.

The process-plant compiler builds indexes by variable path and tag id. Pack queries can resolve, search, and read signals, and commands can write by either variable path or tag id. API calls must include `systemId`; Leitbild does not infer a current unit.

Compiled signal bindings also carry operational capability metadata and optional variable limits. Capability defaults are derived from `writable`, `publish`, and `tagId`; explicit overrides are graph metadata and should be used only when they clarify a real operational surface. `hardRange` is enforced during writes and restore validation. Normal, operating, and alarm ranges are interpretation data for humans, UI, procedures, AI agents, and future protection rules.

Control/protection logic is deterministic, typed, pack-owned behavior. It reads completed tick snapshots, evaluates declarative conditions, queues validated writes for the next solver tick, and emits alarm/trip interaction signals. It does not execute arbitrary scenario code and does not move continuous physics over the event bus.

## Consequences

- AI agents can evaluate procedure tags through the process-plant query surface.
- Procedure bindings stay with the graph that defines the plant and cannot drift into a separate side table.
- Multi-unit scenarios remain independent: the same tag may appear in several systems, and `systemId` disambiguates.
- Protection rules are replayable and testable because they are typed data, not hidden callbacks.
- Continuous process truth remains in the process variable table.

## Guardrails

- Do not reintroduce `sensorId` or `actuatorId`.
- Do not add implicit current-unit lookup.
- Do not add fleet-wide aliases or cross-unit defaulting.
- Do not create a separate binding catalog unless a documented limitation forces a new ADR.
- Do not allow arbitrary expressions, generated code, or mid-solver mutation in protection logic.

See also: [[domains/process-plant]], [[specs]].
