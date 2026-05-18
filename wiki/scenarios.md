---
title: Scenarios
type: scenario
---

# Scenarios

## Scenario Catalog

Leitbild currently ships two public scenario configs: [[scenarios/oslo-ambulance|Oslo Ambulance]] and [[scenarios/halden|Halden]]. Both activate the ambulance and traffic packs, both declare their control surface, and both include script steps for guidance, updates, object creation, highlights, and traffic changes.

## How Scenario Runs Work

A scenario definition is reusable. A scenario run is a live control instance created from that definition. Opening `/i/halden` creates a new Halden run. Opening `/i/halden/sandbox` joins a named run. Reloading a concrete run should rejoin that run rather than recreate the scenario from scratch.

## Source Sync

Scenario detail pages are generated from the JSON scenario files in the Leitbild application repo. Run `bun run sync:leitbild` in this wiki repo after changing scenario JSON in Leitbild.

## Pages

- [[scenarios/oslo-ambulance|Oslo Ambulance]]
- [[scenarios/halden|Halden]]

Related pages: [[tutorials]], [[specs]], [[concepts]], [[domains/ambulance]], [[domains/traffic]].
