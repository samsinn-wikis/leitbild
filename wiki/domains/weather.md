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

## V1 Implementation Recommendation

The recommended v1 is a native TypeScript weather pack with a RoadSurf-inspired ground-condition model, scenario-authored weather evolution, MapLibre weather layers, and route-impact projections that other packs can consume. It should not attempt to run a full meteorological model. It should not integrate WRF, pySTEPS, Open-Meteo, or RoadSurf as runtime dependencies in the first pass. Those systems are useful references and future integration paths, but v1 should be deterministic, scenario-controlled, dependency-light, testable, and tightly aligned with the current Leitbild pack architecture.

The design center for v1 is winter road operations. This gives the pack immediate operational value for ambulance, traffic, logistics, and emergency-response scenarios while still laying a foundation for aviation, maritime, drone, and wildfire use cases. A scenario should be able to say that rain starts, ground temperature falls below freezing, untreated roads develop black ice risk, snow accumulates, visibility drops, a snowplow clears a route, and route speeds or ETAs change because of those environmental conditions. That is a credible and useful simulation even without high-fidelity weather forecasting.

The pack should publish environmental projections rather than secretly mutating other domains. Weather owns atmospheric and ground-condition state. Traffic, ambulance, drone, aviation, hospital, logistics, and other packs decide how to consume that state. This preserves the same architectural rule used elsewhere in Leitbild: packs own their internals; Leitbild coordinates commands, events, signals, projections, snapshots, and surfaces.

## V1 Capability Set

V1 should support scenario-authored weather zones, weather patterns, and road-condition effects. A weather zone is a spatial area with atmospheric properties such as air temperature, ground temperature, precipitation, visibility, and wind. A weather pattern is a zone or band that changes over time: it can start, stop, move, intensify, weaken, or change precipitation type. A road-condition effect is the operational projection that other packs actually care about: wetness, snow, ice, black ice risk, friction class, speed factor, treatment state, and confidence.

The minimum atmospheric values for v1 should be air temperature, ground temperature, precipitation type, precipitation intensity, visibility, wind direction, and wind speed. These are enough to support rain, snow, freezing rain, fog, wind, and basic forecast products. Cloud layers, turbulence, icing layers aloft, and aviation-specific ceiling concepts should be represented in the scope and schema direction, but they do not need full simulation behavior in v1.

The minimum ground-condition values for v1 should be surface temperature, water accumulation, snow accumulation, ice accumulation, black ice risk, friction class, treatment state, and speed factor. These values should be understandable to humans and AI agents. "Slippery" should not be a mysterious label; it should be explainable as a consequence of wetness, ice, snow, surface temperature, and treatment.

The minimum intervention set should be plowed, salted, gritted, cleared, and closed. A snowplow or road-treatment action should reduce snow, ice, or friction penalty along a route or area, with an effect that can decay over time. This is important because weather should not be a one-way global modifier. Operations can change environmental consequences.

The minimum forecast support should be scenario-authored forecast products. V1 does not need to compute forecasts from meteorology. It should let a scenario publish forecast information with valid time, confidence, affected area, hazards, and summary. This allows studies where users must anticipate a cold front, fog bank, or snowfall before the ground condition has fully materialized.

## Core Algorithms And Mathematical Approach

V1 should use simple deterministic update equations, not complex meteorology. The core simulation loop advances on the Leitbild control-instance clock. On each weather update, the pack evaluates active scenario patterns, projects current atmospheric forcing into affected spatial areas, updates ground-condition state for affected road or area cells, applies interventions such as plowing or salting, and publishes changed projections.

For pattern movement, v1 can use linear interpolation over time. A precipitation band can move from one geometry to another over a configured duration. A fog polygon can expand, contract, or translate. An intensity curve can interpolate from light rain to heavy rain. This is enough to create a credible cold-front or snow-band scenario without implementing numerical weather prediction.

For accumulation, v1 can use mass-balance style storage variables. A road-condition state has water, snow, and ice storage. Rain increases water. Snow increases snow. If ground temperature is below freezing, water gradually converts to ice. If surface temperature is above freezing, snow and ice melt into water and then drain or evaporate slowly. Treatment can reduce snow or ice storage and improve friction. These equations can be deliberately simple but still causally structured.

A plausible road-state update can be described as:

```text
water += rainRate * dt
snow += snowRate * dt
if groundTemperature < 0:
  ice += freezeRate(water, groundTemperature) * dt
  water -= frozenAmount
if groundTemperature > 0:
  melt = meltRate(snow, ice, groundTemperature) * dt
  snow -= snowMelt
  ice -= iceMelt
  water += melt
water -= drainageRate(water, roadClass, slope) * dt
snow -= plowEffect * treatmentEffectiveness
ice -= saltEffect * treatmentEffectiveness
friction = deriveFriction(water, snow, ice, blackIceRisk, treatment)
speedFactor = deriveSpeedFactor(friction, visibility, roadClass)
```

The formulas should be transparent rather than overly calibrated. The first goal is directional correctness: sustained rain makes roads wet, freezing wet roads become icy, snow accumulates, treatment improves conditions, and untreated roads remain worse than treated roads. A later version can replace these functions with RoadSurf-inspired or RoadSurf-backed physics.

For black ice risk, v1 can use a bounded risk score from 0 to 1. It should increase when water is present, ground temperature is below freezing, precipitation or melting has recently occurred, and road exposure is high. It should decrease with treatment, warming, drying, and time. Black ice risk should be a risk signal, not a binary truth, unless a scenario explicitly marks it as observed.

For spatial matching, v1 should use geometry intersection rather than requiring stable road IDs from day one. Weather zones and road-condition routes have geometries. Active route geometries can be sampled against those geometries to estimate affected distance. The affected-distance fraction and condition severity produce route speed penalties and warnings. This avoids blocking on perfect OSM segment identity while preserving a path to stable OSM-derived road segment IDs in v2.

For routing impact, v1 should separate ETA adjustment from route recomputation. The first version can calculate normal routes, sample the route against active weather conditions, compute a weather-adjusted ETA, and show route-impact explanations. Rerouting around weather should be an explicit command or policy, not a hidden automatic side effect. V2 can feed dynamic edge penalties into the routing engine so the chosen route itself avoids icy or closed segments.

## Data And Projection Model

The weather pack needs internal state and published projections. Internal state can be optimized for simulation. Published projections should be stable, typed, and useful to other packs.

The core published concepts are:

- weather pattern: named atmospheric event with current geometry, intensity, movement, and time state;
- ground condition: road, route, area, or field condition with wetness, snow, ice, friction, speed factor, and treatment;
- weather signal: point or area facts such as visibility, wind, temperature, and hazard status;
- forecast product: scenario-authored statement about expected future conditions, confidence, valid time, and hazards;
- weather event: meaningful changes such as freezing rain started, road became icy, route treated, visibility below threshold, or forecast updated.

A road-condition projection should be explicit enough for both UI and routing:

```ts
interface RoadConditionProjection {
  id: string;
  sourcePackId: "weather";
  geometry: LineString | MultiLineString;
  validFrom: string;
  validUntil?: string;
  condition: {
    surfaceTemperatureC?: number;
    waterMm?: number;
    snowMm?: number;
    iceMm?: number;
    blackIceRisk?: number;
    frictionClass: "normal" | "wet" | "slippery" | "icy" | "blocked";
    speedFactor: number;
    treatment?: "none" | "plowed" | "salted" | "gritted" | "plowed-and-salted";
    confidence: number;
  };
  provenance: {
    kind: "scenario" | "forecast" | "observed" | "inferred" | "intervention";
    sourceId?: string;
  };
}
```

The internal model should store only active conditions, not every road in the map. A weather pack should not precompute a road state for all of Oslo every tick. Instead, it should maintain states for scenario-declared zones, active road-condition geometries, recently sampled routes, and treatment routes. This keeps memory and CPU bounded and makes the model credible on a small Hetzner instance.

## Scenario Authoring Plan

Scenario authoring is central. The weather pack should be powerful because scenarios can parameterize it, not because users need to code weather behavior manually. A weather scenario block should support initial conditions, named patterns, ground rules, forecast products, and interventions.

Example:

```json
{
  "weather": {
    "initial": {
      "airTemperatureC": 1,
      "groundTemperatureC": -2,
      "visibilityM": 9000,
      "wind": { "directionDeg": 240, "speedMps": 6 }
    },
    "patterns": [
      {
        "id": "freezing-rain-front",
        "label": "Freezing rain front",
        "kind": "precipitationBand",
        "startsAt": "T+120s",
        "durationSeconds": 1200,
        "movement": {
          "fromLine": {
            "start": { "lon": 10.65, "lat": 59.95 },
            "end": { "lon": 10.90, "lat": 59.95 }
          },
          "toLine": {
            "start": { "lon": 10.85, "lat": 59.95 },
            "end": { "lon": 11.10, "lat": 59.95 }
          }
        },
        "precipitation": {
          "type": "rain",
          "intensityMmPerHour": 4
        },
        "temperatureTrend": {
          "airTemperatureC": { "from": 1, "to": -3 },
          "groundTemperatureC": { "from": -1, "to": -4 }
        },
        "visibilityM": { "from": 8000, "to": 1500 }
      }
    ],
    "forecasts": [
      {
        "issuedAt": "T+0s",
        "validFrom": "T+600s",
        "summary": "Freezing rain likely west of Ring 2 after T+10.",
        "confidence": 0.7,
        "hazards": ["black-ice", "low-visibility"]
      }
    ]
  }
}
```

Interventions should also be scenario-scriptable and commandable. A snowplow action might target a drawn route, an OSM-derived road segment group, or a polygon. The result should be a ground-condition modification with known effectiveness and decay:

```json
{
  "type": "weather.applyRoadTreatment",
  "target": { "routeId": "plow-route-ring-2" },
  "treatment": {
    "kind": "plowed-and-salted",
    "effectiveness": 0.75,
    "decayMinutes": 45
  }
}
```

The authoring model should avoid arbitrary expressions in v1. Rules such as "rain on subzero ground increases black ice risk" should be built into named rule presets, not authored as unvalidated code. This keeps scenario JSON readable and AI-authorable.

## Map And Routing Extensions

The map system needs weather layers and route-impact sampling. MapLibre can render the v1 requirements using normal sources and layers: filled polygons for weather zones, line layers for affected roads, symbol or line patterns for wind and treatment, and popups or side panels for inspection. V1 should avoid custom WebGL or canvas layers unless MapLibre layers are clearly insufficient.

The key technical extension is a route-condition sampler. Given a route geometry and the set of active road-condition projections, it calculates which portions of the route overlap wet, snowy, icy, blocked, or treated conditions. It then returns affected distance, worst hazard, aggregate speed factor, explanation strings, and visual segments. This sampler should be reusable by the ambulance pack, traffic pack, logistics pack, and future drone/vehicle packs.

For v1, routing can remain conservative:

1. calculate route normally;
2. sample route against active weather conditions;
3. adjust ETA and display route warnings;
4. let the user or AI agent request reroute if needed.

For v2, the router should accept dynamic edge penalties so routes can avoid weather-affected segments automatically when policy permits. That requires more stable road identity than geometry overlap alone. A future vector-tile or routing preprocessing step should generate stable road segment IDs from OSM-derived data so weather, traffic, routing, and plow actions can all refer to the same road entities.

## UI Concept

The v1 weather UI should make conditions legible without overwhelming the map. The map should support toggles for weather zones, ground conditions, treated routes, and forecast. Weather zones should be translucent and calm. Road conditions should use road-following line overlays: blue for wet, white/light blue for snow, amber for slippery risk, red for icy/blocked, and green or blue-green for treated routes. The style should be professional and operational, not decorative.

The left rail or settings surface should include a Weather category when the active scenario includes the weather pack. It should list active weather patterns, forecast products, and major ground-condition hazards. A row might say "Freezing rain front," "Black ice risk west of Ring 2," or "Plowed route active: Aker to Ullevaal." The row should expose details on hover or click: valid time, confidence, affected area, expected impacts, and source.

The map should provide inspection at three levels. Clicking a weather zone shows atmospheric state and forecast. Clicking an affected road shows ground condition, treatment state, friction class, speed factor, and explanation. Selecting an ambulance route should show route impact: affected distance, ETA penalty, worst condition, and whether rerouting is recommended.

The scenario guidance overlay should be able to explain weather as part of a tutorial: "Freezing rain begins in two minutes; untreated roads will become icy. Dispatch enough ambulances before the route degrades, or inspect the weather layer to plan safer routing." This is important because the pack is not just a visual feature; it is a research and training variable.

The settings modal should eventually let users toggle weather layers and choose whether forecast, current, or facilitator truth is shown. The first implementation can keep this simpler: layer visibility controls and a current/forecast toggle are enough. Role-specific hidden truth should wait until we have richer role support.

## Technical UI Implementation Plan

The UI implementation should use the existing MapLibre-first rendering doctrine. Weather zones, affected roads, treated routes, and forecast geometries should be native MapLibre GeoJSON sources and layers. Rich explanatory UI should remain in Svelte: rail rows, hover cards, route-impact panels, and scenario guidance.

The map source plan should be:

- `weather-zones-source`: polygons for precipitation, fog, wind/storm, and forecast areas;
- `weather-road-conditions-source`: line features for wet, snowy, icy, blocked, or treated roads;
- `weather-point-observations-source`: optional sensor/report points;
- `weather-route-impact-source`: route segments affected for the selected asset.

Layer ordering should put weather zones above the base map but below operational objects, and road-condition lines above road labels only when necessary. Routes and selected object halos must remain readable. Forecast layers should use dashed or lower-opacity styling so users do not confuse forecast with current conditions.

The rail presenter should receive weather category metadata from the pack presentation layer, not hardcoded weather UI. Weather field visibility should reuse the category visibility system where possible: users can toggle active pattern, precipitation, visibility, road condition, treatment, and forecast. This keeps the implementation aligned with the existing pack-driven surface model.

The route-impact UI should be built as a reusable component, not ambulance-specific. It should accept a selected route, active route impacts, and an object label. It should display "weather impact," "traffic impact," and later other constraints in a consistent way. This avoids hardcoding winter-road semantics into ambulance cards.

## Hetzner Feasibility And Performance

This v1 is credible on the current Hetzner deployment because it is not a full weather model. It is a sparse, scenario-driven environmental state engine. It updates only active weather patterns, affected geometries, active routes, and relevant treatment states. It does not compute every road in Norway, every map tile, or every weather grid cell.

The computational cost is mainly geometry and small-state updates. A typical sandbox scenario might have fewer than ten weather patterns, tens of road-condition features, and a small number of active routes. Updating storage variables for those features once per second or once every few seconds is trivial compared with vector tile serving and normal web traffic. The expensive part is route/geometry overlap if implemented carelessly, but this can be optimized.

The first optimization is cadence. Weather state does not need to update at animation frame rate. A one-second or five-second simulation cadence is enough for most operational scenarios. UI animation can interpolate moving weather polygons visually if needed, but simulation truth should update on controlled ticks.

The second optimization is dirty sets. Only active patterns, recently changed road conditions, selected routes, and routes belonging to moving assets need recalculation. If a snow band is stationary or a route does not intersect any weather zone, there is nothing to recompute.

The third optimization is spatial indexing. V1 can start with bounding-box prefilters before doing line/polygon intersections. V2 can add a small grid or R-tree index over active condition geometries. Since the active weather features are sparse, even simple bounding-box checks are likely enough for early scenarios.

The fourth optimization is projection compression. The weather pack should publish aggregate road-condition geometries rather than many tiny segment updates when possible. If an entire route is icy, one line feature is better than hundreds of micro-features. Detailed road segment identity can come later when dynamic routing needs it.

The fifth optimization is route-impact caching. A route impact is valid until the route changes or relevant weather condition changes. We should cache impact results by route id and weather revision. This avoids resampling every asset route on every UI update.

On a modest Hetzner instance, this model should comfortably support dozens of active weather features, dozens of active routes, and hundreds of operational objects. If we later simulate thousands of route segments or city-wide road states, we should move to stable road segment IDs, spatial indexes, coarser update cadence, and aggregate projections. Nothing in v1 should prevent that.

## Implementation Phases

Phase 1 should define the weather domain schema and pack boundary. Add weather scenario config validation, domain types for atmospheric condition, ground condition, weather pattern, forecast product, road treatment, and road-condition projection. The pack should load scenario-authored weather state and publish static weather zones before any evolution is added.

Phase 2 should add deterministic evolution. Implement moving/intensifying patterns, simple precipitation accumulation, temperature trends, wetness/snow/ice storage updates, black ice risk, and treatment decay. Add tests for freezing rain, snow accumulation, melting, and plowing.

Phase 3 should add map rendering. Add MapLibre layers for current weather zones, road conditions, treated routes, and forecast areas. Add rail presentation for active weather patterns and hazards. Add inspection popups or Svelte overlays for condition details.

Phase 4 should add route-impact sampling. Given a route geometry and active road-condition projections, compute affected distance, speed factor, ETA penalty, and explanations. Display this for selected ambulance/logistics routes. Keep actual rerouting manual or explicit.

Phase 5 should add cross-pack consumption. The traffic pack should consume road-condition projections and publish route impact or speed penalties. The ambulance pack should display weather-adjusted ETA and warning state without directly owning weather rules.

Phase 6 should add scenario authoring examples. Add one winter-road scenario where freezing rain creates black ice and a treatment route improves selected roads. Add one fog/visibility scenario as a stepping stone toward aviation and drone use.

Phase 7 should add v2 preparation: stable road segment IDs, forecast timeline controls, optional external forecast ingestion, and richer field projections.

## Critical And Blocking Questions

Several decisions should be resolved before implementation begins. The first is road identity. V1 can use geometry overlap, but if we want reliable long-lived road conditions, plow routes, and dynamic rerouting, we eventually need stable road segment IDs. The blocking question is whether v1 should accept geometry-only matching or spend early effort deriving road segment identity from OSM/vector tile data.

The second question is routing behavior. Should v1 only adjust ETA and show route warnings, or should it also change selected routes automatically? The safer initial answer is ETA adjustment and explicit reroute. Automatic weather-aware routing is powerful, but it can hide behavior and create confusing changes unless policy and UI are very clear.

The third question is scenario grammar. Weather evolution should be powerful enough for authored scenarios but not become arbitrary code. We need to decide the first set of named pattern kinds and rule presets: precipitation band, fog area, cold front, snow shower, freezing rain, wind episode, road treatment. Adding too many pattern types before implementation could create bloat.

The fourth question is how detailed ground physics should be. A RoadSurf-inspired model is credible, but a too-detailed surface-energy model would slow development and be hard to explain. The v1 target should be directional, explainable, and testable rather than calibrated.

The fifth question is UI density. Weather layers can easily clutter the map. We should decide which layers are visible by default in ambulance scenarios. A likely default is current road condition and active warnings, with precipitation/forecast/treatment available through toggles.

The sixth question is persistence. Ground-condition accumulations and treatment state must survive reload and snapshot restore. That means weather pack state cannot be purely derived from scenario start every time. The control-instance snapshot needs enough weather state to restore current truth.

## Adversarial Review Of The V1 Plan

The main correctness risk is pretending that a simplified road-weather model is a weather forecast. The mitigation is language and UI discipline: v1 is scenario-driven operational weather, not numerical weather prediction. Forecast products are authored scenario artifacts, not computed meteorology.

The main architecture risk is letting weather directly mutate traffic, ambulance, or route state. The mitigation is projection-based interaction. Weather publishes ground conditions and signals; traffic/routing samples them; ambulance displays the resulting impact. This keeps cross-pack behavior inspectable.

The main performance risk is trying to maintain state for every road segment in the map. The mitigation is sparse active state, dirty sets, cadence control, bounding-box prefilters, route-impact caching, and aggregate geometries. V1 should simulate only scenario-relevant weather and route conditions.

The main UI risk is visual clutter. The mitigation is layer toggles, restrained styling, current-vs-forecast distinction, and inspection-first interaction. Weather should explain operational consequences, not paint the map with decorative noise.

The main scope risk is trying to support roads, aviation, drones, maritime, wildfire, and forecasts equally in v1. The mitigation is to make v1 road-weather-first while preserving schema concepts for atmospheric layers, forecast products, and fields. Aviation and drones can use basic visibility/wind in v1, but full vertical weather structure belongs later.

The main data-model risk is choosing only polygons or only grids too early. The mitigation is a hybrid projection model: polygons for zones, lines for road conditions and treatment, points for observations, and future fields for continuous values. This matches the different shapes of weather information without forcing everything into one representation.

The main testability risk is stochastic or hidden behavior. The mitigation is deterministic clock-driven updates, explicit scenario inputs, no external network dependency, and tests for each physical rule: accumulation, freezing, melting, treatment, route impact, forecast display, and snapshot restore.

The revised conclusion after this review is unchanged but sharper: implement v1 as a deterministic, scenario-driven, sparse, TypeScript weather pack focused on ground-condition and route-impact simulation, with atmospheric and forecast concepts included as structured scenario data. Defer external weather models, real forecast ingestion, full grids, and automatic weather-aware rerouting until the projection and UI foundations are proven.

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
