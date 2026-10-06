---
name: roo-architect
description: >-
  Designs robust system architecture, database models, and API interfaces before coding.
  Activate when the user asks to plan a new system, design an architecture blueprint,
  or evaluate technology and schema decisions.
---

# Roo Code Architect Runbook

Use this runbook to architect software features and system expansions with high structural integrity.

## Architecture Blueprint Workflow

1. **Requirements Ingestion**:
   - Extract primary functional requirements (FRs) and non-functional requirements (NFRs: latency, throughput, scale).
   - Identify actors, data entities, and system boundaries.

2. **Interface & Schema Design**:
   - Define exact API contracts: HTTP methods, route paths, request payloads, response schemas, and status codes.
   - Design database entity relationships (foreign keys, indexes, constraints).

3. **Component Interaction Mapping**:
   - Detail data flow between frontend UI components, API gateways, backend services, and storage.
   - Highlight potential failure modes (timeouts, network drops, unhandled exceptions).

4. **Blueprint Delivery**:
   - Provide a structured markdown artifact or summary containing the complete architecture blueprint for user sign-off before transitioning to Code Mode.
