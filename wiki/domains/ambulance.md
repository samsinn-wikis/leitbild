---
title: Ambulance Domain
type: domain
---

# Ambulance Domain

## Domain Overview

The ambulance domain models emergency medical dispatch at a deliberately simple but extensible level. The main object types are ambulances, hospitals, and incidents. Operators dispatch ambulances to incidents, transport patients to hospitals, and watch hospital trauma bed capacity and incident victim demand.

The goal is not to be a certified dispatch system. It is to provide a research-friendly operational domain with enough structure for human operators and AI agents to reason about workload, resource allocation, map interaction, uncertainty, and timed updates.

## Object Types

Ambulances are mobile entities. They have position, route, status, equipment, patient load, tasking, and capacity. Hospitals are facilities with trauma bed capacity and other capabilities. Incidents are demand objects with triage, victim counts, injuries, hazards, and status.

## Dispatch Rules

To dispatch, select an ambulance and then choose a valid target. Valid targets are incidents and hospitals. An empty ambulance sent to an incident can load patients up to capacity. A loaded ambulance sent to a hospital can unload patients if the hospital has receiving capacity.

An incident needs enough assigned or arriving ambulance capacity to cover its victim demand. If too little capacity is directed to the incident, the incident remains under-resourced. If enough capacity is directed, it can be considered covered. When victims reach zero, the incident becomes resolved rather than disappearing automatically.

## Status Indicators

An idle ambulance has a green status dot. A left-pointing yellow arrow indicates outbound movement to an incident. A right-pointing yellow arrow indicates inbound movement to a hospital. A pulsing indicator means the ambulance is en route.

Incident status reflects resource coverage. Red means no suitable ambulance capacity is directed there. Yellow means some capacity is directed but not enough. Green means assigned capacity can cover the current victim demand. Grey indicates a resolved incident.

Hospital status reflects trauma bed availability. Green means all trauma beds are available. Yellow means capacity is limited. Red means no trauma beds are available.

## Hospitals And Capacity

Trauma beds are shown as available over total, for example `3 / 4`. A hospital with `0 / 4` trauma beds has no available trauma capacity. AI agents should check trauma bed availability before recommending or issuing hospital-bound transports.

## Incidents And Victims

Victim counts can be known, estimated, or unknown. Scenario scripts may reveal new information over time. A red `new` badge on an incident or hospital indicates noteworthy updated information.

![Update card and rail NEW badges signalling new incident information](../assets/screenshots/update-indicator.png) Ambulance movement updates are not considered noteworthy and should not produce `new` badges.

## Ambulance Routing

![Ambulance routed to a red bridge collision incident](../assets/screenshots/dispatch-route.png)

Ambulance routes are road-shaped when routing is available. Route progress and ETA are derived from the planned route and the ambulance motion model. Traffic conditions may affect route interpretation, but automatic rerouting is not yet a general policy.

## AI Dispatch Checklist

Before acting, an AI dispatch assistant should verify current object IDs, ambulance availability, ambulance patient load, incident victim demand, currently assigned capacity, hospital trauma beds, and traffic conditions. If the best action is unclear, the agent should explain the uncertainty and ask for confirmation rather than issuing a risky command.

Related pages: [[start-here]], [[concepts]], [[agent-guides]], [[specs]], [[scenarios]].
