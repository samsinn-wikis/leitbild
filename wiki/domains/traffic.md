---
title: Traffic Domain
type: domain
---

# Traffic Domain

## Traffic Conditions

The traffic domain models aggregate route-affecting conditions rather than individual vehicles. A traffic condition can represent congestion, slowdown, closure, or access restriction. The object may be a road segment or a polygonal area.

This design is intentional. Aggregate conditions are cheaper to render, easier to explain to operators, and easier for AI agents to reason over than hundreds of individual traffic vehicles.

## Road Segment Conditions

Road segment traffic can be authored by giving two points. The traffic pack routes between those points so the condition follows the road network rather than drawing an arbitrary straight line. This is the preferred mode when the condition is meant to represent congestion on actual roads.

## Area Conditions

Area traffic describes a polygon where movement may be slower or constrained. Area conditions are useful for events, weather impacts, blocked neighborhoods, or general incident zones where road-by-road detail is not required.

## Route Impact Rules

A traffic condition has a severity and may have a speed factor. Severity helps humans see importance. Speed factor expresses how much a condition should slow affected movement modes. V1 can display these conditions and make them available for routing and agent interpretation, but it does not silently reroute ambulances unless a future policy explicitly enables automatic rerouting.

## AI Interpretation Rules

An AI agent should treat traffic as operational context. If an ambulance route crosses a high-severity traffic condition, the agent may recommend rerouting or choosing a different ambulance, but it should not assume hidden automatic rerouting. It should state whether it is recommending a human action, issuing a command, or only flagging a concern.

Related pages: [[concepts]], [[domains/ambulance]], [[agent-guides]], [[scenarios]].
