---
title: Scenarios
type: scenario
---

# Scenarios

## Scenario Catalog

Leitbild currently ships two public scenario configs: Oslo ambulance tutorial and Halden ambulance response. Both activate the ambulance and traffic packs. Both provide a declared surface with map, object rail, footer, and scenario guidance. Both include scenario scripts that can show guidance, highlight objects, create objects, update incident facts, and clear or delete traffic conditions.

## How Scenario Runs Work

A scenario definition is reusable. A scenario run is a live control instance created from that definition. Opening `/i/halden` creates a new Halden run. Opening `/i/halden/sandbox` joins a named run. Reloading a concrete run should rejoin that run rather than recreate the scenario from scratch.

## How Scenario JSON Is Mirrored

The JSON below is mirrored from the Leitbild application repository. The executable source of truth is currently the application repo. The wiki copy is for reading, review, AI retrieval, and future automation design.

## Oslo Ambulance

### Purpose

Oslo is a richer tutorial scenario. It starts with several hospitals, multiple ambulances, existing patient transports, unresolved incidents, a resolved incident, and traffic conditions. It is designed to show that a scenario can begin in the middle of an operational situation rather than from an empty map.

### URL

Open [https://leitbild.samsinn.app/i/oslo-ambulance](https://leitbild.samsinn.app/i/oslo-ambulance) to create a new run, or choose Oslo from the scenario picker.

### Starting State

Oslo starts with Oslo University Hospital, Lovisenberg Hospital, and Aker Emergency Clinic. Ambulance A-12 is available. Ambulance A-21 and Ambulance A-34 are already transporting patients to hospitals. Incidents include a resolved Storo collision, a partly handled Torshov bicycle crash, and an unattended Grønland multi-car crash. Traffic includes a Ring 2 slowdown.

### Scheduled Events

The script clarifies the partly handled incident, adds traffic around Marienlyst, creates a new Majorstuen tram stop incident, updates victim counts, clears traffic, introduces a larger Ring 3 pile-up, and later revises the Grønland assessment.

### Operator Goal

The operator should inspect the unattended and updated incidents, dispatch enough ambulance capacity, watch hospital trauma beds, and account for traffic. Update guidance titles are red to distinguish new scenario information from startup instructions.

### AI Agent Notes

An AI dispatch assistant should check victim counts and hospital capacity before dispatching. It should avoid redirecting ambulances already transporting patients unless explicitly asked. It should treat traffic updates as context for recommendations, not as proof that automatic rerouting has occurred.

### Scenario JSON

```json
{
  "id": "oslo-ambulance",
  "schemaVersion": 1,
  "title": "Oslo ambulance tutorial",
  "description": "A timed Oslo ambulance dispatch scenario with existing transports, unresolved incidents, traffic conditions, and tutorial guidance.",
  "packs": ["ambulance", "traffic"],
  "providerOverrides": {},
  "world": {
    "startsAt": "2026-01-01T09:00:00.000Z",
    "mapCenter": [10.7522, 59.9139],
    "environment": {
      "city": "Oslo",
      "mode": "tutorial"
    }
  },
  "objects": [
    {
      "pack": "ambulance",
      "type": "hospital",
      "id": "facility:ous",
      "label": "Oslo University Hospital",
      "position": [10.7387, 59.9365],
      "traumaBeds": { "total": 4, "available": 2 }
    },
    {
      "pack": "ambulance",
      "type": "hospital",
      "id": "facility:lovisenberg",
      "label": "Lovisenberg Hospital",
      "position": [10.7519, 59.9326],
      "traumaBeds": { "total": 5, "available": 4 }
    },
    {
      "pack": "ambulance",
      "type": "hospital",
      "id": "facility:aker",
      "label": "Aker Emergency Clinic",
      "position": [10.8001, 59.9391],
      "traumaBeds": { "total": 6, "available": 5 }
    },
    {
      "pack": "ambulance",
      "type": "ambulance",
      "id": "amb:a12",
      "label": "Ambulance A-12",
      "atObject": "facility:ous",
      "equipment": ["defibrillator", "ventilator"]
    },
    {
      "pack": "ambulance",
      "type": "ambulance",
      "id": "amb:a21",
      "label": "Ambulance A-21",
      "position": [10.7707, 59.9146],
      "equipment": ["defibrillator"],
      "patientsOnBoard": 1,
      "targetId": "facility:ous",
      "status": "transporting"
    },
    {
      "pack": "ambulance",
      "type": "ambulance",
      "id": "amb:a34",
      "label": "Ambulance A-34",
      "position": [10.7828, 59.9237],
      "equipment": ["defibrillator"],
      "patientsOnBoard": 1,
      "targetId": "facility:lovisenberg",
      "status": "transporting"
    },
    {
      "pack": "ambulance",
      "type": "incident",
      "id": "incident:storo-cleared",
      "label": "Storo collision",
      "position": [10.7874, 59.9460],
      "triage": "yellow",
      "victims": { "state": "confirmed", "count": 0 },
      "status": "resolved"
    },
    {
      "pack": "ambulance",
      "type": "incident",
      "id": "incident:torshov-partial",
      "label": "Torshov bicycle crash",
      "position": [10.7750, 59.9328],
      "triage": "yellow",
      "victims": { "state": "unknown" }
    },
    {
      "pack": "ambulance",
      "type": "incident",
      "id": "incident:gronland-unattended",
      "label": "Grønland multi-car crash",
      "position": [10.7628, 59.9124],
      "triage": "red",
      "victims": { "state": "confirmed", "count": 3 }
    },
    {
      "pack": "traffic",
      "type": "traffic_condition",
      "id": "traffic:ring2-slowdown",
      "label": "Ring 2 slowdown",
      "geometryMode": "road_segment",
      "from": [10.7019, 59.9294],
      "to": [10.7854, 59.9253],
      "condition": "slowdown",
      "severity": "high",
      "speedFactor": 0.45,
      "reason": "Queue spillback after minor collision"
    }
  ],
  "initialContexts": [],
  "providerConfigs": {
    "ambulance": {},
    "traffic": {}
  },
  "surface": {
    "schemaVersion": 1,
    "regions": [
      {
        "id": "main-map",
        "primitive": "map",
        "visible": true,
        "config": {
          "center": [10.7522, 59.9139],
          "zoom": 12,
          "layers": ["objects", "routes", "traffic", "highlights"]
        }
      },
      {
        "id": "left-rail",
        "primitive": "objectRail",
        "visible": true,
        "config": {
          "width": 360,
          "sections": [
            {
              "categoryId": "hospitals",
              "visible": true,
              "collapsed": false,
              "visibleFields": ["trauma-beds"]
            },
            {
              "categoryId": "ambulances",
              "visible": true,
              "collapsed": false,
              "visibleFields": []
            },
            {
              "categoryId": "incidents",
              "visible": true,
              "collapsed": false,
              "visibleFields": ["victims"]
            },
            {
              "categoryId": "traffic",
              "visible": true,
              "collapsed": false,
              "visibleFields": ["severity", "reason"]
            }
          ]
        }
      },
      {
        "id": "system-footer",
        "primitive": "systemFooter",
        "visible": true,
        "config": {}
      },
      {
        "id": "guidance-overlay",
        "primitive": "guidanceOverlay",
        "visible": true,
        "config": {}
      }
    ]
  },
  "script": {
    "steps": [
      {
        "id": "scenario-started",
        "at": { "kind": "after_scenario_start", "seconds": 0 },
        "actions": [
          {
            "type": "show_guidance",
            "guidance": {
              "id": "welcome",
              "title": "Dispatch overview",
              "message": "Oslo is already active: one incident is resolved, one is partly handled, one red incident is unattended, and Ring 2 is slow. To dispatch, select an available ambulance in the rail or on the map, then click an incident or hospital target. A left-pointing arrow means outbound to an incident; a right-pointing arrow means inbound to a hospital. Dispatch enough ambulance capacity to cover the victims. Use the eye icons in the rail to show details such as victims, beds, traffic severity, and route information.",
              "objectIds": ["amb:a12", "incident:gronland-unattended", "traffic:ring2-slowdown"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["amb:a12", "incident:gronland-unattended", "traffic:ring2-slowdown"]
          }
        ]
      },
      {
        "id": "partial-incident-clarified",
        "at": { "kind": "after_scenario_start", "seconds": 45 },
        "actions": [
          {
            "type": "update_object",
            "objectId": "incident:torshov-partial",
            "operation": {
              "pack": "ambulance",
              "type": "set_incident_victims",
              "victims": { "state": "estimated", "count": 1 }
            }
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "partial-clarified",
              "title": "New incident information",
              "tone": "update",
              "message": "Radio update: the Torshov bicycle crash has one remaining patient after the first ambulance departed with another patient.",
              "objectIds": ["incident:torshov-partial"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["incident:torshov-partial"]
          }
        ]
      },
      {
        "id": "marienlyst-traffic-created",
        "at": { "kind": "after_scenario_start", "seconds": 90 },
        "actions": [
          {
            "type": "create_object",
            "object": {
              "pack": "traffic",
              "type": "traffic_condition",
              "id": "traffic:marienlyst-event",
              "label": "Marienlyst area slowdown",
              "geometryMode": "area",
              "polygon": [
                [10.7235, 59.9338],
                [10.7394, 59.9340],
                [10.7420, 59.9252],
                [10.7250, 59.9244],
                [10.7235, 59.9338]
              ],
              "condition": "congestion",
              "severity": "moderate",
              "speedFactor": 0.65,
              "reason": "Event crowding around Marienlyst"
            }
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "marienlyst-traffic-created",
              "title": "Traffic provider update",
              "tone": "update",
              "message": "A traffic area has been added by the traffic pack. Watch for route impacts when ambulances cross affected areas.",
              "objectIds": ["traffic:marienlyst-event"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["traffic:marienlyst-event"]
          }
        ]
      },
      {
        "id": "majorstuen-created",
        "at": { "kind": "after_scenario_start", "seconds": 120 },
        "actions": [
          {
            "type": "create_object",
            "object": {
              "pack": "ambulance",
              "type": "incident",
              "id": "incident:majorstuen-tram",
              "label": "Majorstuen tram stop fall",
              "position": [10.7146, 59.9292],
              "triage": "yellow",
              "victims": { "state": "unknown" }
            }
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "majorstuen-created",
              "title": "New incident",
              "message": "A fall at Majorstuen tram stop has been reported. Victim count is unknown; dispatch decisions may need to account for uncertainty.",
              "objectIds": ["incident:majorstuen-tram"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["incident:majorstuen-tram"]
          }
        ]
      },
      {
        "id": "majorstuen-clarified",
        "at": { "kind": "after_scenario_start", "seconds": 165 },
        "actions": [
          {
            "type": "update_object",
            "objectId": "incident:majorstuen-tram",
            "operation": {
              "pack": "ambulance",
              "type": "set_incident_victims",
              "victims": { "state": "estimated", "count": 2 }
            }
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "majorstuen-clarified",
              "title": "Victim count updated",
              "tone": "update",
              "message": "Bystander report now estimates two patients at Majorstuen. Watch how the incident status changes as resources are assigned.",
              "objectIds": ["incident:majorstuen-tram"],
              "dismissible": true
            }
          }
        ]
      },
      {
        "id": "ring2-traffic-cleared",
        "at": { "kind": "after_scenario_start", "seconds": 240 },
        "actions": [
          {
            "type": "delete_object",
            "objectId": "traffic:ring2-slowdown"
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "ring2-traffic-cleared",
              "title": "Traffic cleared",
              "tone": "update",
              "message": "The original Ring 2 slowdown has cleared. Traffic conditions can disappear while incidents continue.",
              "objectIds": ["traffic:marienlyst-event"],
              "dismissible": true
            }
          }
        ]
      },
      {
        "id": "ring-three-created",
        "at": { "kind": "after_scenario_start", "seconds": 300 },
        "actions": [
          {
            "type": "create_object",
            "object": {
              "pack": "ambulance",
              "type": "incident",
              "id": "incident:ring3-pileup",
              "label": "Ring 3 pile-up",
              "position": [10.8061, 59.9362],
              "triage": "red",
              "victims": { "state": "confirmed", "count": 4 }
            }
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "ring-three-created",
              "title": "Escalation",
              "message": "A Ring 3 pile-up has four reported victims. This is deliberately too much for one ambulance and should force prioritization.",
              "objectIds": ["incident:ring3-pileup"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["incident:ring3-pileup"]
          }
        ]
      },
      {
        "id": "gronland-revised",
        "at": { "kind": "after_scenario_start", "seconds": 360 },
        "actions": [
          {
            "type": "update_object",
            "objectId": "incident:gronland-unattended",
            "operation": {
              "pack": "ambulance",
              "type": "set_incident_victims",
              "victims": { "state": "estimated", "count": 2 }
            }
          },
          {
            "type": "delete_object",
            "objectId": "traffic:marienlyst-event"
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "gronland-revised",
              "title": "Assessment revised",
              "tone": "update",
              "message": "Police update: the Grønland victim estimate is revised from three to two, and the temporary Marienlyst traffic condition has cleared.",
              "objectIds": ["incident:gronland-unattended"],
              "dismissible": true
            }
          }
        ]
      }
    ]
  }
}
```

## Halden

### Purpose

Halden is a compact scenario for checking scenario switching, routed traffic, hospital capacity, and dispatch basics. It is smaller than Oslo and is a good first demonstration for casual visitors.

### URL

Open [https://leitbild.samsinn.app/i/halden](https://leitbild.samsinn.app/i/halden) to create a new run, or choose Halden from the scenario picker.

### Starting State

Halden starts with Halden Emergency Clinic, Østfold Hospital Kalnes, three ambulances, two incidents, and a downtown traffic slowdown. One ambulance is already transporting a patient toward a hospital. The bridge road collision has two confirmed victims, while the harbor fall injury begins with an estimated victim count.

### Scheduled Events

The script updates the harbor victim count, adds a south bridge queue, creates a new fortress stair fall incident, clarifies that incident's victim estimate, and later clears the original center slowdown.

### Operator Goal

The operator should dispatch an ambulance to the bridge road collision, monitor the harbor update, inspect traffic, and keep enough ambulance capacity available for the later fortress incident.

### AI Agent Notes

An AI agent should treat Halden as the simpler operating environment. It should use the scenario to verify basic dispatch logic, status arrows, hospital capacity checks, and timed updates before attempting more complex Oslo recommendations.

### Scenario JSON

```json
{
  "id": "halden",
  "schemaVersion": 1,
  "title": "Halden ambulance response",
  "description": "A compact Halden scenario for checking scenario switching, routed traffic, hospital capacity, and dispatch basics.",
  "packs": ["ambulance", "traffic"],
  "providerOverrides": {},
  "world": {
    "startsAt": "2026-01-01T10:00:00.000Z",
    "mapCenter": [11.3870, 59.1248],
    "environment": {
      "city": "Halden",
      "mode": "scenario-check"
    }
  },
  "objects": [
    {
      "pack": "ambulance",
      "type": "hospital",
      "id": "facility:halden-hospital",
      "label": "Halden Emergency Clinic",
      "position": [11.3747, 59.1222],
      "traumaBeds": { "total": 4, "available": 3 }
    },
    {
      "pack": "ambulance",
      "type": "hospital",
      "id": "facility:kalnes",
      "label": "Østfold Hospital Kalnes",
      "position": [11.0328, 59.3197],
      "traumaBeds": { "total": 6, "available": 5 }
    },
    {
      "pack": "ambulance",
      "type": "ambulance",
      "id": "amb:halden-1",
      "label": "Halden Ambulance 1",
      "atObject": "facility:halden-hospital",
      "equipment": ["defibrillator", "ventilator"]
    },
    {
      "pack": "ambulance",
      "type": "ambulance",
      "id": "amb:halden-2",
      "label": "Halden Ambulance 2",
      "position": [11.3893, 59.1212],
      "equipment": ["defibrillator"]
    },
    {
      "pack": "ambulance",
      "type": "ambulance",
      "id": "amb:halden-3",
      "label": "Halden Ambulance 3",
      "position": [11.3796, 59.1178],
      "equipment": ["stretcher", "oxygen"],
      "patientsOnBoard": 1,
      "targetId": "facility:halden-hospital",
      "status": "transporting"
    },
    {
      "pack": "ambulance",
      "type": "incident",
      "id": "incident:halden-harbor",
      "label": "Harbor fall injury",
      "position": [11.3832, 59.1168],
      "triage": "yellow",
      "victims": { "state": "estimated", "count": 1 }
    },
    {
      "pack": "ambulance",
      "type": "incident",
      "id": "incident:halden-bridge",
      "label": "Bridge road collision",
      "position": [11.3923, 59.1265],
      "triage": "red",
      "victims": { "state": "confirmed", "count": 2 }
    },
    {
      "pack": "traffic",
      "type": "traffic_condition",
      "id": "traffic:halden-center-slowdown",
      "label": "Halden center slowdown",
      "geometryMode": "road_segment",
      "from": [11.3705, 59.1223],
      "to": [11.3984, 59.1289],
      "condition": "slowdown",
      "severity": "moderate",
      "speedFactor": 0.65,
      "reason": "Downtown queueing near the bridge"
    }
  ],
  "initialContexts": [],
  "providerConfigs": {
    "ambulance": {},
    "traffic": {}
  },
  "surface": {
    "schemaVersion": 1,
    "regions": [
      {
        "id": "main-map",
        "primitive": "map",
        "visible": true,
        "config": {
          "center": [11.3870, 59.1248],
          "zoom": 13,
          "layers": ["objects", "routes", "traffic", "highlights"]
        }
      },
      {
        "id": "left-rail",
        "primitive": "objectRail",
        "visible": true,
        "config": {
          "width": 360,
          "sections": [
            { "categoryId": "hospitals", "visible": true, "collapsed": false, "visibleFields": ["trauma-beds"] },
            { "categoryId": "ambulances", "visible": true, "collapsed": false, "visibleFields": [] },
            { "categoryId": "incidents", "visible": true, "collapsed": false, "visibleFields": ["victims"] },
            { "categoryId": "traffic", "visible": true, "collapsed": false, "visibleFields": ["severity", "reason"] }
          ]
        }
      },
      { "id": "system-footer", "primitive": "systemFooter", "visible": true, "config": {} },
      { "id": "guidance-overlay", "primitive": "guidanceOverlay", "visible": true, "config": {} }
    ]
  },
  "script": {
    "steps": [
      {
        "id": "scenario-started",
        "at": { "kind": "after_scenario_start", "seconds": 0 },
        "actions": [
          {
            "type": "show_guidance",
            "guidance": {
              "id": "halden-welcome",
              "title": "Halden scenario",
              "message": "This scenario proves that Leitbild can assemble a different city surface from the scenario definition. To dispatch, select an ambulance in the rail or on the map, then click an incident or hospital target. A left-pointing arrow means outbound to an incident; a right-pointing arrow means inbound to a hospital. Dispatch enough ambulance capacity to cover the victims. Use the eye icons in the rail to show details such as victims, beds, traffic severity, and route information.",
              "objectIds": ["amb:halden-1", "incident:halden-bridge", "traffic:halden-center-slowdown"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["amb:halden-1", "incident:halden-bridge", "traffic:halden-center-slowdown"]
          }
        ]
      },
      {
        "id": "harbor-victim-clarified",
        "at": { "kind": "after_scenario_start", "seconds": 45 },
        "actions": [
          {
            "type": "update_object",
            "objectId": "incident:halden-harbor",
            "operation": {
              "pack": "ambulance",
              "type": "set_incident_victims",
              "victims": { "state": "confirmed", "count": 2 }
            }
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "halden-harbor-update",
              "title": "Harbor incident updated",
              "tone": "update",
              "message": "Harbor responders now report two confirmed victims. Check whether the currently assigned resources are still enough.",
              "objectIds": ["incident:halden-harbor"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["incident:halden-harbor"]
          }
        ]
      },
      {
        "id": "south-queue-started",
        "at": { "kind": "after_scenario_start", "seconds": 90 },
        "actions": [
          {
            "type": "create_object",
            "object": {
              "pack": "traffic",
              "type": "traffic_condition",
              "id": "traffic:halden-south-queue",
              "label": "South bridge queue",
              "geometryMode": "road_segment",
              "from": [11.3773, 59.1157],
              "to": [11.3914, 59.1204],
              "condition": "congestion",
              "severity": "high",
              "speedFactor": 0.42,
              "reason": "Queue forming after southbound bridge approach"
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["traffic:halden-south-queue"]
          }
        ]
      },
      {
        "id": "fortress-incident-created",
        "at": { "kind": "after_scenario_start", "seconds": 120 },
        "actions": [
          {
            "type": "create_object",
            "object": {
              "pack": "ambulance",
              "type": "incident",
              "id": "incident:halden-fortress",
              "label": "Fortress stair fall",
              "position": [11.3992, 59.1194],
              "triage": "yellow",
              "victims": { "state": "unknown" }
            }
          },
          {
            "type": "show_guidance",
            "guidance": {
              "id": "halden-new-incident",
              "title": "New incident",
              "message": "A new fall injury has been reported near the fortress. Victim count is initially unknown; keep monitoring for an update.",
              "objectIds": ["incident:halden-fortress"],
              "dismissible": true
            }
          },
          {
            "type": "highlight_objects",
            "objectIds": ["incident:halden-fortress"]
          }
        ]
      },
      {
        "id": "fortress-victims-clarified",
        "at": { "kind": "after_scenario_start", "seconds": 165 },
        "actions": [
          {
            "type": "update_object",
            "objectId": "incident:halden-fortress",
            "operation": {
              "pack": "ambulance",
              "type": "set_incident_victims",
              "victims": { "state": "estimated", "count": 2 }
            }
          }
        ]
      },
      {
        "id": "center-slowdown-cleared",
        "at": { "kind": "after_scenario_start", "seconds": 240 },
        "actions": [
          {
            "type": "delete_object",
            "objectId": "traffic:halden-center-slowdown"
          },
          {
            "type": "clear_highlights",
            "objectIds": ["traffic:halden-center-slowdown", "traffic:halden-south-queue", "incident:halden-harbor", "incident:halden-fortress"]
          }
        ]
      }
    ]
  }
}
```

Related pages: [[start-here]], [[tutorials]], [[concepts]], [[domains/ambulance]], [[domains/traffic]], [[agent-guides]], [[specs]].
