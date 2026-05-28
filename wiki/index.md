---
title: Leitbild Wiki
type: summary
---

# Leitbild Wiki

Leitbild is a map-based control-center research platform for supervising, dispatching, and studying moving operational entities. The current public sandbox focuses on ambulance dispatch with traffic conditions, hospital capacity, incidents, scenario scripts, and live map interaction. The broader architecture is intentionally domain-agnostic: the same control-instance model can later host drones, robotaxis, vessels, aircraft, industrial robots, police, fire, or synthetic AI teammates.

This wiki is the companion operational knowledge base for Leitbild. It is both documentation for humans and a retrieval target for AI agents. A human visitor should be able to learn what the demo does, run through the Oslo or Halden scenarios, and understand the rail, map, status arrows, updates, and reset controls. An AI agent should be able to fetch a small set of Markdown files and recover the rules it needs before issuing commands or making recommendations.

## Scope

This wiki covers the concepts, tutorials, domain rules, scenario descriptions, and stable specifications that are useful outside the implementation code. It does not replace the Leitbild application repository. Current executable scenario JSON is mirrored here from the code repo so agents and reviewers can inspect scenario data without cloning the application.

## Recommended Reading

For humans, start with [[start-here]], then [[tutorials]], then [[scenarios]]. For AI agents, start with [[agent-guides]], [[domains/ambulance|ambulance domain rules]], [[concepts]], [[design-guides]], and [[specs]]. For longer-range architecture ideas, see [[simulation-technologies]], [[future-projects]], and the pack references for [[domains/process-plant|process plant]] and [[packs/electric-grid|electric grid]]. The [[source-map]] explains where each part of the wiki comes from.

## Current Demo Scenarios

The current scenarios are Oslo ambulance tutorial and Halden ambulance response. Both activate the ambulance and traffic packs. They show routed ambulance movement, hospital trauma capacity, incidents with victim counts, traffic conditions, scenario guidance cards, and timed updates.

## Feedback

Every paragraph, list item, and section heading in the rendered site has a small feedback icon on hover. Use it to open a GitHub issue for corrections, missing information, unclear wording, or proposed improvements.
