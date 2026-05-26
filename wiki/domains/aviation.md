---
title: Aviation
type: domain
---

# Aviation

!!! note "Status"
    Pack restructure under way (Phase B). This page renames `domains/airspace.md` and broadens its scope to cover the new `aviation` pack: airspace context plus live aircraft from OpenSky and VATSIM. Concrete coverage counts, screenshots, and worked scenarios are filled in once Phase B.4 ships.

Aviation in Leitbild is one pack at `src/packs/aviation/`. It owns three things:

- **Airspace context** — Norwegian airspace polygons (OpenAIP) plus Avinor airport points (GeoNorge), served as a per-pack tileset `aero-norway`.
- **Live aircraft** — Real-time fleet from OpenSky or VATSIM, switchable at runtime via the pack's rail control.
- **Manual overlays** — Scenario-specific geometry (e.g. the Halden NPP exclusion zone) authored as repo-tracked GeoJSON inside the pack.

See [[reference-data|Reference Data]] for the generic pipeline the pack rides on. See `docs/adr/0022-aviation-pack-and-pack-owned-reference-data.md` in the application repo for the architecture decision.

## Activation

The pack is opt-in. A scenario activates it by listing `aviation` in its `packs:` array. Existing scenarios (Halden, Oslo) do not include it; new scenarios (`norway-airspace`, future `halden-aviation`) do.

## Dataset

- **Dataset id**: `aero-norway`
- **Categories on the map**: FIR, UIR, CTA, TMA, CTR, ATZ, R, P, D, warning, RMZ, TMZ, MATZ, training, airport, exclusion, plus future radar-coverage and TFR.
- **Coverage**: ENOR (Norway), including offshore extensions for Stavanger and Bodø FIRs.
- **AIRAC reference**: surfaced in the build manifest.

### Sources

| Layer | Source | Licence | Refresh |
|---|---|---|---|
| Airspace polygons | OpenAIP API V2 | CC BY-NC-SA 4.0 | Weekly conditional, AIRAC-aligned |
| Airport points (ICAO, name, position, elevation) | GeoNorge `Lufthavnpunkt Avinor WFS` | NLOD 2.0 | Weekly conditional |
| Scenario-specific overlays (Halden exclusion zone) | Hand-authored GeoJSON in `src/packs/aviation/data/` | Repo-owned | On commit |

ADR 0020 records why these sources were chosen and why aero-nav was rejected.

## Live aircraft (Phase B.2+)

The pack contributes two simulation providers:

- `aviation.opensky` — OAuth2 client_credentials, 5–10 s poll, bbox-filtered server-side. Free-tier rate-limit aware.
- `aviation.vatsim` — Public JSON poll every 15 s. Includes flight-plan / departure / arrival / route remarks.

A composite source-router holds the active source as private state; the operator switches at runtime via the rail's source picker, which dispatches the `aviation.set_source` command. Switch is atomic: pending fetches cancel, current aircraft delete, new source's first fetch repopulates.

Aircraft are *ephemeral* — they do not persist into Control Instance snapshots. On reconnect, the active provider re-bootstraps from a fresh fetch.

## Rendering

A pack-owned style module declares paint and layout per category. The recipe follows VATSIM Radar's sector styling: subtle fill (≈0.05–0.10 base opacity), thin stroke (≈1 px, 0.5 opacity), increased opacity on hover, dashed strokes for restricted / danger / training-style polygons, halo'd labels with collision avoidance.

Per-category visibility is governed by zoom hints declared in the dataset config. Large polygons (FIR / UIR) hide when zoomed out; small polygons (ATZ) only appear at high zoom.

The full colour and zoom table is rendered into this page once Phase B.4 ships.

## Rail control

When the `aviation` pack is active, the control rail renders a section with:

- A small set of layer-group toggles (Airspace, Airports, Live aircraft). Each toggle is backed by a pack-contributed `mapLayerGroups` entry (see ADR 0023).
- A source picker (radio buttons): OpenSky / VATSIM. Dispatches `aviation.set_source` on change.
- The standard object-rail rows below — one per live aircraft once the live source is active.

Default-on layer groups: Airspace, Airports, Live aircraft. Per-category granularity below a group (FIR vs CTA vs R/P/D) is scenario-configurable in JSON but not exposed in the rail.

State persists in `localStorage` per Control Instance.

## Hover details

Hovering an airspace polygon surfaces name, ICAO reference, floor / ceiling with original units, class letter, frequency (when known), AIRAC badge.

Hovering an aircraft surfaces callsign, altitude (ft and FL), heading, speed, vertical rate, squawk, last-seen age. VATSIM additionally exposes flight-plan departure / arrival / route excerpt. The hover card uses the server-side spatial index to surface the containing airspace ("Inside CTA OSLO TMA") and a red banner when inside restricted / prohibited / danger.

Hover priority: aircraft take precedence over airspace when both are under the cursor.

## Attribution

The map's attribution control composes per-licence, deduplicated by id:

```
Map © OpenStreetMap contributors
Airspace © OpenAIP contributors · CC BY-NC-SA 4.0
Airports © Avinor · NLOD 2.0
```

Emitted from per-tileset `licences[]` declared in `/map/capabilities.json`. No hard-coded attribution strings.

## Coverage audit

Promote is gated on minimum feature counts to catch upstream regressions. Production thresholds for ENOR (live numbers from the first real build):

- FIR ≥ 1 (Bodø OCA on type=15 — OpenAIP carries only one FIR-equivalent for Norway)
- TMA ≥ 10  (real: 93)
- CTR ≥ 8   (real: 19)
- Airport ≥ 40 (real: 43)

Build failure preserves the previous release.

## Cadence and lifecycle

- Weekly Thursday 03:30 UTC, conditional GET against both upstream sources.
- Manual overlays change on commit.
- Live aircraft poll at 5–15 s depending on source.

## Known limitations

- OpenAIP carries one FIR-equivalent for Norway (Bodø OCA on type=15); Stavanger FIR is not exposed via type=10.
- Avinor's authoritative airspace lives in eAIP as HTML / PDF; not available as open structured geodata.
- Free-tier OpenSky imposes a credit limit; adaptive polling backs off when no clients are subscribed.

## Cross-pack interactions

- **Weather pack** — aircraft hover may include weather-at-point via the weather pack's existing pack query.
- **Process-plant pack** — the Halden exclusion overlay sits in the aviation pack's `data/`; the process-plant pack is not coupled to aviation, but operators can author exclusion zones around plant sites and reference them from scenarios that activate both packs.
- **Future drone pack** — would import `aviation/datasets/aero-norway.ts` explicitly if it wanted the same airspace tileset.

## Related

- [[reference-data|Reference Data]] — generic pipeline.
- ADRs **0019**, **0020**, **0021** (Phase A); **0022**, **0023** (Phase B).
- `docs/reference-data-pipeline.md` and `docs/aviation-pack-plan.md` in the application repo.
