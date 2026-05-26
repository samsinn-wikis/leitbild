---
title: Airspace
type: domain
---

# Airspace

!!! note "Status"
    Skeleton. Established in Phase A.0 (ADR 0019 / 0020 / 0021). Concrete coverage counts, screenshots, and worked scenarios are filled in during Phase A.7 once the `aero-norway` dataset is promoted in production.

Airspace is the first concrete reference dataset in Leitbild. It supplies Norwegian flight-information regions, terminal areas, control zones, restricted and prohibited airspace, danger areas, class-A through class-G boundaries, and authoritative Avinor airport points. It feeds both the map display and the server-side spatial index used by packs that reason about airspace context.

See [[reference-data|Reference Data]] for the generic abstraction.

## Dataset identity

- **Dataset id**: `aero-norway`
- **Categories**: FIR, UIR, TMA, CTA, CTR, ATZ, R, P, D, TSA, TRA, CBA, training, class_a … class_g, airport
- **Coverage**: ENOR (Norway), including offshore extensions for Stavanger and Bodø FIRs
- **AIRAC reference**: shown in the build manifest and surfaced in the map's status pill

## Data sources

| Layer | Source | Licence | Refresh |
|---|---|---|---|
| Airspace polygons | OpenAIP API V2 | CC BY-NC-SA 4.0 | Weekly conditional, AIRAC-aligned |
| Airport points (ICAO, name, position) | GeoNorge `Lufthavnpunkt Avinor WFS` | NLOD 2.0 | Weekly conditional |
| Scenario-specific overlays (e.g. Halden exclusion zone) | Hand-authored GeoJSON in `data/reference/manual/` | Repo-owned | On commit |

ADR 0020 records why these sources were chosen and why aero-nav was rejected.

## Rendering

A style module in `src/ui/map/dataset-styles/aero-norway.ts` declares paint and layout per category. The recipe is inspired by VATSIM Radar's sector styling: subtle fill (≈0.05–0.10 base opacity), thin stroke (≈1 px, 0.5 opacity), increased opacity on hover, dashed strokes for restricted / danger / training-style polygons, halo'd labels with collision avoidance.

Per-category visibility is governed by zoom hints declared in the dataset config. Large polygons (FIR / UIR) hide when zoomed out and appear at low zoom; small polygons (ATZ) only appear when zoomed in.

The full colour and zoom table is rendered into this page during Phase A.7.

## Layer toggles

A `MapLayersPanel` in the UI lets operators toggle categories independently. The panel is generated from the capability manifest, not hard-coded; new categories from future AIRAC releases require no UI change.

Default visibility:

- ON: CTA / TMA, CTR, restricted / prohibited / danger.
- OFF: FIR / UIR (visual clutter), ATZ (only useful at high zoom), class A–G (advanced).

Per-operator overrides persist in `localStorage` per Control Instance.

## Hover details

Hovering a polygon or pinning a selection surfaces:

- Name, ICAO reference (when applicable), category pill
- Floor and ceiling with original references (e.g. `GND`, `FL095`, `1500 ft AMSL`, `UNL`, `BY NOTAM`)
- Class letter, controlling frequency (when known), activity status (permanent / scheduled / NOTAM)
- AIRAC badge with current build id
- Live count of ADSB aircraft currently inside the polygon (computed by joining the live ADSB fleet snapshot with the server-side spatial index)

Hover priority: aircraft take precedence over airspace when both are under the cursor.

## Attribution

The map's attribution control composes per-licence:

```
Map © OpenStreetMap contributors
Airspace © OpenAIP contributors · CC BY-NC-SA 4.0
Airports © Avinor · NLOD 2.0
```

These lines are emitted from the per-tileset licences declared in `/map/capabilities.json`. No hard-coded attribution.

## Cross-pack interactions

- **ADSB pack** consumes the airspace layer through the server-side spatial index. The hover card on an aircraft shows the containing airspace and a banner when inside a restricted, prohibited, or danger area. ADSB does not mutate airspace data.
- **Process-plant pack** is not coupled to airspace, but scenario authors use a hand-authored exclusion-zone GeoJSON to communicate plant-vicinity airspace constraints in the Halden scenario.

## Coverage audit

Promote is gated on minimum feature counts per category to catch upstream regressions. Current thresholds are documented in `datasets/aero-norway.ts`. Initial baseline:

- FIR ≥ 2 (Bodø, Stavanger)
- TMA ≥ 10
- CTR ≥ 8
- Airport ≥ 40

Build failure preserves the previous release.

## Cadence and lifecycle

- Weekly Thursday 03:30 UTC, weekly conditional GET against both upstream sources.
- AIRAC effective dates change polygons; the weekly cadence catches both AIRAC dates and community edits between cycles.
- Manual overlays change on commit.

## Known limitations

- OpenAIP is community-maintained; coverage gaps are possible for less-trafficked airspace such as military restricted areas, glider/PG zones, and recent NOTAM-driven changes.
- Avinor's authoritative airspace lives in the eAIP as HTML / PDF and is not available as open structured geodata. Where OpenAIP has gaps for scenario-critical airspace, we author manual overlays.
- Vertical limits with non-standard tokens (`BY NOTAM`, `STD`, `UNL`) are preserved in the original-reference field; numeric conversion to metres is best-effort and documented per token.

## Related

- [[reference-data|Reference Data]] — generic abstraction.
- ADRs **0019**, **0020**, **0021** in the application repo.
- `docs/reference-data-pipeline.md` in the application repo for the operator runbook.
