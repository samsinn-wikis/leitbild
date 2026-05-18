---
title: Start Here
type: summary
---

# Start Here

## What Is Leitbild

Leitbild is a control-center sandbox for things moving on a map. It gives operators a shared operational picture, lets them inspect moving assets and incidents, and lets them issue commands such as dispatching an ambulance to an incident or hospital. The first domain is ambulance dispatch, but the architecture is meant to generalize to drones, robotaxis, vessels, aircraft, robots, emergency response units, and mixed simulations.

The word Leitbild means guiding image or model. In this project it points to an action-oriented shared picture: not just a map, but a map-linked control surface where people, simulations, and AI agents can coordinate around operational objects.

## Quickstart For Humans

Open the current sandbox at [leitbild.samsinn.app](https://leitbild.samsinn.app/). Choose a scenario such as Halden or Oslo. After startup, the map appears with a left rail listing hospitals, ambulances, incidents, and traffic. The scenario guidance card explains the initial task. You can dismiss it, but for a first visit it is worth reading.

To dispatch an ambulance, select an ambulance in the rail or on the map, then click an incident or hospital target. A left-pointing arrow next to an ambulance means it is outbound to an incident. A right-pointing arrow means it is inbound to a hospital. An idle ambulance has a green status dot. Dispatch enough ambulance capacity to cover the victims at an incident, then transport patients to hospitals with available trauma beds.

Use the eye icons in the rail to show or hide extra data fields such as victims, trauma beds, traffic severity, and reasons. Use the question mark on an object row for a tooltip with more details. Use the settings button in the footer to switch scenarios, reset the current scenario run, or change theme.

## Quickstart For AI Agents

Before acting, retrieve [[agent-guides]], [[domains/ambulance]], the relevant scenario section in [[scenarios]], and the command/API sections in [[specs]]. Observe the current state before issuing commands. Never invent object IDs. Use the API or current object list to confirm ambulance IDs, incident IDs, hospital IDs, victim counts, target assignments, hospital capacity, and traffic conditions.

A dispatch assistant should recommend or issue commands only after checking whether an incident still needs capacity, whether an ambulance is idle or already assigned, whether a hospital has available receiving capacity, and whether traffic conditions could make a route undesirable. If the information is uncertain, state the uncertainty explicitly.

## Glossary

**Control Instance**: A running shared operational world, such as one Halden or Oslo scenario run. Multiple clients can join the same control instance.

**Scenario Run**: A URL-addressable run of a scenario, for example `/i/halden/sandbox` or `/i/oslo-ambulance/run-...`.

**Operational Object**: A canonical object in Leitbild: ambulance, hospital, incident, traffic condition, or future domain entity.

**Pack**: A domain capability bundle. The ambulance pack defines ambulance, hospital, and incident behavior. The traffic pack defines traffic conditions.

**Surface**: The assembled user interface for a scenario, such as map, rail, footer, and guidance overlay.
