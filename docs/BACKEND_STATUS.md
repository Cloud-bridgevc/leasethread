# What is real vs. simulated

| Feature | Status |
|---|---|
| UI, routing, dashboards, state | Working (in-memory; resets on reload) |
| AI triage | Simulated with rule engine (`src/lib/triage.ts`); Bedrock handler drafted in `backend/lambdas/triage.ts` |
| Lease extraction | Regex over fictional sample text; real pipeline not implemented |
| Operations assistant | Keyword matching over sample data; Bedrock tool-calling not implemented |
| Renewal risk, reports | Working, rule-based on sample data |
| Auth / multi-tenancy | Not implemented (simulated user) |
| File upload (S3), email/SMS, notifications delivery | Not implemented |
| HubSpot | Planned (docs/HUBSPOT.md); demo form stores nothing |
| Infra | Sketches only (`backend/infra/template.yaml`), never deployed or validated |

Planned endpoints: POST /api/triage, POST /api/assistant, POST /api/documents/upload-url, GET/POST /api/requests, GET /api/leases, POST /api/leads.
