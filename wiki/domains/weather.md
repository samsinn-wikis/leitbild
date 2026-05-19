---
title: Weather Domain
type: domain
---

# Weather Domain

## Purpose

The weather pack should let Leitbild scenarios change operating conditions across space and time. Weather is not just visual atmosphere. It is an operational force: fog reduces visibility at an airport, rain accumulates on roads, frost creates slippery surfaces, snow changes vehicle speeds and route reliability, wind affects drones and vessels, thunderstorms change aviation risk, and ground treatment such as snowplowing can improve one road while nearby roads remain hazardous.

The purpose of the weather pack is therefore to represent environmental conditions that other packs can observe, reason about, and react to. It should support human-facing displays, scenario scripting, AI-agent interpretation, and cross-pack effects. A traffic pack may use ground slipperiness to reduce road speeds. A drone pack may use wind and precipitation to limit flight. An aviation pack may use cloud ceiling and visibility. A hospital pack may receive weather-related incident demand. An emergency-response pack may stage assets differently when a cold front or storm is approaching.

This page defines the desired feature and requirements scope. It deliberately does not choose implementation algorithms or storage formats yet.

## Core Concerns

Weather in Leitbild should be separated into several related but distinct concerns. The first is atmospheric condition: air temperature, precipitation, wind, visibility, cloud layers, storms, icing risk, turbulence, and other conditions above the ground. The second is ground condition: road surface temperature, wetness, standing water, accumulated snow, ice, black ice risk, friction, treatment state, and plowed or salted status. The third is temporal evolution: fronts, showers, fog banks, storm cells, snow bands, clearing, freezing, melting, and accumulation over time. The fourth is operational impact: how those conditions affect movement, routing, safety, sensors, communications, workload, and decision making.

Keeping these concerns separate matters because a scenario may need one without the others. An airport scenario may care about fog, cloud ceiling, wind shear, and runway contamination. An ambulance scenario may care mostly about road slipperiness, visibility, and incident rate. A shipping scenario may care about wind, wave proxies, visibility, and icing. A wildfire scenario may care about wind, humidity, temperature, and fuel moisture. The weather pack should be broad enough to support these use cases while allowing a scenario to activate only the pieces it needs.

## Ground Conditions

Ground condition is the most immediately useful part of the weather pack for the current Leitbild ambulance and traffic demos. It represents what is happening on the surface that vehicles, people, robots, or field teams move across. This includes surface temperature, wetness, rainfall accumulation, standing water, snow depth, packed snow, ice, black ice risk, friction, road treatment, snowplow coverage, and confidence in the condition.

The model should distinguish air temperature from ground temperature. Rain falling through air above freezing can still freeze on a colder road surface. Snow can melt during the day and refreeze overnight. A bridge or exposed road segment can become icy while nearby ground roads remain only wet. These distinctions are important for scenarios involving black ice, winter dispatch, road closures, and route choice.

Ground condition should also support operational modification. If a snowplow or gritting truck has passed over a road, slipperiness should be reduced for that route or area. If rain continues after salting, the effect may decay. If snow continues to fall, plowed roads may gradually accumulate new snow. If traffic is heavy, snow may become packed and icy. These modifying actions do not need to be high-fidelity at first, but they need a place in the feature model: weather creates conditions, operations can change them, and those changed conditions affect other packs.

Ground condition should support both area-wide and route-specific expression. A snowfall can affect an entire district, while a treated road can be a narrow strip following a route. A bridge can have a specific icing warning. A tunnel may be dry while the approach roads are icy. A future weather pack should therefore be able to express broad zones, fine-grained road/path conditions, and local exceptions.

## Atmospheric Conditions

Atmospheric conditions describe the air above the ground. For ground-based emergency response, the most important values are air temperature, precipitation type and intensity, visibility, wind, gusts, lightning risk, and storm status. For aviation, the pack needs richer vertical structure: cloud base, cloud coverage, cloud tops, visibility, wind by altitude, turbulence, icing layers, convective cells, and perhaps runway visual range. For maritime and drone scenarios, low-level wind, gusts, precipitation, visibility, and icing risk may matter more than high-altitude conditions.

A useful weather pack should treat atmospheric state as layered rather than purely two-dimensional. At minimum, it should support near-surface weather and a small number of altitude bands. Aviation-style descriptions such as "broken cloud at 4,000 feet" are not just text; they describe a layer with altitude, coverage, and operational effect. A drone may be allowed below one layer but not above it. A helicopter may face visibility and cloud-ceiling constraints. An airport or air-traffic surface may need to show ceiling, visibility, wind, and storm cells as first-class operational information.

The pack should also represent uncertainty and forecast state. Weather observations are not always current, and forecasts are not guarantees. AI agents and human operators should be able to distinguish observed fog from forecast fog, current road ice from predicted road ice, and a scenario-injected storm from an observed environmental state. This becomes important when a scenario tests anticipation: should dispatch pre-position assets before the snow band arrives, or wait until roads actually degrade?

## Precipitation, Accumulation, And Phase Change

Precipitation should not be represented only as "rain" or "snow." Operationally, the important question is what precipitation does over time. Rain accumulates as surface water. Snow accumulates as depth and may compact. Freezing rain produces ice. Wet roads can refreeze. Snow can melt when temperature rises and then freeze again when surface temperature drops. A cold front can change rain to sleet or snow. These transitions are exactly what make weather operationally interesting.

The feature model should include precipitation type, intensity, duration, accumulation rate, and resulting surface state. It should also include simple phase-change concepts: rain to snow, wet to ice, snow to slush, slush to ice, and ice melting. For v1 requirements, the model does not need meteorological perfection. It does need to support scenario authors saying: rain begins, temperature drops, untreated roads become slippery, snow accumulates, plowed roads improve, and black ice appears on selected cold surfaces.

This separation also helps with explanation. A map should be able to show not only "snow here" but "roads are slippery because accumulated wet snow has refrozen." An AI agent should be able to say, "Ambulance A-12's route crosses untreated road segments where ground temperature is below freezing and wetness is high." That kind of explanation requires state that is more structured than a single weather label.

## Weather Patterns And Evolution

Weather scenarios need time. A static fog polygon or snow area is useful, but many studies will need moving and evolving patterns: a cold front arrives from the west, a thunderstorm cell crosses an airport, a snow band intensifies during rush hour, fog lifts after sunrise, or rainfall turns to snow when temperature drops. The weather pack should therefore support scripted and simulated evolution.

Scenario authors should be able to create named weather patterns such as rain event, snow event, freezing rain event, fog bank, cold front, thunderstorm cell, strong wind episode, or clearing trend. Each pattern should have a time course, geographic footprint, movement, intensity, and operational consequences. The scenario should be able to accelerate time so a two-hour front can pass through a study area in ten minutes, while still preserving the sequence of effects: rain starts, roads become wet, temperature drops, ice forms, snow accumulates, plows reduce risk on selected routes.

Forecasting is a related but separate capability. A weather pack does not need to run a full meteorological forecast model to provide forecast information. It can expose scenario-known future conditions as forecast products with uncertainty and lead time. For aviation, shipping, and emergency response studies, forecast information itself is part of the decision problem. The pack should be able to show "forecast says fog clears at T+30" and later either confirm or violate that forecast depending on scenario design.

## Spatial Representation Requirements

Weather needs flexible spatial representation. Some conditions are best represented as polygons: fog area, thunderstorm warning, snow band, cold front region, airport low-visibility zone. Some are best represented as fields: wind vectors, temperature, visibility, precipitation intensity, surface temperature, slipperiness, smoke or moisture. Some are best represented as road/path segments: treated road, icy bridge, flooded underpass, plowed route, road affected by freezing rain. Some are point observations: airport weather station, road sensor, buoy, drone observation, hospital rooftop station.

The requirements should not force one representation too early. A useful weather pack probably needs a combination of:

- area conditions for broad operational zones;
- field-like conditions for values that vary continuously across space;
- segment conditions for roads, runways, paths, and waterways;
- point observations for sensors and reports;
- vertical layers for aviation and drone use.

The same weather event may produce several projections. A snowstorm can be an atmospheric precipitation area, a ground snow-depth field, a set of road-segment slipperiness conditions, and a forecast product. A plow pass can be a route segment update that modifies the ground-condition projection. A fog bank can be a polygon for visual display and a visibility field for route/surface sampling.

## Operational Effects

Weather should affect operations through explicit, interpretable effects rather than hidden magic. A traffic pack may reduce speed where road friction is low. An ambulance pack may show longer ETA or recommend safer routing. A drone pack may forbid launch when gusts exceed a threshold. An aviation pack may reduce airport capacity under low visibility or cloud ceiling. A hospital pack may increase incident arrivals during icy conditions. A logistics pack may delay deliveries during snow. A wildfire pack may increase spread rate under wind and low humidity.

These effects should be visible and explainable. If an ambulance slows down, the operator should be able to see whether the cause is traffic congestion, road ice, snow accumulation, flooding, or wind-related closure. If an AI agent recommends rerouting, it should cite the specific weather and ground conditions that support the recommendation. If a scenario has forecast uncertainty, the agent should distinguish current condition from forecast risk.

The weather pack should also support interventions. Snowplows, road salting, airport runway clearing, harbor closure, drone no-fly zones, road closure, and emergency advisories are actions that change how weather affects operations. Some interventions belong in other packs, but the weather pack should accept or observe their effects on environmental state.

## Scenario Authoring Requirements

Scenarios should be able to declare initial weather and scripted weather evolution without writing code. A scenario author should be able to express:

- initial air temperature, ground temperature, visibility, wind, precipitation, and road state;
- named weather patterns that move or intensify over time;
- forecast products available to users and AI agents;
- timed changes, such as rain turning into snow at T+10;
- accumulated effects, such as roads becoming slippery after sustained precipitation;
- local exceptions, such as a plowed road, dry tunnel, icy bridge, or treated runway;
- sensor reports and updates that reveal conditions gradually;
- operational advisories such as low-visibility warning, freezing rain warning, or storm warning.

This scenario language should support both deterministic tutorial scenarios and uncertain research scenarios. In a tutorial, the page can say exactly what happens and when. In a research scenario, users may receive an imperfect forecast and have to decide whether to pre-position resources. The weather pack should support both modes.

## UI And Surface Requirements

Weather UI should be layered, inspectable, and controllable. On a map, users may need to see precipitation areas, fog zones, wind arrows, slippery roads, snow accumulation, treated routes, storm cells, or forecast fronts. The UI must avoid turning the map into visual mud. Operators should be able to toggle layers, inspect a point or route, compare current and forecast conditions, and understand why a route or asset is affected.

Different surfaces will need different weather presentations. A dispatch surface may show road slipperiness and ETA effects. An airport surface may show visibility, ceiling, wind, runway contamination, and storm cells. A maritime surface may show wind, visibility, icing risk, and sea-state proxy. A drone-swarm surface may show low-level wind, precipitation, no-fly weather zones, and battery/cold-weather effects. A scenario facilitator surface may show hidden future weather and forecast truth.

The weather pack should support both current condition views and forecast/timeline views. A timeline scrubber or forecast panel could show how a snow band, fog bank, or storm cell is expected to move. Users should be able to inspect "now," "forecast at T+30," and "actual scenario truth" where their role permits it. For AI agents, the UI-visible layers and machine-readable weather context should come from the same underlying state so humans and agents reason over the same world.

## Data Quality, Provenance, And Uncertainty

Weather information has provenance. It may come from scenario truth, a forecast, a sensor, a human report, a vehicle observation, or an AI inference. These should not be blurred. A road segment may be known icy because a sensor reported low friction, estimated icy because precipitation and ground temperature imply risk, or forecast icy because a future cold front is expected.

The pack should represent quality and uncertainty at the level useful for operations. Values may be observed, forecast, inferred, stale, scenario-injected, or disputed. A visibility value may be precise at an airport sensor but uncertain between sensors. A forecast may have confidence that decreases with lead time. A black ice risk may be a probability or categorical risk rather than a binary fact.

This matters for AI agents. An agent should not say "road is icy" when the model only says "road is at risk of black ice." It should be able to cite provenance and confidence. Human operators should likewise be able to see whether a layer is observed truth, forecast, or scenario facilitation state.

## Relationship To Other Packs

The weather pack should be a cross-cutting environmental provider. It should not directly control every affected asset. Instead, it should publish weather and ground-condition projections that other packs consume according to their own domain rules.

The traffic pack may convert road slipperiness, flooding, or low visibility into speed factors, closures, or route risk. The ambulance pack may show weather-adjusted ETA and route warnings. The drone pack may use wind, precipitation, and visibility to constrain missions. The aviation pack may use ceiling, visibility, wind, and storm cells to affect airport capacity and flight safety. The hospital pack may use weather to increase incident demand or delay transfers. The logistics pack may use road and visibility conditions to adjust delivery reliability. The wildfire pack may use wind, temperature, and humidity to change spread behavior.

This separation keeps weather from becoming a hidden global modifier. Weather publishes environmental truth and forecast products. Domain packs decide how those conditions affect their operations, preferably through explicit rules that can be inspected and tested.

## Feature Scope Summary

The widest reasonable weather pack scope includes:

- atmospheric state: temperature, precipitation, wind, visibility, cloud layers, storm cells, lightning risk, icing/turbulence risk;
- ground state: surface temperature, wetness, standing water, snow depth, ice, black ice risk, friction, treatment/plowing/salting state;
- spatial forms: polygons, fields, road/runway/waterway segments, point observations, vertical layers;
- temporal evolution: moving fronts, intensifying or weakening systems, accumulation, melting, freezing, clearing, forecast vs actual;
- operational effects: route speed, slipperiness, closures, flight/drone limits, hospital demand, wildfire spread, logistics delay;
- scenario authoring: initial conditions, scripted weather events, forecasts, uncertainty, local exceptions, interventions;
- UI layers: current weather, ground condition, forecast, timeline, route impact, sensor reports, role-specific truth;
- AI context: machine-readable weather facts with provenance, confidence, forecast lead time, and operational implications.

The first implementation does not need all of this. The scope is deliberately broad so that early choices do not block aviation, maritime, wildfire, traffic, drone, or process-control scenarios later.

## Open Questions

The next design step should decide how much of this belongs in the first weather pack. The main questions are:

- Should v1 focus on ground conditions for road operations, or include basic atmospheric layers from the start?
- Should road-impact weather be represented primarily as route/segment conditions, area conditions, field conditions, or a combination?
- How much vertical structure is needed before we build aviation or drone scenarios?
- Should forecast products be authored as scenario data first, with simulated weather evolution added later?
- Which weather effects should be automatically consumed by traffic/routing, and which should merely be displayed for human or AI interpretation?
- What is the right way to represent uncertainty without making simple scenarios hard to author?
- How should interventions such as snowplowing, salting, and runway clearing modify ground state?

Related pages: [[concepts]], [[simulation-technologies]], [[domains/traffic]], [[domains/ambulance]], [[scenarios]], [[agent-guides]].
