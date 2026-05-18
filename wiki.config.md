# Wiki Configuration

## Domain

This wiki covers Leitbild: a map-based control-center research platform for supervising, dispatching, and studying moving operational entities such as ambulances, drones, vehicles, vessels, robots, and simulated agents.

The audience is mixed. Human visitors need quick orientation and tutorials. AI agents need compact, stable, markdown-readable operational rules, scenario descriptions, command/API guidance, and concept definitions that can be retrieved without loading the Leitbild codebase.

## Writing Approach

Pages are compact reference articles, not scattered micro-notes. Each page should be useful when fetched alone by an AI agent. Prefer strong section headings, explicit terminology, concrete examples, and short operational checklists. Avoid implementation trivia unless it affects how humans or agents should operate Leitbild.

Canonical executable scenario data currently lives in the Leitbild application repository. Scenario JSON mirrored here must say where it came from and when it was copied. The wiki may become a source of truth for selected specifications later, but V1 is a documentation and mirror layer.

## Quality Rules

- Summary pages: minimum 250 words
- Concept pages: minimum 500 words, link to >= 3 related pages
- Domain pages: minimum 500 words, link to >= 2 related pages
- Agent pages: minimum 500 words, link to >= 2 related pages
- Spec pages: minimum 500 words, link to >= 2 related pages
- Scenario pages: minimum 500 words, link to >= 2 related pages
- Source paths in frontmatter must match actual files in raw/ when sources are declared.
- Mermaid diagrams should be used for architecture and flow where useful.
- Every paragraph and list item in the rendered site should expose a feedback affordance that opens a GitHub issue.
